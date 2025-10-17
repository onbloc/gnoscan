/* eslint-disable @typescript-eslint/no-explicit-any */
import { GnoEvent, StorageUnlockEventData } from "@/types";
import { EVENT_TYPES, EventType, GnoEventData, StorageDepositEventData } from "@/types";

export type EventParser = (
  event: any,
  baseInfo: {
    id: string;
    blockHeight: number;
    transactionHash: string;
    time: string;
    caller: string;
  },
) => GnoEvent;

const eventParsers: Record<EventType, EventParser> = {
  [EVENT_TYPES.GNO_EVENT]: (event: GnoEventData, baseInfo): GnoEvent => ({
    ...baseInfo,
    type: event.type,
    packagePath: event.pkg_path,
    functionName: event.func,
    attrs: event.attrs || [],
  }),

  [EVENT_TYPES.STORAGE_DEPOSIT_EVENT]: (event: StorageDepositEventData, baseInfo): GnoEvent => ({
    ...baseInfo,
    type: "StorageDeposit",
    packagePath: event.pkg_path,
    functionName: "StorageDeposit",
    attrs: [
      { key: "bytes_delta", value: event.bytes_delta || "" },
      { key: "fee_delta", value: event.fee_delta || "" },
    ],
  }),

  [EVENT_TYPES.STORAGE_UNLOCK_EVENT]: (event: StorageUnlockEventData, baseInfo): GnoEvent => ({
    ...baseInfo,
    type: "StorageUnlock",
    packagePath: event.pkg_path,
    functionName: "StorageUnlock",
    attrs: [
      { key: "bytes_delta", value: event.bytes_delta || "" },
      { key: "fee_refund", value: event.fee_refund || "" },
      { key: "refund_withheld", value: String(event.refund_withheld || false) },
    ],
  }),
};

const parseUnknownEvent = (
  event: any,
  baseInfo: {
    id: string;
    blockHeight: number;
    transactionHash: string;
    time: string;
    caller: string;
  },
): GnoEvent => ({
  ...baseInfo,
  type: event["@type"] || "Unknown",
  packagePath: event.pkg_path || "",
  functionName: "Unknown",
  attrs: [],
});

/**
 * Parses transaction events and converts them into GnoEvent format
 * @param event Original event data
 * @param index Event index
 * @param transactionHash Transaction hash
 * @param blockHeight Block height
 * @param blockTime Block time
 * @param caller Caller address
 * @returns Parsed GnoEvent object
 */
export const parseTransactionEvent = (
  event: any,
  index: number,
  transactionHash: string,
  blockHeight: number,
  blockTime: string,
  caller: string,
): GnoEvent => {
  const baseInfo = {
    id: `${transactionHash}_${index}`,
    blockHeight,
    transactionHash,
    time: blockTime,
    caller,
  };

  const eventType = event["@type"] as EventType;
  const parser = eventParsers[eventType];

  if (parser) {
    return parser(event, baseInfo);
  }

  console.warn(`Unknown event type: ${eventType}`, event);
  return parseUnknownEvent(event, baseInfo);
};

/**
 * Batch parsing of multiple events
 * @param events Array of events
 * @param transactionHash Transaction hash
 * @param blockHeight Block height
 * @param blockTime Block time
 * @param caller Caller address
 * @returns Array of parsed GnoEvent objects
 */
export const parseTransactionEvents = (
  events: any[],
  transactionHash: string,
  blockHeight: number,
  blockTime: string,
  caller: string,
): GnoEvent[] => {
  return events.map((event, index) =>
    parseTransactionEvent(event, index, transactionHash, blockHeight, blockTime, caller),
  );
};
