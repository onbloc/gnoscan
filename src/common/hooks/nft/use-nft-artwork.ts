import React from "react";
import { useQueryClient } from "react-query";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { QUERY_KEY } from "@/common/react-query/query-keys";
import { nftMediaUrl } from "@/common/utils/nft-media.utility";
import { API_REPOSITORY_KEY } from "@/common/values/query.constant";
import { NftTokenUriModel } from "@/repositories/api/token/response";

interface ArtworkToken {
  packagePath: string;
  nftId: string;
}
interface ArtworkEntry extends NftTokenUriModel {
  packagePath: string;
}

// Both callers pass only the visible page (at most 22 NFTs), below the API's 50-ID limit.
export function useNftArtwork(nfts: readonly ArtworkToken[]) {
  const { apiTokenRepository } = useServiceProvider();
  const { currentNetwork } = useNetworkProvider();
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
  const queryKey = React.useMemo(
    () => [currentNetwork?.chainId || "", QUERY_KEY.getNftTokenUris, batches],
    [currentNetwork?.chainId, batches],
  );
  const query = useApiRepositoryQuery(
    [QUERY_KEY.getNftTokenUris, batches],
    apiTokenRepository,
    API_REPOSITORY_KEY.TOKEN_REPOSITORY,
    async repository => {
      const responses = await Promise.allSettled(
        batches.map(async ({ packagePath, tokenIds }) => {
          const response = await repository.getNftTokenUris(packagePath, tokenIds);
          return response.items.map(item => ({ ...item, packagePath }));
        }),
      );
      // A failed realm lookup must not discard artwork returned by other realms.
      return responses.flatMap(response => (response.status === "fulfilled" ? response.value : []));
    },
    { enabled: batches.length > 0 },
  );
  const attempted = React.useRef(new WeakSet<ArtworkEntry[]>());
  const data = query.data;
  React.useEffect(() => {
    if (!apiTokenRepository || !data || attempted.current.has(data)) return;
    const flagged = data.filter(item => item.needsRefetch);
    if (flagged.length === 0) return;
    attempted.current.add(data);
    let cancelled = false;
    void Promise.allSettled(
      batches.map(async ({ packagePath }) => {
        const tokenIds = flagged.filter(item => item.packagePath === packagePath).map(item => item.tokenId);
        if (tokenIds.length === 0) return [];
        const response = await apiTokenRepository.getNftTokenUris(packagePath, tokenIds, true);
        return response.items.map(item => ({ ...item, packagePath }));
      }),
    ).then(responses => {
      if (cancelled) return;
      const refreshed = responses.flatMap(response => (response.status === "fulfilled" ? response.value : []));
      const next = data.map(
        item =>
          refreshed.find(value => value.packagePath === item.packagePath && value.tokenId === item.tokenId) ?? item,
      );
      queryClient.setQueryData(queryKey, next);
      const cached = queryClient.getQueryData<ArtworkEntry[]>(queryKey);
      if (cached) attempted.current.add(cached);
    });
    return () => {
      cancelled = true;
    };
  }, [apiTokenRepository, data, batches, queryClient, queryKey]);

  return React.useCallback(
    (packagePath: string, nftId: string) => {
      const item = data?.find(item => item.packagePath === packagePath && item.tokenId === nftId);
      return item?.status === "found" ? nftMediaUrl(item.uri) : undefined;
    },
    [data],
  );
}
