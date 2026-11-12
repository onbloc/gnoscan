export interface GetAccountNativeTransfersRequest {
  address: string;

  page?: number;

  limit?: number;

  from?: string;

  to?: string;
}
