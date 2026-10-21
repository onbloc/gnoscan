import { useQuery } from "react-query";
import { useServiceProvider } from "../provider/use-service-provider";
import { useNetworkProvider } from "../provider/use-network-provider";
import { useNetwork } from "../use-network";

export const useGetUsername = () => {
  const { currentNetwork } = useNetwork();
  const { isCustomNetwork } = useNetworkProvider();
  const { realmRepository } = useServiceProvider();

  return useQuery<{ [key in string]: string }>({
    queryKey: ["useGetUsername", currentNetwork?.chainId, isCustomNetwork],
    queryFn: () => {
      // Standard networks resolve names from API labels; the legacy indexer query only works on custom networks.
      if (!realmRepository || !isCustomNetwork) {
        return {};
      }
      return realmRepository.getUsernames();
    },
    enabled: !!realmRepository,
    cacheTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });
};
