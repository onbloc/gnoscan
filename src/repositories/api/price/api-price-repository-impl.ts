import { ApiPriceRepository } from "./api-price-repository";
import { GetPricesResponse } from "./response";
import { ApiRepository } from "../api-repository";

export class ApiPriceRepositoryImpl extends ApiRepository implements ApiPriceRepository {
  getPrices(): Promise<GetPricesResponse> {
    return this.get<GetPricesResponse>("/prices");
  }
}
