import {useMemo} from 'react';
import {makeDisplayNumber} from '@/common/utils/string-util';
import {useGetValidators} from '../common/use-get-validators';

export const useAccountSummaryInfo = () => {
  const {isFetched, validators} = useGetValidators();

  const totalAccounts = useMemo(() => {
    return '0';
  }, []);

  const totalUsers = useMemo(() => {
    return '0';
  }, []);

  const numOfValidators = useMemo(() => {
    if (!validators) {
      return '0';
    }

    return makeDisplayNumber(validators.length);
  }, [validators]);

  return {
    isFetched,
    accountSummaryInfo: {
      totalAccounts,
      totalUsers,
      numOfValidators,
    },
  };
};
