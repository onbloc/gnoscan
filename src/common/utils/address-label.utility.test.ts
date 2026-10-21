import { getAddressDisplayText, getAddressLinkPath, getAddressNameTag } from "./address-label.utility";
import { ADDRESS_LABEL_TAG, ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";

describe("getAddressDisplayText", () => {
  it("prefers a resolved name over a label or the raw address", () => {
    expect(getAddressDisplayText({ address: "g1abc", name: "alice", label: "gno.land/r/gnoswap/router" })).toBe(
      "alice",
    );
  });

  it("falls back to the label when there is no resolved name", () => {
    expect(getAddressDisplayText({ address: "g1abc", label: "gno.land/r/gnoswap/router" })).toBe("r/gnoswap/router");
  });

  it("strips the gno.land/ prefix from a realm label but leaves a non-realm label untouched", () => {
    expect(getAddressDisplayText({ address: "g1abc", label: "Binance" })).toBe("Binance");
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

  it.each([ADDRESS_LABEL_TYPE.EXCHANGE, ADDRESS_LABEL_TYPE.ENTITY])(
    "links to the account page for a %s label",
    labelType => {
      expect(getAddressLinkPath({ address: "g1abc", label: "Kraken #1", labelType })).toBe("/account/g1abc");
    },
  );

  it("links to the account page instead of the realm page when a name is resolved", () => {
    expect(
      getAddressLinkPath({
        address: "g1abc",
        name: "alice",
        label: "gno.land/r/gnoswap/router",
        labelType: ADDRESS_LABEL_TYPE.REALM,
      }),
    ).toBe("/account/g1abc");
  });
});

describe("getAddressNameTag", () => {
  it.each([
    [ADDRESS_LABEL_TAG.TREASURY, "Treasury"],
    [ADDRESS_LABEL_TAG.INVESTORS, "Investors"],
    [ADDRESS_LABEL_TAG.TEAM, "Company/Team"],
    [ADDRESS_LABEL_TAG.CEX, "Exchange (CEX)"],
    [ADDRESS_LABEL_TAG.DEX, "Exchange (DEX)"],
  ])("maps labelTag %s to %s", (labelTag, text) => {
    expect(getAddressNameTag({ labelTag })).toBe(text);
  });

  it("prefers the labelTag over the on-chain nameTag", () => {
    expect(getAddressNameTag({ labelTag: ADDRESS_LABEL_TAG.CEX, nameTag: "alice" })).toBe("Exchange (CEX)");
  });

  it("falls back to the nameTag, else null", () => {
    expect(getAddressNameTag({ nameTag: "alice" })).toBe("alice");
    expect(getAddressNameTag({ labelTag: null, nameTag: "" })).toBeNull();
    expect(getAddressNameTag({})).toBeNull();
  });

  it("ignores unknown tag codes, including inherited object keys", () => {
    expect(getAddressNameTag({ labelTag: "unknown" as ADDRESS_LABEL_TAG, nameTag: "alice" })).toBe("alice");
    expect(getAddressNameTag({ labelTag: "constructor" as ADDRESS_LABEL_TAG })).toBeNull();
  });
});
