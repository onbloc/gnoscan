import {LogDataType} from '@/components/view/tabs/tabs';
import BigNumber from 'bignumber.js';

export interface RealmDetailsModel {
  name: string;
  funcs: string[];
  publisher: string;
  address: string;
  blockPublished: number;
  path: string;
  ContractCalls: number;
  gasUsed: BigNumber;
  log: LogDataType;
}
