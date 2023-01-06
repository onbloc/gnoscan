import axios, {AxiosResponse} from 'axios';
import {API_URI, API_VERSION} from '@/common/values/constant-value';

interface SearchHistoryProps {
  keyword: string;
  type: string;
  value: string;
  memo1?: string;
}

export const searchHistory = async ({
  keyword,
  type,
  value,
  memo1,
}: SearchHistoryProps): Promise<AxiosResponse<any, any>> => {
  return await axios.post(API_URI + API_VERSION + '/info/search', {
    client_ip: '',
    user_agent: window.navigator.userAgent,
    keyword,
    type,
    value,
    memo1,
  });
};
