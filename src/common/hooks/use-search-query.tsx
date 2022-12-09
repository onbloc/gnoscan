import {searchState} from '@/states';
import axios from 'axios';
import {useQuery, UseQueryResult} from 'react-query';
import {useRecoilValue} from 'recoil';
import {isEmptyObj} from '../utils';
import {API_URI} from '@/common/values/constant-value';
export interface keyOfSearch {
  [key: string]: any;
}

const useSearchQuery = () => {
  const value = useRecoilValue(searchState);
  const {data}: UseQueryResult<any> = useQuery(
    ['info/search', value],
    async () => await axios.get(API_URI + `/latest/info/search/${value}?limit=5`),
    {
      enabled: !!value,
      select: (res: any) => {
        const checkedObj = isEmptyObj(res.data);
        return checkedObj ? null : res.data;
      },
    },
  );

  return {
    result: data,
  };
};

export default useSearchQuery;
