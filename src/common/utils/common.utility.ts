export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MAX_USERNAME_STRING_LENGTH = 8;

export const truncateDashboardUsername = (username: string) => {
  if (!username) return username;

  if (username.length > MAX_USERNAME_STRING_LENGTH) {
    return `${username.slice(0, MAX_USERNAME_STRING_LENGTH)}...`;
  }
  return username;
};
