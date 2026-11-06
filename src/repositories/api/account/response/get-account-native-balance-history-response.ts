export interface AccountNativeBalancePoint {
  // UTC day, YYYY-MM-DD
  date: string;

  // Closing balance in ugnot, as an integer string
  balance: string;
}

export interface GetAccountNativeBalanceHistoryResponse {
  address: string;
  denom: string;
  from: string;
  to: string;
  items: AccountNativeBalancePoint[];
}
