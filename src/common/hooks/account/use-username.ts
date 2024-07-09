import {useCallback, useMemo} from 'react';
import {useGetUsername} from '../common/use-get-username';

export const useUsername = () => {
  const {data, isFetched} = useGetUsername();

  const totalUsers = useMemo(() => {
    return Object.keys(data || {}).length;
  }, [data]);

  const getName = useCallback(
    (address: string) => {
      return data?.[address] || null;
    },
    [data],
  );

  const getAddress = useCallback(
    (name: string) => {
      return Object.entries(data || {}).find(entry => entry[1] === name)?.[0] || null;
    },
    [data],
  );

  return {
    isFetched,
    usernames: data,
    totalUsers,
    getName,
    getAddress,
  };
};
