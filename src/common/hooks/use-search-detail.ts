import React from 'react';
import axios from 'axios';
import {useQuery, UseQueryResult} from 'react-query';
import {searchState} from '@/states';

const useSearchDetail = () => {
  // const [value, setValue] = useRecoilState(searchState);
  // const searchButtonClick = () => {
  //   if (value === "") return;
  //   (async () => {
  //     console.log("Search button Clicked : ", value);
  //     if (isAccount(value)) {
  //       router.push(`/${chainid}/account/${value}`);
  //     } else if (await isBlockNumber(value)) {
  //       router.push(`/${chainid}/block/${value}`);
  //     } else if (await isHash(value)) {
  //       router.push(`/${chainid}/contract/${value}`);
  //     } else {
  //       // router.push(`/${chainid}/search?${value}`);
  //       router.push({
  //         pathname: `/${chainid}`,
  //         query: { search: value },
  //       });
  //     }
  //   })();
  // };
};

export default useSearchDetail;
