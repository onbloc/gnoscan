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
