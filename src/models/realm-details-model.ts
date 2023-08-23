import {LogDataType} from '@/components/view/tabs/tabs';
import BigNumber from 'bignumber.js';

export interface RealmDetailsModel {
  name: string;
  funcs: string[];
  publisherAddress: string;
  publisherName: string;
  address: string;
  blockPublished: number;
  path: string;
  ContractCalls: number;
  totalUsedFee: {
    value: BigNumber;
    denom: string;
  };
  assets: {
    type: string;
    denom: string;
    value: string;
    name: string;
  }[];
  log: LogDataType;
}
