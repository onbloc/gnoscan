import React from "react";

import { replaceUrlHash, toTabHash } from "@/common/hooks/detail-tabs/tab-hash";
import { makeNftTokenHash, parseNftTokenHash } from "@/common/utils/nft-token-hash.utility";
import { INVENTORY_TAB } from "@/common/values/activity-tab.constant";

/**
 * The NFT whose detail panel is open on a collection page, kept in the URL hash
 * ("#inventory&tokenId=1011") so the panel can be linked to. Selecting replaces the
 * hash without a new history entry, so Back still leaves the page.
 */
export function useSelectedNftToken() {
  const [tokenId, setTokenId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const syncFromHash = () => setTokenId(parseNftTokenHash(window.location.hash));
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const selectToken = React.useCallback((nextTokenId: string | null) => {
    replaceUrlHash(nextTokenId ? makeNftTokenHash(nextTokenId) : `#${toTabHash(INVENTORY_TAB)}`);
    setTokenId(nextTokenId);
  }, []);

  return [tokenId, selectToken] as const;
}
