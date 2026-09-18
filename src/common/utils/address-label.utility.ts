import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

interface AddressLabelInfo {
  address?: string | null;
  name?: string | null;
  label?: string | null;
  labelType?: ADDRESS_LABEL_TYPE | null;
}

// Priority: a resolved name (username/nameTag) beats a curated label, which beats the raw address.
export function getAddressDisplayText({ address, name, label }: AddressLabelInfo): string | undefined {
  return name || label || address || undefined;
}

// A curated address links to its realm page when labelType is "realm" (label holds the package
// path in that case); every other address links to its account page.
export function getAddressLinkPath({ address, label, labelType }: AddressLabelInfo): string {
  if (labelType === ADDRESS_LABEL_TYPE.REALM && label) {
    return `/realms/details?path=${label}`;
  }

  return `/account/${address ?? ""}`;
}
