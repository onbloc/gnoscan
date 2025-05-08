export interface GetSummaryBlocksResponse {
  data: {
    avgBlockTime: string;
    avgTxPerBlock: string;
    height: number;
  };
}
