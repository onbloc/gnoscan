export interface GetTokensResponse {
  items: {
    decimals: number;
    funcTypesList: string[];
    holders: number;
    logUrl: string;
    name: string;
    owner: string;
    path: string;
    symbol: string;
    totalSupply: string;
  }[];
  page: {
    cursor: string;
    hasNext: boolean;
  };
}
