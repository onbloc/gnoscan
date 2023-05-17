import axios, {AxiosResponse} from 'axios';
import {API_URI, API_VERSION} from '@/common/values/constant-value';

export const getTransactionDetails = async (
  hash: string | any,
): Promise<AxiosResponse<any, any>> => {
  return await axios.get('https://dev-api.gnoscan.io/v2' + `/tx/${hash}`);
};
