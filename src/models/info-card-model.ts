export interface SupplyCardModel {
  supply: string;
  exit: string;
  airdrop_holders: string;
}

export interface BlockCardModel {
  height: string;
  avg_tx: string;
  avg_time: string;
}

export interface TxsCardModel {
  total_fee: string;
  avg_24hr: string;
  total_txs: string;
}

export interface AccountCardModel {
  totalAccounts: string;
  totalUsers: string;
  validators: string;
}
