import { fitPathToWidth, formatDisplayPackagePath, makeCompactNumber, makeEncodedQueryParameter } from "./string-util";

describe("formatDisplayPackagePath", () => {
  const ADDRESS = "g1t2kg2vtr3fukg43eujkn6x53gfdyakhngt4sfd";

  it("keeps the first and last 4 characters of a middle address and the names after it", () => {
    expect(formatDisplayPackagePath(`r/${ADDRESS}/gnofly/nfts/planes`)).toBe("r/g1t2...4sfd/gnofly/nfts/planes");
  });

  it("shortens every address segment in the path", () => {
    expect(formatDisplayPackagePath(`r/${ADDRESS}/market/${ADDRESS}`)).toBe("r/g1t2...4sfd/market/g1t2...4sfd");
  });

  it("leaves paths without an address and short address-like segments unchanged", () => {
    expect(formatDisplayPackagePath("r/gnoswap/gnft")).toBe("r/gnoswap/gnft");
    expect(formatDisplayPackagePath("r/g1abc/name")).toBe("r/g1abc/name");
  });

  it("returns an empty string for a missing path", () => {
    expect(formatDisplayPackagePath(undefined)).toBe("");
    expect(formatDisplayPackagePath(null)).toBe("");
  });
});

describe("fitPathToWidth", () => {
  // One unit of width per character keeps the expectations readable.
  const measure = (candidate: string) => candidate.length;
  const path = "r/g1n4...rhmt/bazaar/c/bazaargens";

  it("keeps the whole path when it fits", () => {
    expect(fitPathToWidth(path, path.length, measure)).toBe(path);
  });

  it("drops whole leading segments instead of cutting an address in the middle", () => {
    expect(fitPathToWidth(path, path.length - 1, measure)).toBe(".../bazaar/c/bazaargens");
  });

  it("keeps dropping segments until the rest fits and always keeps the last name", () => {
    expect(fitPathToWidth(path, ".../c/bazaargens".length, measure)).toBe(".../c/bazaargens");
    expect(fitPathToWidth(path, 1, measure)).toBe(".../bazaargens");
  });

  it("leaves a single segment unchanged", () => {
    expect(fitPathToWidth("bazaargens", 3, measure)).toBe("bazaargens");
  });
});

describe("makeEncodedQueryParameter", () => {
  it("returns an empty string when every value is missing", () => {
    expect(makeEncodedQueryParameter({ cursor: undefined, eventType: null })).toBe("");
  });

  it("keeps reserved characters inside the value", () => {
    const query = makeEncodedQueryParameter({ eventType: "Transfer#x&limit=5", includeStorage: false });
    const params = new URLSearchParams(query.slice(1));

    expect(query.startsWith("?")).toBe(true);
    expect(query).not.toContain("#");
    expect(params.get("eventType")).toBe("Transfer#x&limit=5");
    expect(params.get("includeStorage")).toBe("false");
    expect(params.has("limit")).toBe(false);
  });
});

describe("makeCompactNumber", () => {
  it("abbreviates supply amounts", () => {
    expect(makeCompactNumber(197320000)).toBe("197.32M");
    expect(makeCompactNumber("1333000221")).toBe("1.333B");
    expect(makeCompactNumber("not a number")).toBe("0");
  });
});
