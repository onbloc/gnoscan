export interface TransactionWithEvent<
  T = MsgCallValue | MsgRunValue | AddPackageValue | BankSendValue,
> {
  hash: string;
  index: number;
  success: boolean;
  block_height: number;
  balance?: Amount | null;
  gas_wanted: number;
  gas_used: number;
  response: {
    events: Event[];
  };
  gas_fee: {
    amount: number;
    denom: string;
  };
  messages: {
    value: T;
  }[];
}

export interface Amount {
  value: string;
  denom: string;
}

export interface BankSendValue {
  __typename: string;
  from_address: string;
  to_address: string;
  amount: string;
}

export interface MsgRunValue {
  __typename: string;
  caller?: string;
  send?: string;
  package?: Package;
}

export interface MsgCallValue {
  __typename: string;
  caller?: string;
  send?: string;
  pkg_path?: string;
  func?: string;
  args?: string[];
}

export interface AddPackageValue {
  __typename: string;
  creator?: string;
  deposit?: string;
  package?: Package;
}

export interface Package {
  name: string;
  path: string;
  files?: {
    name: string;
    body: string;
  }[];
}

export interface Event {
  __typename: string;
  type: string;
  pkg_path: string;
  func: string;
  attrs: Attr[];
}

export interface Attr {
  key: string;
  value: string;
}
