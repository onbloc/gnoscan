import { useMemo } from "react";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { useGetValidators } from "../common/use-get-validators";
import { useUsername } from "../account/use-username";
import { useGetUsingAccountTransactionCount } from "@/common/react-query/transaction";

export const useAccountSummaryInfo = () => {
  const { isFetched: isFetchedValidators, validators } = useGetValidators();
  const { isFetched: isFetchedUser, totalUsers } = useUsername();
  const { isFetched: isFetchedAccount, data: totalAccounts } = useGetUsingAccountTransactionCount();

  const isFetched = useMemo(() => {
    return isFetchedValidators && isFetchedUser && isFetchedAccount;
  }, [isFetchedValidators, isFetchedUser, isFetchedAccount]);

  const numOfValidators = useMemo(() => {
    if (!validators) {
      return "0";
    }

    return makeDisplayNumber(validators.length);
  }, [validators]);

  const numOfTotalAccounts = useMemo(() => {
    return totalAccounts || 0;
  }, [totalAccounts]);

  return {
    isFetched,
    accountSummaryInfo: {
      totalAccounts: numOfTotalAccounts || 0,
      totalUsers,
      numOfValidators,
    },
  };
};
