import {searchState} from '@/states';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {useQuery, UseQueryResult} from 'react-query';
import {useRecoilValue} from 'recoil';
import {isEmptyObj} from '../utils';

export interface keyOfSearch {
  [key: string]: any;
}

type SearchKeyType = 'realms' | 'accounts';

const searchObj = {
  realms: [],
  accounts: [],
};

type dataKeyType = '';
const dummy = {
  accounts: [
    {
      username: 'quochung',
      address: 'g1c7hvlrdyltlnn5gzs4zznjkgznkz0fphrw93vu',
    },
    {
      username: 'quangtest',
      address: 'g12felg7ujcg0rhgrtku0q0uts7lne9qp08v22pn',
    },
    {
      username: 'nguyenthuyduong',
      address: 'g1rc2gg69qtfju4tazq0kxm8ynef29dkddglzg0m',
    },
    {
      username: 'logitech',
      address: 'g19k34wjqdvpqdz3v64mh3732p8tux0g0pm2l56h',
    },
    {
      username: 'ledger',
      address: 'g15wdvhkdthxha3h5cczu2dnn9qd6sxcc9n32n7z',
    },
    {
      username: 'arel84',
      address: 'g1zy2tumkkwc6pa3c5ekn02ty5tmhd4mpl8pn74s',
    },
    {
      username: '',
      address: 'g1z56rhejtvz70u6jzpjl5aghtcrlm47evh4up0y',
    },
    {
      username: '',
      address: 'g1z35rv594q6sxkx8vkg62q5d2xawz3y4lmwwy64',
    },
    {
      username: '',
      address: 'g1yzsddgwzg73y2dsvwcud73dpfu52fea4s8qegu',
    },
    {
      username: '',
      address: 'g1yshwepaz4px56mwwjw50ur3649u5kq3khgr69n',
    },
  ],
  realms: [
    'gno.land/r/test1/v1v2',
    'gno.land/r/swap/onetoken',
    'gno.land/r/rich_wallet/minter_v1',
    'gno.land/r/qqq/quangtokentwo',
    'gno.land/r/qq/quangtokentwo',
    'gno.land/r/qq/quangtokentwo',
    'gno.land/r/qq/quangtokentwo',
  ],
};
/**
 * Realms : name , path
 * Accounts : address , username
 */
//.constructor === Object && Object.keys(obj).length === 0 ? true : false;
const accountFormat = (address: string[], username: string[]) => {};

const searchResultFormat = (data: keyOfSearch) => {
  let map: keyOfSearch = {};
  Object.keys(data).forEach((v: string, i: number) => (map[v] = data[v]));
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
