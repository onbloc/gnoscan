import { makeCompactNumber, makeEncodedQueryParameter } from "./string-util";

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
