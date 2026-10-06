import {
  ADDRESS_LABEL_TYPE,
  ADDRESS_NAME_TAG,
  MAINNET_ADDRESS_NAME_TAGS,
  MAINNET_DEX_REALM_PREFIX,
} from "@/common/values/address-label.constant";
import { GNOLAND_CHAIN_ID } from "@/common/values/constant-value";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";

interface AddressLabelInfo {
  address?: string | null;
  name?: string | null;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
}

// Priority: a resolved name (username/nameTag) beats a curated label, which beats the raw address.
// A realm label holds a full package path (e.g. "gno.land/r/demo/foo20"), so it's stripped of the
// "gno.land/" prefix the same way every other realm-path display in the app is.
export function getAddressDisplayText({ address, name, label }: AddressLabelInfo): string | undefined {
  return name || (label ? stripGnoLandPrefix(label) : label) || address || undefined;
}

// A curated address links to its realm page when labelType is "realm" (label holds the package
// path in that case); every other address links to its account page. A resolved name takes the
// same precedence here as it does in getAddressDisplayText, so a named realm address (e.g. one
// that also has a NameTag) still links where its displayed text implies - the account page.
export function getAddressLinkPath({ address, name, label, labelType }: AddressLabelInfo): string {
  if (!name && labelType === ADDRESS_LABEL_TYPE.REALM && label) {
    return `/realms/details?path=${label}`;
  }

  return `/account/${address ?? ""}`;
}

interface AddressNameTagInfo {
  address?: string | null;
  nameTag?: string | null;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
  chainId?: string | null;
}

// Priority: curated mainnet name tag, then the backend nameTag. Curated tags apply on mainnet only.
export function getAddressNameTag({ address, nameTag, label, labelType, chainId }: AddressNameTagInfo): string | null {
  if (chainId === GNOLAND_CHAIN_ID) {
    // Own-key check so inherited keys (e.g. "constructor") never match.
    if (address && Object.prototype.hasOwnProperty.call(MAINNET_ADDRESS_NAME_TAGS, address)) {
      return MAINNET_ADDRESS_NAME_TAGS[address];
    }

    if (labelType === ADDRESS_LABEL_TYPE.REALM && label?.startsWith(MAINNET_DEX_REALM_PREFIX)) {
      return ADDRESS_NAME_TAG.DEX;
    }
  }

  return nameTag || null;
}
