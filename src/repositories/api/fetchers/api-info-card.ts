import {API_URI, API_VERSION} from '@/common/values/constant-value';
import axios, {AxiosResponse} from 'axios';

export const getSupplyCard = async (): Promise<AxiosResponse<any, any>> => {
  return await axios.get(API_URI + API_VERSION + '/info/card01');
};

export const getBlockCard = async (): Promise<AxiosResponse<any, any>> => {
  return await axios.get(API_URI + API_VERSION + '/info/card02');
};

export const getTxsCard = async (): Promise<AxiosResponse<any, any>> => {
  return await axios.get(API_URI + API_VERSION + '/info/card03');
};

export const getAccountCard = async (): Promise<AxiosResponse<any, any>> => {
  return await axios.get(API_URI + API_VERSION + '/info/card04');
};
