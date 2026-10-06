import { ValuesType } from "utility-types";

// Mirrors the backend's enum.AddressLabelType (pkg/enum/address_label.go).
export const ADDRESS_LABEL_TYPE = {
  REALM: "realm",
  EXCHANGE: "exchange",
  ENTITY: "entity",
} as const;

export type ADDRESS_LABEL_TYPE = ValuesType<typeof ADDRESS_LABEL_TYPE>;

// Mirrors the backend's enum.AddressLabelTag; sent as `labelTag` on holder lists.
export const ADDRESS_LABEL_TAG = {
  TREASURY: "treasury",
  INVESTORS: "investors",
  TEAM: "team",
  CEX: "cex",
  DEX: "dex",
} as const;

export type ADDRESS_LABEL_TAG = ValuesType<typeof ADDRESS_LABEL_TAG>;

export const ADDRESS_LABEL_TAG_TEXT: Readonly<Record<ADDRESS_LABEL_TAG, string>> = {
  [ADDRESS_LABEL_TAG.TREASURY]: "Treasury",
  [ADDRESS_LABEL_TAG.INVESTORS]: "Investors",
  [ADDRESS_LABEL_TAG.TEAM]: "Company/Team",
  [ADDRESS_LABEL_TAG.CEX]: "Exchange (CEX)",
  [ADDRESS_LABEL_TAG.DEX]: "Exchange (DEX)",
};
