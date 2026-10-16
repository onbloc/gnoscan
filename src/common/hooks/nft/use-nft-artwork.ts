import React from "react";
import { useQueries, useQueryClient } from "react-query";

import { requestNftTokenUri } from "@/common/clients/node-client/nft-artwork";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { QUERY_KEY } from "@/common/react-query/query-keys";
import { nftMediaUrl } from "@/common/utils/nft-media.utility";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import type { NftTokenUriModel } from "@/repositories/api/token/response";

interface ArtworkToken {
  packagePath: string;
  nftId: string;
}
interface ArtworkEntry extends NftTokenUriModel {
  packagePath: string;
}
interface RpcArtworkEntry extends NftTokenUriModel {
  // A transient response is still stale, but must not discard an image already displayed.
  fallbackImage?: string;
}

function isBatchSafeNftId(tokenId: string): boolean {
  // The API splits/trims CSV IDs and interpolates its query without URL encoding.
  return tokenId.length > 0 && tokenId.trim() === tokenId && !/[,&#+%\t\r\n]/.test(tokenId);
}

/**
 * Resolves visible-page artwork and pending backend/RPC lookups without replacing usable cached images.
 * Both callers pass at most 22 NFTs, below the API's 50-ID limit.
 */
export function useNftArtwork(nfts: readonly ArtworkToken[]) {
  const { apiTokenRepository } = useServiceProvider();
  const { currentNetwork, nodeRPCClient } = useNetworkProvider();
  const chainId = currentNetwork?.chainId || "";
  const rpcUrl = currentNetwork?.rpcUrl || currentNetwork?.apiUrl || "";
  const queryClient = useQueryClient();
  const batches = React.useMemo(() => {
    const groups = new Map<string, string[]>();
    for (const nft of nfts) {
      if (!nft.packagePath) continue;
      const ids = groups.get(nft.packagePath) ?? [];
      if (!ids.includes(nft.nftId)) ids.push(nft.nftId);
      groups.set(nft.packagePath, ids);
    }
    return Array.from(groups, ([packagePath, tokenIds]) => ({ packagePath, tokenIds }));
  }, [nfts]);
  const cachedArtwork = queryClient
    .getQueriesData<ArtworkEntry[]>([currentNetwork?.chainId || "", QUERY_KEY.getNftTokenUris])
    .flatMap(([, entries]) => entries ?? [])
    .filter(item =>
      batches.some(batch => batch.packagePath === item.packagePath && batch.tokenIds.includes(item.tokenId)),
    );
  const query = useApiRepositoryQuery(
    [QUERY_KEY.getNftTokenUris, batches],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    async repository => {
      const responses = await Promise.allSettled(
        batches.map(async ({ packagePath, tokenIds }) => {
          const apiTokenIds = tokenIds.filter(isBatchSafeNftId);
          if (apiTokenIds.length === 0) return [];
          const response = await repository.getNftTokenUris(packagePath, apiTokenIds);
          return response.items.map(item => ({ ...item, packagePath }));
        }),
      );
      // IDs that cannot round-trip through the API use the same RPC workers and scoped cache.
      const rpcOnly = batches.flatMap(({ packagePath, tokenIds }) =>
        tokenIds
          .filter(tokenId => !isBatchSafeNftId(tokenId))
          .map(
            (tokenId): ArtworkEntry => ({
              packagePath,
              tokenId,
              uri: "",
              status: "unavailable",
              needsRefetch: true,
            }),
          ),
      );
      // A failed realm lookup must not discard other realms or prevent direct RPC lookups.
      return [...responses.flatMap(response => (response.status === "fulfilled" ? response.value : [])), ...rpcOnly];
    },
    {
      enabled: batches.length > 0,
      // Expanding the inventory changes the batch key; reuse artwork already cached on this network.
      placeholderData: cachedArtwork.length > 0 ? cachedArtwork : undefined,
    },
  );
  const data = query.data;
  const flagged = React.useMemo(
    () =>
      data?.filter(
        item =>
          item.needsRefetch &&
          batches.some(batch => batch.packagePath === item.packagePath && batch.tokenIds.includes(item.tokenId)),
      ) ?? [],
    [data, batches],
  );
  const rpcQueries = React.useMemo(
    () =>
      flagged.map(item => {
        const queryKey = [chainId, QUERY_KEY.getNftTokenUriRpc, rpcUrl, item.packagePath, item.tokenId];
        return {
          queryKey,
          queryFn: async (): Promise<RpcArtworkEntry> => {
            if (!nodeRPCClient) throw new Error("FAILED_INITIALIZE_NODE_CLIENT");
            // Capture before awaiting: an unavailable completion must retain the prior RPC image.
            const previous = queryClient.getQueryData<RpcArtworkEntry>(queryKey);
            const fallbackImage =
              (previous?.status === "found" ? nftMediaUrl(previous.image) ?? nftMediaUrl(previous.uri) : undefined) ??
              previous?.fallbackImage;
            try {
              const result = await requestNftTokenUri(nodeRPCClient, item.packagePath, item.tokenId);
              return result.status === "unavailable" || result.needsRefetch ? { ...result, fallbackImage } : result;
            } catch {
              return { tokenId: item.tokenId, uri: "", status: "unavailable", needsRefetch: true, fallbackImage };
            }
          },
          enabled: false,
          retry: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        };
      }),
    [flagged, chainId, rpcUrl, nodeRPCClient, queryClient],
  );
  // Disabled observers publish each fetchQuery completion independently, without automatic refetches.
  const rpcResults = useQueries(rpcQueries);
  // Structural sharing keeps `data` identical across equivalent refetches; each successful API fetch
  // starts a new generation so transient RPC failures can be retried.
  const generation = query.dataUpdatedAt;
  const attempted = React.useRef(new WeakMap<ArtworkEntry[], Set<string>>());
  const [, publishCompletion] = React.useReducer((version: number) => version + 1, 0);
  React.useEffect(() => {
    if (!nodeRPCClient || !data || query.isPlaceholderData || rpcQueries.length === 0) return;
    const scheduled = attempted.current.get(data) ?? new Set<string>();
    attempted.current.set(data, scheduled);
    const pending = rpcQueries.filter(options => !scheduled.has(`${generation}:${JSON.stringify(options.queryKey)}`));
    let cancelled = false;
    let next = 0;
    const work = async () => {
      while (!cancelled && next < pending.length) {
        const options = pending[next++];
        scheduled.add(`${generation}:${JSON.stringify(options.queryKey)}`);
        const cached = queryClient.getQueryData<RpcArtworkEntry>(options.queryKey);
        try {
          await queryClient.fetchQuery({
            ...options,
            // Only completed results are reusable as fresh. A later API batch can retry transient failures.
            staleTime: cached && cached.status !== "unavailable" && !cached.needsRefetch ? 60_000 : 0,
          });
        } catch {
          // A failed token must not prevent this worker from completing the remaining visible tokens.
        } finally {
          // Reusing a fresh cached no-art result may not notify the disabled observer.
          if (!cancelled) publishCompletion();
        }
      }
    };
    for (let worker = 0; worker < Math.min(8, pending.length); worker++) void work();
    return () => {
      // In-flight queries may finish in their old scoped cache, but no more stale work is scheduled.
      cancelled = true;
    };
  }, [nodeRPCClient, data, generation, rpcQueries, queryClient, query.isPlaceholderData]);

  return React.useCallback(
    (packagePath: string, nftId: string): { src: string | undefined; isLoading: boolean } => {
      const item = data?.find(item => item.packagePath === packagePath && item.tokenId === nftId);
      const image = item?.status === "found" ? nftMediaUrl(item.image) ?? nftMediaUrl(item.uri) : undefined;
      const index = item?.needsRefetch
        ? flagged.findIndex(entry => entry.packagePath === packagePath && entry.tokenId === nftId)
        : -1;
      const rpcResult = index >= 0 ? rpcResults[index] : undefined;
      const rpc = rpcResult?.data;
      const rpcImage = rpc?.status === "found" ? nftMediaUrl(rpc.image) ?? nftMediaUrl(rpc.uri) : undefined;
      // A completed lookup without artwork clears stale images; only transient failures retain them.
      const rpcComplete = !!rpc && !rpc.needsRefetch && rpc.status !== "unavailable";
      let src = rpcComplete ? rpcImage : rpcImage || rpc?.fallbackImage || image;
      // Fresh backend data is authoritative even when an older RPC result exists.
      const backendComplete = !!item && item.status !== "unavailable" && !item.needsRefetch;
      if (!src && !rpcComplete && !backendComplete) {
        // A pending/failed expanded batch must not blank artwork already shown for the same NFT.
        const cached = cachedArtwork.find(
          entry => entry.packagePath === packagePath && entry.tokenId === nftId && entry.status === "found",
        );
        src = cached ? nftMediaUrl(cached.image) ?? nftMediaUrl(cached.uri) : undefined;
      }
      const scheduled = data ? attempted.current.get(data) : undefined;
      // Queued tokens are pending before their worker starts; disabled isLoading is not evidence of work.
      const rpcPending =
        index >= 0 &&
        (rpcResult?.isFetching ||
          (!!nodeRPCClient &&
            !query.isPlaceholderData &&
            !scheduled?.has(`${generation}:${JSON.stringify(rpcQueries[index].queryKey)}`)));
      return {
        src,
        isLoading: !src && (query.isFetching || (batches.length > 0 && query.isLoading) || rpcPending),
      };
    },
    [
      data,
      cachedArtwork,
      flagged,
      generation,
      rpcResults,
      rpcQueries,
      nodeRPCClient,
      batches.length,
      query.isFetching,
      query.isLoading,
      query.isPlaceholderData,
    ],
  );
}
