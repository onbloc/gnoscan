import {
  base64HashToHex,
  hexHashToBase64,
  isBase64Hash,
  isHash,
  isHexHash,
  makeSafeBase64Hash,
  parseTxHash,
  toDisplayHash,
} from "./transaction.utility";

const PADDED_BASE64_HASH = "lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4=";
const UNPADDED_BASE64_HASH = "lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4";
const HEX_HASH = "3031323334353637383961626364656630313233343536373839616263646566";

describe("isHexHash", () => {
  it("accepts a 64-char hex string", () => {
    expect(isHexHash(HEX_HASH)).toBe(true);
    expect(isHexHash(HEX_HASH.toUpperCase())).toBe(true);
  });

  it("rejects non-hex or wrong-length strings", () => {
    expect(isHexHash(PADDED_BASE64_HASH)).toBe(false);
    expect(isHexHash(HEX_HASH.slice(0, -1))).toBe(false);
  });
});

describe("isBase64Hash", () => {
  it("accepts a padded 44-char base64 hash", () => {
    expect(isBase64Hash(PADDED_BASE64_HASH)).toBe(true);
  });

  it("accepts a legacy unpadded 43-char base64 hash", () => {
    expect(isBase64Hash(UNPADDED_BASE64_HASH)).toBe(true);
  });

  it("rejects hex and malformed strings", () => {
    expect(isBase64Hash(HEX_HASH)).toBe(false);
    expect(isBase64Hash("not-a-hash")).toBe(false);
  });
});

describe("isHash", () => {
  it("recognizes hex, padded base64, and unpadded base64 hashes", () => {
    expect(isHash(HEX_HASH)).toBe(true);
    expect(isHash(PADDED_BASE64_HASH)).toBe(true);
    expect(isHash(UNPADDED_BASE64_HASH)).toBe(true);
  });

  it("rejects unrelated strings", () => {
    expect(isHash("gno.land/r/demo/foo")).toBe(false);
  });
});

describe("makeSafeBase64Hash", () => {
  it("converts hex to padded base64", () => {
    expect(makeSafeBase64Hash(HEX_HASH)).toBe(hexHashToBase64(HEX_HASH));
  });

  it("returns padded base64 unchanged", () => {
    expect(makeSafeBase64Hash(PADDED_BASE64_HASH)).toBe(PADDED_BASE64_HASH);
  });

  it("pads a legacy unpadded base64 hash", () => {
    expect(makeSafeBase64Hash(UNPADDED_BASE64_HASH)).toBe(PADDED_BASE64_HASH);
  });
});

describe("base64HashToHex / hexHashToBase64", () => {
  it("round-trips between hex and base64", () => {
    expect(hexHashToBase64(HEX_HASH)).toEqual(expect.any(String));
    expect(base64HashToHex(hexHashToBase64(HEX_HASH))).toBe(HEX_HASH);
  });
});

describe("toDisplayHash", () => {
  it("uppercases hex hashes", () => {
    expect(toDisplayHash(HEX_HASH)).toBe(HEX_HASH.toUpperCase());
  });

  it("leaves base64 hashes untouched", () => {
    expect(toDisplayHash(PADDED_BASE64_HASH)).toBe(PADDED_BASE64_HASH);
  });
});

describe("parseTxHash", () => {
  it("returns an empty string when txhash is missing", () => {
    expect(parseTxHash("/transactions/details")).toBe("");
  });

  it("passes hex hashes through unchanged", () => {
    const url = `/transactions/details?txhash=${HEX_HASH}`;
    expect(parseTxHash(url)).toBe(HEX_HASH);
  });

  it("returns a padded base64 hash unchanged", () => {
    const url = `/transactions/details?txhash=${encodeURIComponent(PADDED_BASE64_HASH)}`;
    expect(parseTxHash(url)).toBe(PADDED_BASE64_HASH);
  });

  it("normalizes a legacy unpadded base64 hash to padded base64", () => {
    const url = `/transactions/details?txhash=${encodeURIComponent(UNPADDED_BASE64_HASH)}`;
    expect(parseTxHash(url)).toBe(PADDED_BASE64_HASH);
  });

  it("passes malformed values through unchanged instead of mangling them", () => {
    expect(parseTxHash("/transactions/details?txhash=not-a-hash")).toBe("not-a-hash");
    expect(parseTxHash("/transactions/details?txhash=abc")).toBe("abc");
  });
});
