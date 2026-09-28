import { ActivityAmount } from "@/models/api/activity/activity-model";
import { formatTokenDecimal } from "@/common/utils/token.utility";

export interface DisplayAmount {
  value: string;
  denom: string;
  tokenIds?: string[];
}

/**
 * ActivityAmount carries a raw exact-integer value plus its own decimals/symbol -
 * unlike the rest of the app's Amount type, it never needs a client-side token-meta
 * lookup to know how to display itself.
 */
export function toDisplayAmount(amount: ActivityAmount): DisplayAmount {
  return {
    value: formatTokenDecimal(amount.value, amount.decimals),
    denom: amount.symbol || amount.denom,
    tokenIds: amount.tokenIds,
  };
}

interface StorageOnlyEventsParams {
  isFetched: boolean;
  totalEventCount?: number;
  visibleEventCount: number;
  eventType: string;
  includeStorage: boolean;
}

/**
 * True when the Events list is empty only because storage events are hidden:
 * no type filter applied, yet the unfiltered total (storage included) is non-zero.
 */
export function isOnlyStorageEventsHidden({
  isFetched,
  totalEventCount,
  visibleEventCount,
  eventType,
  includeStorage,
}: StorageOnlyEventsParams): boolean {
  return isFetched && !includeStorage && !eventType && visibleEventCount === 0 && (totalEventCount ?? 0) > 0;
}
