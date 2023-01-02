import {API_URI, API_VERSION} from '@/common/values/constant-value';
import axios from 'axios';

export const getSupplyCard = async () => {
  const {data} = await axios.get(API_URI + API_VERSION + '/info/card01');
  return data;
};

export const getBlockCard = async () => {
  const {data} = await axios.get(API_URI + API_VERSION + '/info/card02');
  return data;
};

export const getTxsCard = async () => {
  const {data} = await axios.get(API_URI + API_VERSION + '/info/card03');
  return data;
};

export const getAccountCard = async () => {
  const {data} = await axios.get(API_URI + API_VERSION + '/info/card04');
  return data;
};
