import { SEARCH_RESULT_TYPE } from "@/common/values/search.constant";

export interface SearchResult {
  title: string;
  description: string;
  link: string;
  type: SEARCH_RESULT_TYPE;
}

export type GetSearchResponse = SearchResult[];
