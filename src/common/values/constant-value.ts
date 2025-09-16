export const GNO_TOKEN_RESOURCE_BASE_URI = "";

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? "";

export const DAY_TIME = 86_400_000 as const; // Day time: 24 * 60 * 60 * 1000

export enum ChainType {
  TESTNET8 = "test8",
  STAGING = "staging",
}

export const TESTNET8_CHAIN_ID = "test8";
export const STAGING_CHAIN_ID = "staging";

export const BYTES_PER_KB = 1024 as const;

export const BYTE_UNITS = {
  BYTE: {
    value: Math.pow(BYTES_PER_KB, 0),
    unit: "byte",
  },
  KB: {
    value: Math.pow(BYTES_PER_KB, 1),
    unit: "KB",
  },
  MB: {
    value: Math.pow(BYTES_PER_KB, 2),
    unit: "MB",
  },
  GB: {
    value: Math.pow(BYTES_PER_KB, 3),
    unit: "GB",
  },
} as const;
