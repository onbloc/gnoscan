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
});
