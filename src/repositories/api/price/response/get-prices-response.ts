export type AssetPriceStatus = "fresh" | "stale" | "unavailable";

// assetId is a CoinMarketCap slug ("gno-land") for the market data feed, or an on-chain token path
// ("gno.land/r/gnoswap/gns.GNS") for provider "gnoswap". Prices are decimal strings.
export interface AssetPriceModel {
  assetId: string;
  name: string;
  symbol: string;
  quoteCurrency: string;
  provider: string;
  price: string;
  status: AssetPriceStatus;
  priceAt: string | null;
  oneDayAgoPrice: string | null;
  oneDayAgoPriceAt: string | null;
  changeRateOneDay: number | null;
  providerAssetId: number;
}

export interface GetPricesResponse {
  items: AssetPriceModel[];
}
