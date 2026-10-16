import { makeCompactNumber, makeEncodedQueryParameter, truncateStartToWidth } from "./string-util";

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

describe("truncateStartToWidth", () => {
  // One unit per character keeps the expected widths easy to read.
  const measure = (value: string) => value.length;

  it("returns text that already fits unchanged", () => {
    expect(truncateStartToWidth("r/gnoswap/gns", 13, measure)).toBe("r/gnoswap/gns");
  });

  it("keeps the longest tail that fits after the ellipsis", () => {
    expect(truncateStartToWidth("r/demo/defi/grc20factory", 12, measure)).toBe("…rc20factory");
    expect(truncateStartToWidth("r/demo/defi/grc20factory", 14, measure)).toBe("…/grc20factory");
  });
});
