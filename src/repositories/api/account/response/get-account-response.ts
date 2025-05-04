export interface GetAccountResponse {
  data: {
    address: string;
    assets: {
      amount: string;
      name: string;
      symbol: string;
      tokenType: string;
    }[];
  };
}
