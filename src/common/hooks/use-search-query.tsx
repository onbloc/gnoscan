import {useQuery, UseQueryResult} from 'react-query';
import {useGetGRC20Tokens, useGetRealmsQuery} from '../react-query/realm';
import {useUsername} from './account/use-username';
import {useGetUsingAccountTransactionCount} from '../react-query/transaction';
import {SEARCH_TITLE} from '@/components/ui/search-result/search-result';
export interface keyOfSearch {
  [key: string]: {
    address?: string;
    username?: string;
    packagePath?: string;
    name?: string;
  }[];
}

const useSearchQuery = (keyword: string) => {
  const {data: tokens} = useGetGRC20Tokens();
  const {data: realms} = useGetRealmsQuery();
  const {usernames} = useUsername();
  const {data: accounts} = useGetUsingAccountTransactionCount();

  const {data}: UseQueryResult<keyOfSearch> = useQuery(
    [
      'info/search/keyword',
      keyword,
      tokens?.length,
      realms?.length,
      Object.values(usernames || {}).length,
    ],
    async () => {
      const users = Object.entries(usernames || {})
        .filter(entry => entry[1].includes(keyword))
        .map(entry => ({
          username: entry[0],
          address: entry[1],
        }))
        .sort((u1, u2) => (u1.address > u2.address ? 1 : -1))
        .filter((_, index) => index < 5);
      const addresses =
        accounts?.accounts
          .filter(address => {
            if (users.findIndex(user => user.address === address) > -1) {
              return false;
            }
            return address.includes(keyword);
          })
          .sort()
          .filter((_, index) => index < 5) || [];
      const filteredAddresses = [
        ...new Set([
          ...users,
          ...addresses.map(address => ({
            username: usernames?.[address],
            address,
          })),
        ]),
      ].filter((_, index) => index < 5);

      const filteredTokens =
        tokens
          ?.filter(token => token?.packagePath.includes(keyword) || token?.name.includes(keyword))
          .sort((t1, t2) => (t1.packagePath > t2.packagePath ? 1 : -1))
          .filter((_, index) => index < 5) || [];

      const filteredRealms =
        (realms as {packagePath: string; packageName: string}[])
          ?.filter(realm => {
            if (filteredTokens.findIndex(token => token.packagePath === realm.packagePath) > -1) {
              return false;
            }
            return realm?.packagePath?.includes(keyword) || realm.packageName.includes(keyword);
          })
          .sort((r1, r2) => (r1.packagePath > r2.packagePath ? 1 : -1))
          .filter((_, index) => index < 5) || [];

      const searchResult: keyOfSearch = {};
      if (filteredAddresses.length > 0) {
        searchResult[SEARCH_TITLE.ACCOUNTS] = filteredAddresses;
      }
      if (filteredTokens.length > 0) {
        searchResult[SEARCH_TITLE.TOKENS] = filteredTokens.map(token => ({
          name: token.name,
          packagePath: token.packagePath,
        }));
      }
      if (filteredRealms.length > 0) {
        searchResult[SEARCH_TITLE.REALMS] = filteredRealms.map((realm: any) => ({
          packagePath: realm.packagePath,
        }));
      }

      return searchResult;
    },
    {
      enabled: keyword.length > 1,
    },
  );
  return {
    result: data,
  };
};

export default useSearchQuery;
