import { GetSearchResponse, GetSearchAutocompleteResponse } from "./response";

export interface ApiSearchRepository {
  getSearch(keyword: string): Promise<GetSearchResponse>;

  getSearchAutocomplete(keyword: string): Promise<GetSearchAutocompleteResponse>;
}
