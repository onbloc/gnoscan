export interface GetAccountTransactionsResponse {
  items: {
    amountIn: string;
    amountOut: string;
    blockHeight: number;
    fee: {
      denom: string;
      value: string;
    };
    func: [
      {
        funcType: string;
        messageType: string;
        pkgPath: string;
      },
    ];
    successYn: boolean;
    timestamp: string;
    token: string;
    txHash: string;
  }[];

  page: {
    cursor: string;
    hasNext: boolean;
  };
}
