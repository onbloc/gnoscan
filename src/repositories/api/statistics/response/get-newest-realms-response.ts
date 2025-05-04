export interface GetNewestRealmsResponse {
  items: {
    block: number;
    calls: number;
    functions: number;
    path: string;
    publisher: string;
  }[];
  lastUpdated: string;
}
