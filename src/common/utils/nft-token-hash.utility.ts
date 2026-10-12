// Deep link to one NFT on its collection page: the Inventory tab with that token's detail panel open,
// e.g. "#inventory&tokenId=1011". The first segment stays a plain tab hash (see detail-tabs/tab-hash).
const INVENTORY_TAB_HASH = "inventory";
const TOKEN_ID_PARAM = "tokenId";

export function makeNftTokenHash(nftId: string): string {
  return `#${INVENTORY_TAB_HASH}&${TOKEN_ID_PARAM}=${encodeURIComponent(nftId)}`;
}

/** The NFT id a collection-page hash points to, or null when it names none. */
export function parseNftTokenHash(hash: string): string | null {
  const [, ...params] = hash.replace(/^#/, "").split("&");
  const tokenId = new URLSearchParams(params.join("&")).get(TOKEN_ID_PARAM);
  return tokenId || null;
}
