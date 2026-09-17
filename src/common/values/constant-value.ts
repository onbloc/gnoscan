export const GNO_TOKEN_RESOURCE_BASE_URI = "https://raw.githubusercontent.com/onbloc/gno-token-resource/main";

// gnoscan has no pool/position page of its own - link out to gnoswap's app instead.
export const GNOSWAP_APP_BASE_URL = process.env.NEXT_PUBLIC_GNOSWAP_APP_BASE_URL ?? "https://gnoswap.io";

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? "";

export const DAY_TIME = 86_400_000 as const; // Day time: 24 * 60 * 60 * 1000

export enum ChainType {
  GNOLAND = "gnoland-1",
  STAGING = "staging",
}

export const GNOLAND_CHAIN_ID = "gnoland-1";
export const STAGING_CHAIN_ID = "staging";

// wugnot is deployed on-chain with decimals: 0, and both the token-meta API and the
// static gno-token-resource list just reflect that on-chain value (not a bug on their
// end), so it can't be fixed by picking a different data source - it should actually
// display as 6, 1:1 with ugnot.
export const WUGNOT_PACKAGE_PATH = "gno.land/r/gnoland/wugnot";
export const WUGNOT_DISPLAY_DECIMALS = 6;
export const WUGNOT_DISPLAY_NAME = "wGNOT (Wrapped GNOT)";

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
