export const GNO_TOKEN_RESOURCE_BASE_URI = "";

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? "";

export const DAY_TIME = 86_400_000 as const; // Day time: 24 * 60 * 60 * 1000

export enum ChainType {
  TESTNET6 = "test6",
  STAGING = "staging",
}

export const TESTNET6_CHAIN_ID = "test6";
export const STAGING_CHAIN_ID = "staging";
