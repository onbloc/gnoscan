export interface GetLatestBlogsResponse {
  items: {
    id: number;
    publisher: string;
    title: string;
    url: string;
  }[];
  lastUpdated: string;
}
