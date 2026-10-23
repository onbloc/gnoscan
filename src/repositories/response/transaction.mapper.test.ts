import { getFunctionRealmLabel } from "@/common/utils/transaction-list.utility";
import { mapVMTransaction } from "./transaction.mapper";
import { AddPackageValue, TransactionWithEvent } from "./transaction.types";

jest.mock("@/common/hooks/common/use-token-meta", () => ({ GNOTToken: { denom: "ugnot" } }));

describe("mapVMTransaction", () => {
  test("a deploy row gets the deploy label", () => {
    const tx = {
      hash: "hash",
      success: true,
      block_height: 1,
      gas_used: 1,
      gas_fee: { amount: 1, denom: "ugnot" },
      messages: [{ value: { creator: "g1", package: { name: "foo", path: "gno.land/r/demo/foo" } } }],
    } as unknown as TransactionWithEvent<AddPackageValue>;

    const row = mapVMTransaction(tx);
    expect(getFunctionRealmLabel(row.type, row.packagePath ?? "")).toEqual({
      kind: "deploy",
      packagePath: "gno.land/r/demo/foo",
    });
  });
});
