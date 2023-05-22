import axios, {AxiosResponse} from 'axios';
import {API_V2_URI, API_V2_VERSION} from '@/common/values/constant-value';

export const getAccountDetails = async (
  address: string | any,
): Promise<AxiosResponse<any, any>> => {
  return await axios.get('https://dev-api.gnoscan.io/v2' + `/account/detail/${address}`);
};
