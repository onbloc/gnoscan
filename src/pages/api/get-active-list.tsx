import {API_URI, API_VERSION} from '@/common/values/constant-value';
import axios from 'axios';

export const getAccountList = async () => {
  const {data} = await axios.get(API_URI + API_VERSION + '/info/most_active_account');
  return data;
};

export const getBoardList = async () => {
  const {data} = await axios.get(API_URI + API_VERSION + '/info/most_active_board');
  return data;
};

export const getNewestList = async () => {
  const {data} = await axios.get(API_URI + API_VERSION + '/info/newest_realm');
  return data;
};
