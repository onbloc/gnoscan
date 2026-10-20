import { parseRealmPath } from "./realm.utility";

describe("parseRealmPath", () => {
  it("returns the path query param", () => {
    expect(parseRealmPath("/realms/details?path=gno.land/r/demo/foo")).toBe("gno.land/r/demo/foo");
    expect(parseRealmPath("/realms/details?path=gno.land/r/demo/foo&chainId=test")).toBe("gno.land/r/demo/foo");
  });

  it("ignores the URL hash that selects a detail tab", () => {
    expect(parseRealmPath("/realms/details?path=gno.land/r/demo/foo#events")).toBe("gno.land/r/demo/foo");
    expect(parseRealmPath("/realms/details?path=gno.land/r/demo/foo&chainId=test#events")).toBe("gno.land/r/demo/foo");
  });

  it("decodes a percent encoded path", () => {
    expect(parseRealmPath("/realms/details?path=gno.land%2Fr%2Fdemo%2Ffoo")).toBe("gno.land/r/demo/foo");
    expect(parseRealmPath("/realms/details?chainId=test&path=gno.land%2Fr%2Fdemo%2Ffoo#events")).toBe(
      "gno.land/r/demo/foo",
    );
  });

  it("returns an empty string without an exact path param", () => {
    expect(parseRealmPath("/realms/details")).toBe("");
    expect(parseRealmPath("/realms/details?subpath=gno.land/r/demo/foo")).toBe("");
  });

  it("keeps a malformed percent sequence as is", () => {
    expect(parseRealmPath("/realms/details?path=gno.land/r/demo/foo%")).toBe("gno.land/r/demo/foo%");
  });

  it("reads back the path from a /search keyword redirect", () => {
    // Shape produced by processSearchKeyword for "gno.land/r/gnoswap/gns" (GNS-510)
    expect(parseRealmPath("/realms/details?chainId=test&path=gno.land%2Fr%2Fgnoswap%2Fgns")).toBe(
      "gno.land/r/gnoswap/gns",
    );
  });
});
