import { ValuesType } from "utility-types";

export const SEARCH_RESULT_TYPE = {
  ACCOUNT: "ACCOUNT",
  BLOCK: "BLOCK",
  TOKEN: "GRC20",
  PROPOSAL: "PROPOSAL",
  REALM: "REALM",
  TRANSACTION: "TRANSACTION",
} as const;

export type SEARCH_RESULT_TYPE = ValuesType<typeof SEARCH_RESULT_TYPE>;
