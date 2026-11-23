/** @jest-environment jsdom */
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Tx, uint8ArrayToBase64 } from "@gnolang/tm2-js-client";
import { useGetTransactionBlockHeightQuery } from "@/common/react-query/transaction";
import { makeHash, makeTransactionAminoJSON } from "@/common/utils/transaction.utility";
import { useTransaction } from "./use-transaction";

jest.mock("@gnolang/tm2-js-client", () => {
  const { TextEncoder, TextDecoder } = jest.requireActual("util");
  Object.assign(globalThis, { TextEncoder, TextDecoder });
  return {
    Tx: jest.requireActual("../../../../node_modules/@gnolang/tm2-js-client/dist/proto/tm2/tx.cjs").Tx,
    base64ToUint8Array: (value: string) => Uint8Array.from(Buffer.from(value, "base64")),
    uint8ArrayToBase64: (value: Uint8Array) => Buffer.from(value).toString("base64"),
  };
});
jest.mock("@gnolang/gno-js-client", () =>
  jest.requireActual("../../../../node_modules/@gnolang/gno-js-client/dist/wallet/utility/utility.cjs"),
);
jest.mock("@/common/react-query/transaction", () => ({ useGetTransactionBlockHeightQuery: jest.fn() }));
jest.mock("../common/use-token-meta", () => ({
  GNOTToken: { denom: "ugnot" },
  useTokenMeta: () => ({ getTokenAmount: (_denom: string, value: string) => value }),
}));

it("keeps the legacy rawContent when Amino cannot decode a public key", () => {
  const bytes = Tx.encode({
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
  const rawTx = uint8ArrayToBase64(bytes);
  const hash = makeHash(bytes);
  jest.mocked(useGetTransactionBlockHeightQuery).mockReturnValue({
    data: {
      block: {
        block_meta: { header: { time: "2026-01-01T00:00:00Z" } },
        block: { header: { chain_id: "gnoland1", height: "1" }, data: { txs: [rawTx] } },
      },
      blockResult: { deliver_tx: [{ ResponseBase: {}, GasWanted: "7000000", GasUsed: "1" }] },
    },
    isFetched: true,
    isError: false,
  } as unknown as ReturnType<typeof useGetTransactionBlockHeightQuery>);

  let rawContent: string | undefined;
  const Probe = () => {
    rawContent = useTransaction(hash).transaction.transactionItem?.rawContent;
    return null;
  };
  const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  const root = createRoot(document.createElement("div"));
  try {
    expect(makeTransactionAminoJSON(rawTx)).toBeUndefined();
    act(() => root.render(<Probe />));
    expect(JSON.parse(rawContent!)).toEqual({
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
    act(() => root.unmount());
    warn.mockRestore();
  }
});
