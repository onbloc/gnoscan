import axios, {AxiosResponse} from 'axios';
import {API_URI, API_VERSION} from '@/common/values/constant-value';

export const searhQuery = async (value: string | any): Promise<AxiosResponse<any, any>> => {
  return await axios.get('https://dev-api.gnoscan.io/v2' + `/info/search/${value}?limit=5`);
};
