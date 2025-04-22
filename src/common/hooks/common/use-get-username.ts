import { useQuery } from "react-query";
import { useServiceProvider } from "../provider/use-service-provider";
import { useNetwork } from "../use-network";

export const useGetUsername = () => {
  const { currentNetwork } = useNetwork();
  const { realmRepository } = useServiceProvider();

  return useQuery<{ [key in string]: string }>({
    queryKey: ["useGetUsername", currentNetwork?.chainId],
    queryFn: () => {
      if (!realmRepository) {
        return {};
      }
      return realmRepository.getUsernames();
    },
    enabled: !!realmRepository,
    cacheTime: 10 * 60 * 1000,
    staleTime: 10 * 60 * 1000,
  });
};
