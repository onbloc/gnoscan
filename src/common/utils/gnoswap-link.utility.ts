import { GNOSWAP_APP_BASE_URL } from "../values/constant-value";
import { formatTokenDecimal } from "./token.utility";

// gnoscan has no pool or position page of its own, so these link out to gnoswap's app.
export const gnoswapPoolUrl = (poolPath: string) =>
  `${GNOSWAP_APP_BASE_URL}/earn/pool?poolPath=${encodeURIComponent(poolPath)}`;

// The pool page focused on one position; `ownerAddress` is whoever holds it in gnoswap
// (the operator who staked it while the staker realm owns the NFT).
export const gnoswapPositionUrl = (poolPath: string, positionId: string, ownerAddress?: string) => {
  const addrQuery = ownerAddress ? `&addr=${encodeURIComponent(ownerAddress)}` : "";
  return `${gnoswapPoolUrl(poolPath)}${addrQuery}#${encodeURIComponent(positionId)}`;
};

// Pool fee tiers are raw hundredths-of-a-bip units (e.g. 3000 = 0.3%), same as gnoswap itself
// uses - see onbloc-api-v3's gnoswap/pool.go.
export const formatPoolFeePercent = (fee: string | number) => `${formatTokenDecimal(fee, 4)}%`;

export interface ParsedPoolPath {
  token0Path: string;
  token1Path: string;
  fee: string;
}

// "token0Path:token1Path:fee", the on-chain pool path.
export function parsePoolPath(poolPath: string): ParsedPoolPath | null {
  const [token0Path, token1Path, fee] = poolPath.split(":");
  return token0Path && token1Path && fee ? { token0Path, token1Path, fee } : null;
}
