import { GNOSWAP_STAKER_ADDRESS } from "../values/constant-value";
import { isGnftPackagePath } from "./token.utility";

export function isStakedNft({ packagePath, ownerAddress }: { packagePath: string; ownerAddress: string }): boolean {
  return isGnftPackagePath(packagePath) && ownerAddress === GNOSWAP_STAKER_ADDRESS;
}
