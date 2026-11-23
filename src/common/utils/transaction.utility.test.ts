import { decodeTxMessages } from "@gnolang/gno-js-client";
import { Tx } from "@gnolang/tm2-js-client";
import { gnoCodec, std } from "@gnolang/amino-ts/gno";
import {
  base64HashToHex,
  decodeTransaction,
  hexHashToBase64,
  isBase64Hash,
  isHash,
  isHexHash,
  makeHash,
  makeSafeBase64Hash,
  makeTransactionRawContent,
  makeTransactionMessageInfo,
  parseTxHash,
  toDisplayHash,
} from "./transaction.utility";

// The real @gnolang packages transitively pull in ESM (uuid) that jest can't parse,
// so only the pieces decodeTransaction needs are mocked here.
jest.mock("@gnolang/gno-js-client", () => ({ decodeTxMessages: jest.fn() }));
jest.mock("@/common/hooks/common/use-token-meta", () => ({ GNOTToken: { denom: "ugnot" } }));
jest.mock("@gnolang/tm2-js-client", () => ({
  base64ToUint8Array: (b64: string) => Uint8Array.from(Buffer.from(b64, "base64")),
  uint8ArrayToBase64: (bytes: Uint8Array) => Buffer.from(bytes).toString("base64"),
  Tx: { decode: jest.fn() },
}));

const mockedDecodeTxMessages = decodeTxMessages as jest.MockedFunction<typeof decodeTxMessages>;
const mockedTxDecode = Tx.decode as jest.MockedFunction<typeof Tx.decode>;

const PADDED_BASE64_HASH = "lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4=";
const UNPADDED_BASE64_HASH = "lk1sZ7ZgbHo75gEbv1pImpNorTXHe7zBgROekjZpjt4";
const HEX_HASH = "3031323334353637383961626364656630313233343536373839616263646566";

describe("makeTransactionRawContent", () => {
  const GNOLAND1_TX =
    "CoYBCgovdm0ubV9jYWxsEngKKGcxOGRkNW1zdGpxbGNnOW5ncXBnMjZhemV5YTZ3cWc3dXBkOXQ4eGEiQWduby5sYW5kL3IvZzFsZXU4ZDJ2c3BsaGVoY2Zramc1MG13Z2RweGRrdDh0enR1OTV3ci9idWJibGVydW1ibGU0KglIZWFydGJlYXQSEAiAv9YGEgk3MDAwdWdub3QaqAEKOgoTL3RtLlB1YktleVNlY3AyNTZrMRIjCiEDj1rKTtK1tGBXlnzB7slX8zV08lbfuJ7gUEQNLwNEuKkSQPvT3WKlzFRAVN4vTQQDlOzDamees7Yu6xQURX6JKAUYEA0EOlQz7p8B7Q+FSmPl6IVP6l8kIfDdFN3oT9+WMr8aKGcxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxbHV1eGU=";
  const SECP256K1_PUB_KEY = { "@type": "/tm.PubKeySecp256k1", value: "A49ayk7StbRgV5Z8we7JV/M1dPJW37ie4FBEDS8DRLip" };

  const ProtoTx = jest.requireActual("../../../node_modules/@gnolang/tm2-js-client/dist/proto/tm2/tx.cjs")
    .Tx as typeof Tx;
  const fromBytes = (bytes: Uint8Array) => ({
    ...ProtoTx.decode(bytes),
    messages: [],
    hash: makeHash(bytes),
    rawTx: Buffer.from(bytes).toString("base64"),
  });

  it("renders a gnoland1 transaction as indented Go Amino JSON", () => {
    const json = makeTransactionRawContent(fromBytes(Buffer.from(GNOLAND1_TX, "base64")));
    const parsed = JSON.parse(json!);

    expect(parsed.signatures[0].pub_key).toEqual(SECP256K1_PUB_KEY);
    expect(parsed.fee.gas_fee).toBe("7000ugnot");
    expect(json).toBe(JSON.stringify(parsed, null, 2));
  });

  it("renders multisig keys as threshold and nested pubkeys from bytes", () => {
    const codec = gnoCodec();
    const multisig = { "@type": "/tm.PubKeyMultisig", threshold: "2", pubkeys: [SECP256K1_PUB_KEY, SECP256K1_PUB_KEY] };
    const tx = codec.unmarshalJSON(std.Tx, JSON.stringify({ signatures: [{ pub_key: multisig, signature: "AQID" }] }));
    const bytes = codec.marshal(std.Tx, tx);

    expect(JSON.parse(makeTransactionRawContent(fromBytes(bytes))).signatures[0]).toMatchObject({
      pub_key: multisig,
      signature: "AQID",
    });
  });

  it("keeps the legacy JSON and bigint conversion when Amino cannot decode a public key", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    try {
      const bytes = ProtoTx.encode({
        messages: [],
        fee: { gas_wanted: BigInt(7000000), gas_fee: "7000ugnot" },
        signatures: [
          {
            pub_key: { type_url: "/tm.UnknownPubKey", value: new Uint8Array([1, 2]) },
            signature: new Uint8Array([3]),
            session_addr: "",
          },
        ],
        memo: "fallback",
      }).finish();
      expect(JSON.parse(makeTransactionRawContent(fromBytes(bytes)))).toEqual({
        messages: [],
        fee: { gas_wanted: "7000000", gas_fee: "7000ugnot" },
        signatures: [
          {
            pub_key: { type_url: "/tm.UnknownPubKey", value: { "0": 1, "1": 2 } },
            signature: { "0": 3 },
            session_addr: "",
          },
        ],
        memo: "fallback",
      });
    } finally {
      warn.mockRestore();
    }
  });

  it("keeps unsupported message placeholders when Amino cannot decode the message", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    try {
      const bytes = ProtoTx.encode({
        messages: [{ type_url: "/vm.m_unknown", value: new Uint8Array([1, 2]) }],
        signatures: [],
        memo: "",
      }).finish();
      const messages = [{ "@type": "/vm.m_unknown", value: "AQI=", unsupported: true }];
      expect(JSON.parse(makeTransactionRawContent({ ...fromBytes(bytes), messages }))).toEqual({
        messages,
        fee: "",
        signatures: [],
        memo: "",
      });
    } finally {
      warn.mockRestore();
    }
  });

  it("falls back to the decoded fields for malformed bytes", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    try {
      const transaction = { ...fromBytes(new Uint8Array()), rawTx: "/w==", memo: "broken bytes" };
      expect(JSON.parse(makeTransactionRawContent(transaction))).toEqual({
        messages: [],
        fee: "",
        signatures: [],
        memo: "broken bytes",
      });
    } finally {
      warn.mockRestore();
    }
  });
});

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
    mockedTxDecode.mockReturnValue({ messages: [supported, unsupported], fee: undefined, signatures: [], memo: "" });
    mockedDecodeTxMessages.mockImplementation(messages => {
      if (messages[0].type_url !== "/vm.m_call") {
        throw new Error(`unsupported message type ${messages[0].type_url}`);
      }
      return [{ "@type": "/vm.m_call", caller: "g1caller" }];
    });

    const decoded = decodeTransaction(PADDED_BASE64_HASH);

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
    expect(makeTransactionMessageInfo({ "@type": "/vm.m_unknown" })).toBeNull();
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

  it("ignores the URL hash that selects a detail tab", () => {
    expect(parseTxHash(`/transactions/details?txhash=${HEX_HASH}#events`)).toBe(HEX_HASH);
    expect(parseTxHash(`/transactions/details?txhash=${HEX_HASH}&chainId=test#events`)).toBe(HEX_HASH);
  });
});

describe("makeHash", () => {
  it("returns base64 sha256 of the bytes", () => {
    expect(makeHash(new Uint8Array([1, 2, 3]))).toBe("A5BYxvLAy0ksUzsKTRTvd8wPeKvMztUofYShogEc+4E=");
  });

  it("handles empty input", () => {
    expect(makeHash(new Uint8Array([]))).toBe("47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=");
  });
});
