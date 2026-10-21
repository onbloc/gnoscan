import { decodeTransaction, makeTransactionMessageInfo } from "./transaction.utility";

// Runs the real @gnolang protobuf decoders against a fixed wire payload, so a change in their
// decoding breaks this test. The package entry points pull in ESM only dependencies (uuid,
// @noble/hashes) that jest can't parse, so the modules holding Tx and decodeTxMessages are loaded
// directly from dist. If a client upgrade moves them, update these paths.
jest.mock("@gnolang/tm2-js-client", () => ({
  Tx: jest.requireActual("../../../node_modules/@gnolang/tm2-js-client/dist/proto/tm2/tx.cjs").Tx,
  base64ToUint8Array: (b64: string) => Uint8Array.from(Buffer.from(b64, "base64")),
  uint8ArrayToBase64: (bytes: Uint8Array) => Buffer.from(bytes).toString("base64"),
}));
jest.mock("@gnolang/gno-js-client", () =>
  jest.requireActual("../../../node_modules/@gnolang/gno-js-client/dist/wallet/utility/utility.cjs"),
);
jest.mock("@/common/hooks/common/use-token-meta", () => ({ GNOTToken: { denom: "ugnot" } }));

// Tx with /vm.m_call, /vm.m_enable_pkg and /vm.m_reject_pkg messages, a 2000000 gas / 1000ugnot fee,
// one signature with session_addr "g1session" and memo "fixture".
const FIXTURE_TX =
  "CjYKCi92bS5tX2NhbGwSKAoIZzFjYWxsZXIiE2duby5sYW5kL3IvZGVtby9mb28qBEJ1bXAyATEKQQoQL3ZtLm1fZW5hYmxlX3BrZxItCgpnMWFwcHJvdmVyEhNnbm8ubGFuZC9yL2RlbW8vZm9vGgZhYmMxMjMggIkPCjMKEC92bS5tX3JlamVjdF9wa2cSHwoIZzFzZW5kZXISE2duby5sYW5kL3IvZGVtby9iYXISEAiAkvQBEgkxMDAwdWdub3QaEBIDAQIDGglnMXNlc3Npb24iB2ZpeHR1cmU=";

describe("decodeTransaction with a real protobuf fixture", () => {
  const decoded = decodeTransaction(FIXTURE_TX);

  it("decodes every message into an amino-style object", () => {
    expect(decoded.messages).toEqual([
      {
        "@type": "/vm.m_call",
        caller: "g1caller",
        send: "",
        max_deposit: "",
        pkg_path: "gno.land/r/demo/foo",
        func: "Bump",
        args: ["1"],
      },
      {
        "@type": "/vm.m_enable_pkg",
        approver: "g1approver",
        pkg_path: "gno.land/r/demo/foo",
        pkg_hash: "abc123",
        pkg_height: "123456",
      },
      { "@type": "/vm.m_reject_pkg", sender: "g1sender", pkg_path: "gno.land/r/demo/bar" },
    ]);
  });

  it("decodes the fee, memo, hash and signature session_addr", () => {
    expect(decoded.fee).toEqual({ gas_wanted: BigInt(2000000), gas_fee: "1000ugnot" });
    expect(decoded.memo).toBe("fixture");
    expect(decoded.hash).toBe("yUtglci4TjHZM7YeY5WKXblW5Lq/8xGkrH8fiNfWq0U=");
    expect(decoded.signatures).toHaveLength(1);
    expect(decoded.signatures[0].session_addr).toBe("g1session");
  });

  it("feeds the package approval messages into makeTransactionMessageInfo", () => {
    expect(makeTransactionMessageInfo(decoded.messages[1])).toMatchObject({
      packagePath: "gno.land/r/demo/foo",
      functionName: "EnablePkg",
      from: "g1approver",
    });
    expect(makeTransactionMessageInfo(decoded.messages[2])).toMatchObject({
      packagePath: "gno.land/r/demo/bar",
      functionName: "RejectPkg",
      from: "g1sender",
    });
  });
});
