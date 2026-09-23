/**
 * Canonical detail-page tab names and per-entity ordering for the unified
 * activity tabs (direct transactions / native transfers / token transfers /
 * internal transactions / events / holders).
 *
 * Order matters: DataListSection renders tabs in array order, and every zero
 * count tab still renders (no hiding empty tabs).
 */
export const ACTIVITY_TAB = {
  TRANSACTIONS: "Transactions",
  NATIVE_TRANSFERS: "Native Transfers",
  TOKEN_TRANSFERS: "Token Transfers",
  INTERNAL_TRANSACTIONS: "Internal Transactions",
  EVENTS: "Events",
  HOLDERS: "Holders",
} as const;

export type ActivityTabName = (typeof ACTIVITY_TAB)[keyof typeof ACTIVITY_TAB];

export const ACCOUNT_DETAIL_TABS: ActivityTabName[] = [
  ACTIVITY_TAB.TRANSACTIONS,
  ACTIVITY_TAB.NATIVE_TRANSFERS,
  ACTIVITY_TAB.TOKEN_TRANSFERS,
];

export const REALM_DETAIL_TABS: ActivityTabName[] = [
  ACTIVITY_TAB.TRANSACTIONS,
  ACTIVITY_TAB.NATIVE_TRANSFERS,
  ACTIVITY_TAB.TOKEN_TRANSFERS,
  ACTIVITY_TAB.INTERNAL_TRANSACTIONS,
  ACTIVITY_TAB.EVENTS,
];

export const TOKEN_DETAIL_TABS: ActivityTabName[] = [
  ACTIVITY_TAB.TRANSACTIONS,
  ACTIVITY_TAB.NATIVE_TRANSFERS,
  ACTIVITY_TAB.TOKEN_TRANSFERS,
  ACTIVITY_TAB.INTERNAL_TRANSACTIONS,
  ACTIVITY_TAB.EVENTS,
  ACTIVITY_TAB.HOLDERS,
];
