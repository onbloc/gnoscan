export interface GetSearchResponse {
  data: {
    type: string;
    matched: boolean;
    path: string;
  };
}
