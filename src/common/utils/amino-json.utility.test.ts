import { gnoCodec, std } from "@gnolang/amino-ts/gno";
import { Tx } from "@gnolang/tm2-js-client";
import { GNOLAND1_TX, GNOLAND1_TX_PUB_KEY } from "./__fixtures__/gnoland1-tx";
import { makeTransactionRawContent } from "./amino-json.utility";

// The real tm2-js-client entry pulls in ESM (uuid) that jest can't parse.
jest.mock("@gnolang/tm2-js-client", () => ({
  base64ToUint8Array: (b64: string) => Uint8Array.from(Buffer.from(b64, "base64")),
  uint8ArrayToBase64: (bytes: Uint8Array) => Buffer.from(bytes).toString("base64"),
}));

const ProtoTx = jest.requireActual("../../../node_modules/@gnolang/tm2-js-client/dist/proto/tm2/tx.cjs")
  .Tx as typeof Tx;

const fromBytes = (bytes: Uint8Array) => ({
  ...ProtoTx.decode(bytes),
  messages: [],
  hash: "",
  rawTx: Buffer.from(bytes).toString("base64"),
});

describe("makeTransactionRawContent", () => {
  let warn: jest.SpyInstance;
  beforeEach(() => {
    warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
  });
  afterEach(() => warn.mockRestore());

  it("renders a gnoland1 transaction as indented Go Amino JSON", () => {
    const json = makeTransactionRawContent(fromBytes(Buffer.from(GNOLAND1_TX, "base64")));
    const parsed = JSON.parse(json);

    expect(parsed.signatures[0].pub_key).toEqual(GNOLAND1_TX_PUB_KEY);
    expect(parsed.fee.gas_fee).toBe("7000ugnot");
    expect(json).toBe(JSON.stringify(parsed, null, 2));
  });

  it("renders multisig keys as threshold and nested pubkeys", () => {
    const codec = gnoCodec();
    const multisig = {
      "@type": "/tm.PubKeyMultisig",
      threshold: "2",
      pubkeys: [GNOLAND1_TX_PUB_KEY, GNOLAND1_TX_PUB_KEY],
    };
    const tx = codec.unmarshalJSON(std.Tx, JSON.stringify({ signatures: [{ pub_key: multisig, signature: "AQID" }] }));
    const bytes = codec.marshal(std.Tx, tx);

    expect(JSON.parse(makeTransactionRawContent(fromBytes(bytes))).signatures[0]).toMatchObject({
      pub_key: multisig,
      signature: "AQID",
    });
  });

  it("falls back to the decoded fields with base64 bytes when Amino cannot decode a public key", () => {
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
      msg: [],
      fee: { gas_wanted: "7000000", gas_fee: "7000ugnot" },
      signatures: [
        {
          pub_key: { type_url: "/tm.UnknownPubKey", value: "AQI=" },
          signature: "Aw==",
          session_addr: "",
        },
      ],
      memo: "fallback",
    });
  });

  it("keeps unsupported message placeholders when Amino cannot decode the message", () => {
    const bytes = ProtoTx.encode({
      messages: [{ type_url: "/vm.m_unknown", value: new Uint8Array([1, 2]) }],
      signatures: [],
      memo: "",
    }).finish();
    const messages = [{ "@type": "/vm.m_unknown", value: "AQI=", unsupported: true }];

    expect(JSON.parse(makeTransactionRawContent({ ...fromBytes(bytes), messages }))).toEqual({
      msg: messages,
      fee: "",
      signatures: [],
      memo: "",
    });
  });

  it("falls back to the decoded fields for malformed bytes", () => {
    const transaction = { ...fromBytes(new Uint8Array()), rawTx: "/w==", memo: "broken bytes" };

    expect(JSON.parse(makeTransactionRawContent(transaction))).toEqual({
      msg: [],
      fee: "",
      signatures: [],
      memo: "broken bytes",
    });
  });
});
