import { decodeTxMessages } from "@gnolang/gno-js-client";
import { Tx } from "@gnolang/tm2-js-client";
import {
  base64HashToHex,
  decodeTransaction,
  hexHashToBase64,
  isBase64Hash,
  isHash,
  isHexHash,
  makeSafeBase64Hash,
  makeTransactionMessageInfo,
  parseTxHash,
  toDisplayHash,
} from "./transaction.utility";

// The real @gnolang packages transitively pull in ESM (uuid) that jest can't parse,
// so only the pieces decodeTransaction needs are mocked here.
jest.mock("@gnolang/gno-js-client", () => ({ decodeTxMessages: jest.fn() }));
jest.mock("@/common/hooks/common/use-token-meta", () => ({ GNOTToken: { denom: "ugnot" } }));
jest.mock("@gnolang/tm2-js-client", () => ({
  Tx: { decode: jest.fn() },
  base64ToUint8Array: (b64: string) => Uint8Array.from(Buffer.from(b64, "base64")),
  uint8ArrayToBase64: (bytes: Uint8Array) => Buffer.from(bytes).toString("base64"),
}));

const mockedDecodeTxMessages = decodeTxMessages as jest.MockedFunction<typeof decodeTxMessages>;
const mockedTxDecode = Tx.decode as jest.MockedFunction<typeof Tx.decode>;

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

describe("decodeTransaction", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("keeps the raw payload of an unsupported message while decoding supported ones", () => {
    const supported = { type_url: "/vm.m_call", value: Uint8Array.from([1, 2, 3]) };
    const unsupported = { type_url: "/vm.m_unknown", value: Uint8Array.from([4, 5, 6]) };
    mockedTxDecode.mockReturnValue({
      messages: [supported, unsupported],
      signatures: [],
      memo: "",
    } as unknown as ReturnType<typeof Tx.decode>);
    mockedDecodeTxMessages.mockImplementation(messages => {
      if (messages[0].type_url !== "/vm.m_call") {
        throw new Error(`unsupported message type ${messages[0].type_url}`);
      }
      return [{ "@type": "/vm.m_call", caller: "g1caller" }];
    });

    const decoded = decodeTransaction("AQID");

    expect(decoded.messages).toEqual([
      { "@type": "/vm.m_call", caller: "g1caller" },
      { "@type": "/vm.m_unknown", value: Buffer.from([4, 5, 6]).toString("base64"), unsupported: true },
    ]);
  });
});

describe("makeTransactionMessageInfo", () => {
  it("returns null for a missing message (e.g. all messages of a tx were undecodable)", () => {
    expect(makeTransactionMessageInfo(undefined)).toBeNull();
    expect(makeTransactionMessageInfo(null)).toBeNull();
  });

  it("returns null for an unrecognized message type", () => {
    expect(makeTransactionMessageInfo({ "@type": "/vm.m_enable_pkg" })).toBeNull();
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
