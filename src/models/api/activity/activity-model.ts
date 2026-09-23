/**
 * A single fungible or non-fungible amount carried by an activity row.
 *
 * `value` is the raw, exact integer string (never pre-shifted by decimals).
 * For an NFT collection, `value` is the transferred count, `decimals` is 0,
 * `denom` is the exact registered token id, and `tokenIds` lists the
 * individual token ids that made up the count.
 */
export interface ActivityAmount {
  denom: string;
  value: string;
  decimals: number;
  symbol: string;
  tokenIds?: string[];
}

export type ActivityTransferSource = "MsgSend" | "internal" | "token";

export interface ActivityTransfer {
  fromAddress: string;
  toAddress: string;
  amount: ActivityAmount;
  source: ActivityTransferSource;
  // Event index within the tx: for a message-only synthetic transfer (no backing
  // event), the backend uses the message index instead - still a deterministic
  // ordering key, just not literally an event position.
  eventIndex: number;
}

export interface ActivityMessage {
  index: number;
  messageType: string;
  funcType: string;
  pkgPath: string;
  args: string[];
}

export interface ActivityEvent {
  eventIndex: number;
  eventType: string;
  packagePath: string;
  attributes: { key: string; value: string }[];
}

export interface ActivityFunc {
  messageType: string;
  funcType: string;
  pkgPath: string;
}

/**
 * Unified per-tx activity row shared by every direct-transactions,
 * native-transfers, token-transfers, and internal-transactions endpoint.
 *
 * One row per tx hash; all matching transfers/messages/events for that tx are
 * aggregated inline so a single page of hashes hydrates its full expansion.
 */
export interface ActivityRow {
  txHash: string;
  blockHeight: number;
  timestamp: string;

  successYn: boolean;
  messageCount: number;
  func: ActivityFunc[];
  fee: { value: string; denom: string };

  callerAddress: string;

  nativeValue: ActivityAmount;

  amountsIn: ActivityAmount[];
  amountsOut: ActivityAmount[];

  volume: ActivityAmount[];
  transferCount: number;
  transfers: ActivityTransfer[];

  messages: ActivityMessage[];
  realmEvents: ActivityEvent[];
}

export interface ActivityPage {
  cursor: string;
  hasNext: boolean;
  totalCount?: number;
}

export interface ActivityListResponse {
  items: ActivityRow[];
  page: ActivityPage;
}
