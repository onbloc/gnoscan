import { GetPricesResponse } from "./response";

export interface ApiPriceRepository {
  getPrices(): Promise<GetPricesResponse>;
}
