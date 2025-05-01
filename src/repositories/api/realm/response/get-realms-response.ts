export interface GetRealmsResponse {
  items: [];

  page: {
    cursor: string;
    hasNext: boolean;
    nextCursor: string;
  };
}
