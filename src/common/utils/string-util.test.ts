import { makeEncodedQueryParameter } from "./string-util";

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
