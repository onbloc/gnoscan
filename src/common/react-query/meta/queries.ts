import { UseQueryOptions, useQuery } from "react-query";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { QUERY_KEY } from "./types";
import { NftCollectionResourceMeta, TokenResourceMeta } from "@/types/data-type";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { GNO_TOKEN_RESOURCE_BASE_URI } from "@/common/values/constant-value";
import { CACHE_POLICY } from "@/common/values/query.constant";

function makeTokenMetaURL(type: "gno-native" | "grc20" | "grc721", chainId: string) {
  if (!chainId) {
    return "";
  }
  return `${GNO_TOKEN_RESOURCE_BASE_URI}/${type}/${chainId}.json`;
}

/**
 * Rejects when the list cannot be loaded (network error, missing file, bad JSON), so callers can
 * tell a failed load from a list without the entry. Consumers default the data to `[]`.
 */
export async function fetchTokenMeta<T extends { id: string; denom?: string; pkg_path?: string } = TokenResourceMeta>(
  url: string,
): Promise<T[]> {
  if (!url) {
    return [];
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load token resource: ${response.status} ${url}`);
  }

  const json: Omit<T, "id">[] = await response.json();
  return (
    json?.map(
      data =>
        ({
          ...data,
          id: data?.denom || data?.pkg_path || "",
        } as T),
    ) || []
  );
}

export const useGetTokenMetaQuery = (options?: UseQueryOptions<TokenResourceMeta[], Error>) => {
  const { currentNetwork } = useNetworkProvider();
  const { blockRepository } = useServiceProvider();

  return useQuery<TokenResourceMeta[], Error>({
    queryKey: [QUERY_KEY.getTokenMeta, currentNetwork?.chainId || ""],
    queryFn: () => {
      return Promise.all([
        fetchTokenMeta(makeTokenMetaURL("gno-native", currentNetwork?.chainId || "")),
        fetchTokenMeta(makeTokenMetaURL("grc20", currentNetwork?.chainId || "")),
      ]).then(([nativeTokenResponse, grc20TokenResponse]) => {
        return [...nativeTokenResponse, ...grc20TokenResponse];
      });
    },
    enabled: !!blockRepository,
    // A failed load falls back to API values right away instead of waiting on retries.
    retry: false,
    ...CACHE_POLICY.COLD,
    ...options,
  });
};

/**
 * Loads the GRC721 collection list of gno-token-resource for the current network.
 *
 * Kept apart from {@link useGetTokenMetaQuery} because GRC721 entries have no decimals.
 * Merging them into the GRC20 lookup would make token amount displays resolve undefined
 * decimals for these collections.
 */
export const useGetNftCollectionMetaQuery = (options?: UseQueryOptions<NftCollectionResourceMeta[], Error>) => {
  const { currentNetwork } = useNetworkProvider();

  return useQuery<NftCollectionResourceMeta[], Error>({
    queryKey: [QUERY_KEY.getNftCollectionMeta, currentNetwork?.chainId || ""],
    queryFn: () => fetchTokenMeta<NftCollectionResourceMeta>(makeTokenMetaURL("grc721", currentNetwork?.chainId || "")),
    enabled: !!currentNetwork?.chainId,
    retry: false,
    ...CACHE_POLICY.COLD,
    ...options,
  });
};
