export type AccountDataType = {
  no: number;
  address: string;
  account: string;
  totalTxs: number;
  nonTxs: number;
  balance: number;
};

export interface AccountListModel {
  last_update: string;
  data: AccountDataType[];
}

export type BoardDataType = {
  no: number;
  originName: string;
  formatName: string;
  hovertext: string;
  replies: number;
  reposts: number;
  uniqueUsers: number;
  boardLink: string;
};

export interface BoardListModel {
  last_update: string;
  data: BoardDataType[];
}

export type NewestDataType = {
  no: number;
  originName: string;
  formatName: string;
  originPkgName: string;
  originAddress: string;
  publisher: string;
  functions: number;
  calls: number;
  block: number;
};

export interface NewestListModel {
  last_update: string;
  data: NewestDataType[];
}
