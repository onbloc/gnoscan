import {searchState} from '@/states';
import axios from 'axios';
import {useQuery, UseQueryResult} from 'react-query';
import {useRecoilValue} from 'recoil';
import {isEmptyObj} from '../utils';
import {API_URI, API_VERSION} from '@/common/values/constant-value';
import {firstStrUpperCase} from '../utils/string-util';
export interface keyOfSearch {
  [key: string]: any;
}

const useSearchQuery = () => {
  const value = useRecoilValue(searchState);
  const {data}: UseQueryResult<any> = useQuery(
    ['info/search', value],
    async () => await axios.get(API_URI + API_VERSION + `/info/search/${value}?limit=5`),
    {
      enabled: value.length > 1,
      select: (res: any) => {
        const checkedObj = isEmptyObj(res.data);
        // const keyAsUppercase = firstStrUpperCase(Object.keys(res.data));
        // const aa = Object.keys(res.data).map(v => {
        //   const key = {
        //     [v]: firstStrUpperCase(Object.keys(v)),
        //   };
        //   return key;
        // });
        if (checkedObj) {
          return null;
        } else {
          const convert = Object.fromEntries(
            Object.entries(res.data).map(([key]) => [firstStrUpperCase(key), res.data[key]]),
          );
          return convert;
        }
      },
    },
  );

  return {
    result: data,
  };
};

export default useSearchQuery;
