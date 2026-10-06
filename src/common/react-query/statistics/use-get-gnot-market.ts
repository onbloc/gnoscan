import { useQuery } from "react-query";

import { QUERY_KEY } from "@/common/react-query/query-keys";

const GNOT_MARKET_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=gno-land";

export interface GnotMarket {
  current_price: number | null;
  price_change_percentage_24h: number | null;
  circulating_supply: number | null;
}

export const useGetGnotMarket = () => {
  return useQuery<GnotMarket | null, Error>({
    queryKey: [QUERY_KEY.getGnotMarket],
    queryFn: async () => {
      const response = await fetch(GNOT_MARKET_URL);
      if (!response.ok) throw new Error(`CoinGecko responded ${response.status}`);
      const [market]: GnotMarket[] = await response.json();
      return market ?? null;
    },
    // The keyless CoinGecko API is rate limited per IP. Move this behind the backend if limits become a problem.
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
};
