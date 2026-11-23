import { gnoCodec, std } from "@gnolang/amino-ts/gno";
import { base64ToUint8Array, uint8ArrayToBase64 } from "@gnolang/tm2-js-client";
import { tryOrDefault } from "./common.utility";
import type { DecodedTransaction } from "./transaction.utility";

// Kept out of transaction.utility so pages that only need hash helpers don't bundle amino-ts.
let aminoCodec: ReturnType<typeof gnoCodec> | undefined;

function toAminoJSON(rawTx: string): string | undefined {
  return tryOrDefault(() => {
    aminoCodec ??= gnoCodec();
    const json = aminoCodec.marshalJSON(std.Tx, aminoCodec.unmarshal(std.Tx, base64ToUint8Array(rawTx)));
    return JSON.stringify(JSON.parse(json), null, 2);
  }, undefined);
}

export function makeTransactionRawContent(transaction: DecodedTransaction): string {
  return (
    toAminoJSON(transaction.rawTx) ??
    JSON.stringify(
      {
        // Same key as the Amino JSON output.
        msg: transaction.messages,
        fee: transaction.fee ?? "",
        signatures: transaction.signatures,
        memo: transaction.memo,
      },
      // BigInt is not serializable by default and bytes read better as base64, as in Amino JSON.
      (_key, value) => {
        if (typeof value === "bigint") return value.toString();
        if (value instanceof Uint8Array) return uint8ArrayToBase64(value);
        return value;
      },
      2,
    )
  );
}
