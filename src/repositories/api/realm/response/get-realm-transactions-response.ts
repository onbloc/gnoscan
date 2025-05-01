export interface GetRealmTransactionsResponse {
  data: [
    {
      amount: string;
      block: number;
      fee: string;
      from: string;
      func: [
        {
          funcType: string;
          messageType: string;
          pkgPath: string;
        },
      ];
      timestamp: string;
      txHash: string;
    },
  ];
  page: {
    cursor: string;
    hasNext: boolean;
    nextCursor: string;
  };
}
