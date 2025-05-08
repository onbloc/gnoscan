/* eslint-disable @typescript-eslint/no-explicit-any */
import { NetworkClient } from "@/common/clients/network-client";
import { ApiSearchRepository } from "./api-search-repository";

import { GetSearchResponse, GetSearchAutocompleteResponse } from "./response";
import { CommonError } from "@/common/errors/common/common-error";

interface APIResponse<T> {
  data: T;
}

export class ApiSearchRepositoryImpl implements ApiSearchRepository {
  private networkClient: NetworkClient | null;
  constructor(networkClient: NetworkClient | null) {
    this.networkClient = networkClient;
  }

  getSearch(keyword: string): Promise<GetSearchResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<GetSearchResponse>>({
        url: `/search?param=${keyword}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }

  getSearchAutocomplete(keyword: string): Promise<GetSearchAutocompleteResponse> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    return this.networkClient
      .get<APIResponse<any>>({
        url: `/search/autocomplete?query=${keyword}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }
}
