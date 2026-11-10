export interface GetAccountTokenTransfersRequest {
  address: string;

  page?: number;

  limit?: number;

  from?: string;

  to?: string;
}
