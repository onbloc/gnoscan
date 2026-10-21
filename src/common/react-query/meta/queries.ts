import { UseQueryOptions, useQuery } from "react-query";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { QUERY_KEY } from "./types";
import { NftCollectionResourceMeta, TokenResourceMeta } from "@/types/data-type";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { GNO_TOKEN_RESOURCE_BASE_URI } from "@/common/values/constant-value";

function makeTokenMetaURL(type: "gno-native" | "grc20" | "grc721", chainId: string) {
  if (!chainId) {
    return "";
  }
  return `${GNO_TOKEN_RESOURCE_BASE_URI}/${type}/${chainId}.json`;
}

async function fetchTokenMeta<T extends { id: string; denom?: string; pkg_path?: string } = TokenResourceMeta>(
  url: string,
): Promise<T[]> {
  if (!url) {
    return [];
  }

  return fetch(url)
    .then(response => response.json())
    .then(
      json =>
        json?.map((data: Omit<T, "id">) => ({
          ...data,
          id: data?.denom || data?.pkg_path || "",
        })) || [],
    )
    .catch(() => []);
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
    ...options,
  });
};

// Kept apart from useGetTokenMetaQuery: GRC721 entries have no decimals, and merging them into the
// GRC20 lookup would make token amount displays resolve undefined decimals for these collections.
export const useGetNftCollectionMetaQuery = (options?: UseQueryOptions<NftCollectionResourceMeta[], Error>) => {
  const { currentNetwork } = useNetworkProvider();

  return useQuery<NftCollectionResourceMeta[], Error>({
    queryKey: [QUERY_KEY.getNftCollectionMeta, currentNetwork?.chainId || ""],
    queryFn: () => fetchTokenMeta<NftCollectionResourceMeta>(makeTokenMetaURL("grc721", currentNetwork?.chainId || "")),
    ...options,
  });
};
