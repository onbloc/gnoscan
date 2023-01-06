import {LogDataType} from '@/components/view/tabs/tabs';

export interface RealmDetailsModel {
  name: string;
  funcs: string[];
  publisher: string;
  address: string;
  blockPublished: number;
  path: string;
  ContractCalls: number;
  gasUsed: string;
  log: LogDataType;
}
