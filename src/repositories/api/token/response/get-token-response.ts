export interface GetTokenResponse {
  data: {
    name: string;
    symbol: string;
    totalSupply: string;
    decimals: number;
    path: string;
    funcTypesList: string[];
    owner: string;
    ownerName: string;
    holders: number;
    sourceFiles: [
      {
        content: string;
        filename: string;
      },
    ];
  };
  page: string;
}
