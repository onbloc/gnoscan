import {useMemo} from 'react';
import {makeDisplayNumber} from '@/common/utils/string-util';
import {useGetValidators} from '../common/use-get-validators';
import {useUsername} from '../account/use-username';
import {useGetUsingAccountTransactionCount} from '@/common/react-query/transaction';

export const useAccountSummaryInfo = () => {
  const {isFetched, validators} = useGetValidators();
  const {isFetched: isFetchedUser, totalUsers} = useUsername();
  const {isFetched: isFetchedAccount, data: totalAccounts} = useGetUsingAccountTransactionCount();

  const numOfValidators = useMemo(() => {
    if (!validators) {
      return '0';
    }

    return makeDisplayNumber(validators.length);
  }, [validators]);

  return {
    isFetched: isFetched && isFetchedUser && isFetchedAccount,
    accountSummaryInfo: {
      totalAccounts: totalAccounts?.length || 0,
      totalUsers,
      numOfValidators,
    },
  };
};
