export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Runs `fn`, returning `fallback` instead of throwing if it fails.
 * Use to keep one bad/unrecognized item (e.g. a new on-chain data shape a
 * client library doesn't know yet) from breaking an entire list/page render.
 */
export function tryOrDefault<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch (error) {
    console.warn("tryOrDefault: falling back after error", error);
    return fallback;
  }
}

const MAX_USERNAME_STRING_LENGTH = 8;

export const truncateDashboardUsername = (username: string) => {
  if (!username) return username;

  if (username.length > MAX_USERNAME_STRING_LENGTH) {
    return `${username.slice(0, MAX_USERNAME_STRING_LENGTH)}...`;
  }
  return username;
};

/**
 * True once a detail API query settles without its entity. Keyed on missing data rather than
 * isError, because a failed background refetch keeps the cached entity and must not hide the page.
 */
export const isApiNotFound = (query: { isFetched: boolean; isError: boolean; data?: { data?: unknown } | null }) =>
  query.isFetched && !query.data?.data;
