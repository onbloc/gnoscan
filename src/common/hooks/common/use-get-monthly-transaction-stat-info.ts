import { useQuery } from "react-query";
import { useServiceProvider } from "../provider/use-service-provider";
import { useNetwork } from "../use-network";
import { MonthlyTransactionStatInfo } from "@/types/data-type";

export const useGetMonthlyTransactionStatInfo = () => {
  const { currentNetwork } = useNetwork();
  const { transactionRepository } = useServiceProvider();

  return useQuery<MonthlyTransactionStatInfo | null>({
    queryKey: ["getMonthlyTransactionStatInfo", currentNetwork?.chainId],
    queryFn: () => {
      if (!transactionRepository) {
        return null;
      }
      return transactionRepository.getMonthlyTransactionStatInfo();
    },
    enabled: !!transactionRepository,
  });
};
