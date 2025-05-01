export interface GetRealmsResponse {
  items: {
    blockHeight: number;
    funcCount: number;
    index: number;
    name: string;
    path: string;
    publisher: string;
    success: true;
    totalCallCount: number;
    totalGasUsed: string;
    txHash: string;
  }[];

  page: {
    cursor: string;
    hasNext: boolean;
    nextCursor: string;
  };
}
