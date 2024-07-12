export interface PageOption {
  page: number;
  pageSize: number;
}

export interface Block {
  hash: string;
  height: number;
  chain_id: string;
  time: string;
  num_txs: number;
  total_txs: number;
  proposer_address_raw: string;
  txs: BlockTransaction[];
}

export interface BlockTransaction {
  hash: string;
  fee: Fee;
  memo: string;
}

export interface Fee {
  gas_wanted: number;
  gas_fee: GasFee;
}

export interface GasFee {
  amount: number;
  denom: string;
}

export interface Transaction {
  success: boolean;
  hash: string;
  index: number;
  block_height: number;
  gas_wanted: number;
  gas_used: number;
  memo: string;
  response: Response;
  messages: Message[];
}

export interface Message {
  typeUrl: string;
  route: string;
  value:
    | MessageOfBankMsgSend
    | MessageOfMsgCall
    | MessageOfMsgAddPackage
    | MessageOfMsgRun
    | MessageOfUnexpectedMessage;
}

export interface MessageOfBankMsgSend {
  from_address: string;
  to_address: string;
  amount: string;
}

export interface MessageOfMsgCall {
  caller: string;
  func: string;
  pkg_path: string;
  send: string | null;
  args: string[] | null;
}

export interface MessageOfMsgAddPackage {
  creator: string;
  deposit: string | null;
  package: Package;
}

export interface MessageOfMsgRun {
  package: Package;
  caller: string;
  send: string | null;
}

export interface MessageOfUnexpectedMessage {
  raw: string;
}

export interface Package {
  name: string;
  path: string;
  files: File[];
}

export interface File {
  name: string;
  body: string;
}

export interface Response {
  error: string;
  log: string;
  info: string;
  data: string;
  events: (Event | Events2)[];
}

export interface Events2 {
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

export interface Event {
  __typename: string;
  type: string;
  pkg_path: string;
  func: string;
  attrs?: any;
}
