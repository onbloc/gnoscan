import { ActivityAmount } from "@/models/api/activity/activity-model";
import { formatTokenDecimal } from "@/common/utils/token.utility";

export interface DisplayAmount {
  value: string;
  denom: string;
  tokenIds?: string[];
}

/**
 * ActivityAmount carries a raw exact-integer value plus the backend's decimals/symbol.
 * Pass the token meta resolved from the token resource list (see useTokenResourceMeta)
 * so display matches the rest of the app; the backend values are only the fallback.
 */
export function toDisplayAmount(
  amount: ActivityAmount,
  meta: { symbol: string; decimals: number } = amount,
): DisplayAmount {
  return {
    value: formatTokenDecimal(amount.value, meta.decimals),
    denom: meta.symbol || amount.symbol || amount.denom,
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
