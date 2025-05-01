export interface GetTokenResponse {
  data: {
    decimals: number;
    funcTypesList: string[];
    holders: number;
    name: string;
    owner: string;
    path: string;
    sourceFiles: [
      {
        content: string;
        filename: string;
      },
    ];
    symbol: string;
    totalSupply: string;
  };
  page: string;
}
