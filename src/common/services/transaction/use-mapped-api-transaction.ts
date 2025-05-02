import React from "react";

import { useGetTransactionByHash } from "@/common/react-query/transaction/api";
import { TransactionMapper } from "@/common/mapper/transaction/transaction-mapper";
import { TransactionSummaryInfo } from "@/types/data-type";

export const INITIAL_TRANSACTION_SUMMARY_STATE: TransactionSummaryInfo = {
  network: "",
  timeStamp: {
    time: "-",
    passedTime: "-",
  },
  blockResult: "",
  gas: "",
  transactionEvents: [],
  transactionItem: null,
};

/**
 * Hooks to map transaction-detail data fetched from the API to the format used by the application
 *
 * This hook has the following data flow:
 * 1. useGetTransactionByHash to get the original block data from the API.
 * 2. mapping the fetched data into application format using TransactionMapper whenever it changes
 * 3. return the mapped data and the correct loading status
 *
 * This hook allows you to use the mapping logic directly in your component without having to handle it yourself
 * you can use data that is already mapped out of the box.
 *
 * @param params - API request parameters
 * @returns Mapped block data and query status
 */
export const useMappedApiTransaction = (hash: string) => {
  const {
    data: apiData,
    isFetched: isApiFetched,
    isLoading: isApiLoading,
    isError: isApiError,
  } = useGetTransactionByHash(hash);
  const [transaction, setTransaction] = React.useState<TransactionSummaryInfo>(INITIAL_TRANSACTION_SUMMARY_STATE);
  const [isDataReady, setIsDataReady] = React.useState(false);

  React.useEffect(() => {
    if (isApiFetched && apiData?.data) {
      const mappedTransaction = TransactionMapper.transactionFromApiResponse(apiData.data);

      setTransaction(mappedTransaction);
      setIsDataReady(true);
    }
  }, [apiData?.data, isApiFetched]);

  const isLoading = isApiLoading || !isDataReady;
  const isFetched = isApiFetched && isDataReady;

  return {
    data: transaction,
    isFetched,
    isLoading,
    isError: isApiError,
  };
};
