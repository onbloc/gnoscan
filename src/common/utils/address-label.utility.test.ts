import { getAddressDisplayText, getAddressLinkPath, getAddressNameTag } from "./address-label.utility";
import { ADDRESS_LABEL_TYPE, ADDRESS_NAME_TAG } from "@/common/values/address-label.constant";
import { GNOLAND_CHAIN_ID, STAGING_CHAIN_ID } from "@/common/values/constant-value";

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
  const CORE_TREASURY = "g1shmvjxkvx9kgnrta5rzwcpdqszy4pkfvv9qjz9";
  const KRAKEN = "g15zetuthld0er5jrm3xtx3u4ucssjvd3ylmvce3";

  it("uses the curated name tag on mainnet over the backend nameTag", () => {
    expect(getAddressNameTag({ address: CORE_TREASURY, nameTag: "alice", chainId: GNOLAND_CHAIN_ID })).toBe(
      ADDRESS_NAME_TAG.TREASURY,
    );
    expect(getAddressNameTag({ address: KRAKEN, chainId: GNOLAND_CHAIN_ID })).toBe(ADDRESS_NAME_TAG.CEX);
  });

  it("tags gnoswap realms as DEX on mainnet", () => {
    expect(
      getAddressNameTag({
        address: "g1abc",
        label: "gno.land/r/gnoswap/v1/router",
        labelType: ADDRESS_LABEL_TYPE.REALM,
        chainId: GNOLAND_CHAIN_ID,
      }),
    ).toBe(ADDRESS_NAME_TAG.DEX);
  });

  it("does not tag a non-realm label or a lookalike path as DEX", () => {
    const base = { address: "g1abc", chainId: GNOLAND_CHAIN_ID };
    expect(
      getAddressNameTag({ ...base, label: "gno.land/r/gnoswap/router", labelType: ADDRESS_LABEL_TYPE.ENTITY }),
    ).toBeNull();
    expect(
      getAddressNameTag({ ...base, label: "gno.land/r/gnoswapx/router", labelType: ADDRESS_LABEL_TYPE.REALM }),
    ).toBeNull();
  });

  it("falls back to the backend nameTag, else null", () => {
    expect(getAddressNameTag({ address: "g1abc", nameTag: "alice", chainId: GNOLAND_CHAIN_ID })).toBe("alice");
    expect(getAddressNameTag({ address: "g1abc", nameTag: "", chainId: GNOLAND_CHAIN_ID })).toBeNull();
    expect(getAddressNameTag({})).toBeNull();
  });

  it("ignores curated tags outside mainnet", () => {
    expect(getAddressNameTag({ address: CORE_TREASURY, nameTag: "alice", chainId: STAGING_CHAIN_ID })).toBe("alice");
    expect(
      getAddressNameTag({
        address: "g1abc",
        label: "gno.land/r/gnoswap/router",
        labelType: ADDRESS_LABEL_TYPE.REALM,
        chainId: STAGING_CHAIN_ID,
      }),
    ).toBeNull();
  });

  it("does not match inherited object keys", () => {
    expect(getAddressNameTag({ address: "constructor", chainId: GNOLAND_CHAIN_ID })).toBeNull();
  });
});
