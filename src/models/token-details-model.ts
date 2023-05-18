import {LogDataType} from '@/components/view/tabs/tabs';

export interface TokenDetailsModel {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  pkgPath: string;
  funcs: string[];
  owner: string;
  address: string;
  holders: string;
  log: LogDataType;
}
