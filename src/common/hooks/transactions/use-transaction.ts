import { useMemo } from "react";

import { TransactionMapper } from "@/common/mapper/transaction/transaction-mapper";
import { useGetTransactionBlockHeightQuery } from "@/common/react-query/transaction";
import { makeSafeBase64Hash } from "@/common/utils/transaction.utility";
import { useTokenMeta } from "../common/use-token-meta";

export const useTransaction = (hash: string) => {
  const safeHash = makeSafeBase64Hash(hash);
  const { getTokenAmount } = useTokenMeta();
  const { data, isFetched, isError: isErrorTxHash } = useGetTransactionBlockHeightQuery(safeHash);

  const transaction = useMemo(
    () => TransactionMapper.transactionFromRpcBlock(data?.block, data?.blockResult, safeHash, getTokenAmount),
    [data?.block, data?.blockResult, safeHash, getTokenAmount],
  );
  const isError = isFetched && (data?.block === null || isErrorTxHash);

  return { transaction, isFetched, isError };
};
