export interface GetLatestBlogsResponse {
  items: {
    id: number;
    publisher: string;
    publisherName: string;
    title: string;
    url: string;
  }[];
  lastUpdated: string;
}
