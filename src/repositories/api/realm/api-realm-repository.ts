import { GetRealmsRequestParameters } from "./request";
import { GetRealmsResponse } from "./response";

export interface ApiRealmRepository {
  getRealms(params: GetRealmsRequestParameters): Promise<GetRealmsResponse>;
}
