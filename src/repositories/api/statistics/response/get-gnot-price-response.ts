export interface GetGnotPriceResponse {
  data: {
    price: string;
    // Percent change against the price 24 hours earlier, null when the feed has no price from a day ago.
    changeRateOneDay: number | null;
    // Self reported to CoinMarketCap by the project, null until the feed has received one.
    circulatingSupply: string | null;
    status: string;
  };
}
