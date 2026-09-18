import { getAddressDisplayText, getAddressLinkPath } from "./address-label.utility";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

describe("getAddressDisplayText", () => {
  it("prefers a resolved name over a label or the raw address", () => {
    expect(getAddressDisplayText({ address: "g1abc", name: "alice", label: "gno.land/r/gnoswap/router" })).toBe(
      "alice",
    );
  });

  it("falls back to the label when there is no resolved name", () => {
    expect(getAddressDisplayText({ address: "g1abc", label: "gno.land/r/gnoswap/router" })).toBe(
      "gno.land/r/gnoswap/router",
    );
  });

  it("falls back to the raw address when there is no name or label", () => {
    expect(getAddressDisplayText({ address: "g1abc" })).toBe("g1abc");
  });

  it("returns undefined when nothing is available", () => {
    expect(getAddressDisplayText({})).toBeUndefined();
  });
});

describe("getAddressLinkPath", () => {
  it("links to the realm page when labelType is realm", () => {
    expect(
      getAddressLinkPath({
        address: "g1abc",
        label: "gno.land/r/gnoswap/router",
        labelType: ADDRESS_LABEL_TYPE.REALM,
      }),
    ).toBe("/realms/details?path=gno.land/r/gnoswap/router");
  });

  it("links to the account page when there is no label", () => {
    expect(getAddressLinkPath({ address: "g1abc" })).toBe("/account/g1abc");
  });

  it("links to the account page when labelType is realm but label is missing", () => {
    expect(getAddressLinkPath({ address: "g1abc", labelType: ADDRESS_LABEL_TYPE.REALM })).toBe("/account/g1abc");
  });

  it("links to the account page for a non-realm label", () => {
    expect(
      getAddressLinkPath({ address: "g1abc", label: "Binance", labelType: "exchange" as ADDRESS_LABEL_TYPE }),
    ).toBe("/account/g1abc");
  });
});
