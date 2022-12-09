import {searchState} from '@/states';
import axios from 'axios';
import {useQuery, UseQueryResult} from 'react-query';
import {useRecoilValue} from 'recoil';
import {isEmptyObj} from '../utils';

export interface keyOfSearch {
  [key: string]: any;
}

const searchResultFormat = (data: keyOfSearch) => {
  let map: keyOfSearch = {};
  Object.keys(data).forEach((v: string) => (map[v] = data[v]));
  return map;
};

const useSearchQuery = () => {
  const value = useRecoilValue(searchState);
  const {data}: UseQueryResult<any> = useQuery(
    ['info/search', value],
    async () => await axios.get(`http://3.218.133.250:7677/latest/info/search/${value}?limit=5`),
    {
      enabled: !!value,
      select: (res: any) => {
        const checkedObj = isEmptyObj(res.data);
        return checkedObj ? null : searchResultFormat(res.data);
      },
    },
  );

  return {
    result: data,
  };
};

export default useSearchQuery;
