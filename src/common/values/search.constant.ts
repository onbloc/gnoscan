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

export const SEARCH_TYPE_TITLES = {
  [SEARCH_RESULT_TYPE.ACCOUNT]: "Accounts",
  [SEARCH_RESULT_TYPE.BLOCK]: "Blocks",
  [SEARCH_RESULT_TYPE.TOKEN]: "Tokens",
  [SEARCH_RESULT_TYPE.PROPOSAL]: "Proposals",
  [SEARCH_RESULT_TYPE.REALM]: "Realms",
  [SEARCH_RESULT_TYPE.TRANSACTION]: "Transactions",
} as const;
