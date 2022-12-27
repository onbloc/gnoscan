import {searchState} from '@/states';
import axios from 'axios';
import {useQuery, UseQueryResult} from 'react-query';
import {useRecoilValue} from 'recoil';
import {API_URI, API_VERSION} from '@/common/values/constant-value';
import {GetServerSideProps} from 'next';

interface SearchHistoryProps {
  keyword: string;
  type: string;
  value: string;
  memo1?: string;
}

const useSearchHistory = async ({keyword, type, value, memo1}: SearchHistoryProps) => {
  const res = await axios
    .post(API_URI + API_VERSION + '/info/search', {
      client_ip: '',
      user_agent: window.navigator.userAgent,
      keyword,
      type,
      value,
      memo1,
    })
    .then(re => console.log(re));
};

export default useSearchHistory;
