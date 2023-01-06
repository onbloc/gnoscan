import {API_URI, API_VERSION} from '@/common/values/constant-value';
import axios, {AxiosResponse} from 'axios';

export const getAccountList = async (): Promise<AxiosResponse<any, any>> => {
  return await axios.get(API_URI + API_VERSION + '/info/most_active_account');
};

export const getBoardList = async (): Promise<AxiosResponse<any, any>> => {
  return await axios.get(API_URI + API_VERSION + '/info/most_active_board');
};

export const getNewestList = async (): Promise<AxiosResponse<any, any>> => {
  return await axios.get(API_URI + API_VERSION + '/info/newest_realm');
};
