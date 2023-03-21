import {searchState} from '@/states';
import {useQuery, UseQueryResult} from 'react-query';
import {useRecoilValue} from 'recoil';
import {searhQuery} from '@/repositories/api/fetchers/api-search-query';
import {searchQuerySelector} from '@/repositories/api/selector/select-search-query';
export interface keyOfSearch {
  [key: string]: any;
}

const useSearchQuery = () => {
  const value = useRecoilValue(searchState);
  const {data}: UseQueryResult<any> = useQuery(
    ['info/search/keyword', value],
    async () => searhQuery(value),
    {
      enabled: value.length > 1,
      select: (res: any) => searchQuerySelector(res.data),
    },
  );

  return {
    result: data,
  };
};

export default useSearchQuery;
