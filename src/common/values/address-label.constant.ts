import { ValuesType } from "utility-types";

// Mirrors the backend's enum.AddressLabelType (pkg/enum/address_label.go).
export const ADDRESS_LABEL_TYPE = {
  REALM: "realm",
} as const;

export type ADDRESS_LABEL_TYPE = ValuesType<typeof ADDRESS_LABEL_TYPE>;
