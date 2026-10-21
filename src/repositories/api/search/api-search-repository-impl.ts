import { ApiSearchRepository } from "./api-search-repository";

import { GetSearchResponse, GetSearchAutocompleteResponse } from "./response";
import { ApiRepository } from "../api-repository";

export class ApiSearchRepositoryImpl extends ApiRepository implements ApiSearchRepository {
  getSearch(keyword: string): Promise<GetSearchResponse> {
    return this.get<GetSearchResponse>(`/search?param=${encodeURIComponent(keyword)}`);
  }

  getSearchAutocomplete(keyword: string): Promise<GetSearchAutocompleteResponse> {
    return this.get<GetSearchAutocompleteResponse>(`/search/autocomplete?query=${keyword}`);
  }
}
