import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
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
