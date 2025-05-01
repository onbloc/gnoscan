export interface GetRealmsRequestParameters {
  cursor?: string;

  limit?: number; // @default 20

  sort?: "name" | "totalCallCount";

  order?: "asc" | "desc";
}
