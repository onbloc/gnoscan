export interface NewestRealmModel {
  block: number;
  calls: number;
  functions: number;
  path: string;
  publisher: string;
  publisherName: string;
}

export interface GetNewestRealmsResponse {
  items: NewestRealmModel[];
  lastUpdated: string;
}
