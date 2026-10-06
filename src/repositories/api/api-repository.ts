import { NetworkClient } from "@/common/clients/network-client";
import { CommonError } from "@/common/errors";
import { makeQueryParameter } from "@/common/utils/string-util";

export interface APIResponse<T> {
  data: T;
}

type QueryParameters = Parameters<typeof makeQueryParameter>[0];

export abstract class ApiRepository {
  private readonly networkClient: NetworkClient | null;

  constructor(networkClient: NetworkClient | null) {
    this.networkClient = networkClient;
  }

  /**
   * Sends a GET request and returns the `data` field of the API response.
   * When `params` is given, it is appended to `url` with `makeQueryParameter`.
   */
  protected get<T>(url: string, params?: QueryParameters): Promise<T> {
    if (!this.networkClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NetworkClient");
    }

    const requestParams = params ? makeQueryParameter(params) : "";

    return this.networkClient
      .get<APIResponse<T>>({
        url: `${url}${requestParams}`,
      })
      .then(result => {
        return result.data?.data;
      });
  }
}
