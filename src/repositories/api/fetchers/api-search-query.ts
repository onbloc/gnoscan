import axios, {AxiosResponse} from 'axios';
import {API_URI, API_VERSION} from '@/common/values/constant-value';

export const searhQuery = async (value: string | any): Promise<AxiosResponse<any, any>> => {
  return await axios.get(API_URI + API_VERSION + `/info/search/${value}?limit=5`);
};
