import { BlockMapper } from "./block-mapper";
import { TransactionTableModel } from "@/models/api/common";
import { WUGNOT_PACKAGE_PATH } from "@/common/values/constant-value";

const call = (funcType: string, pkgPath: string) => ({ messageType: "/vm.m_call", funcType, pkgPath });

function transaction(func: TransactionTableModel["func"]): TransactionTableModel {
  return {
    txHash: "tx",
    blockHeight: 1,
    timestamp: "2026-09-23T00:00:00Z",
    successYn: true,
    messageCount: func.length,
    fromAddress: "g1caller",
    fromName: "",
    toAddress: "",
    toName: "",
    amount: { value: "0", denom: "ugnot" },
    fee: { value: "1", denom: "ugnot" },
    func,
  };
}

describe("transaction list representative function", () => {
  it("shows the action after approvals and a wrapped GNOT deposit without changing message order", () => {
    const functions = [
      call("Approve", "gno.land/r/demo/token"),
      call("Deposit", WUGNOT_PACKAGE_PATH),
      call("Swap", "gno.land/r/gnoswap/pool"),
    ];
    const input = transaction(functions);
    const original = [...functions];
    const result = BlockMapper.blockTransactionsFromApiResponse(input);
    expect(result.functionName).toBe("Swap");
    expect(result.packagePath).toBe("gno.land/r/gnoswap/pool");
    expect(result.numOfMessage).toBe(3);
    expect(input.func).toEqual(original);
  });

  it("does not skip a deposit in another realm", () => {
    const result = BlockMapper.blockTransactionsFromApiResponse(
      transaction([call("Deposit", "gno.land/r/demo/vault"), call("Swap", "gno.land/r/gnoswap/pool")]),
    );
    expect(result.functionName).toBe("Deposit");
    expect(result.packagePath).toBe("gno.land/r/demo/vault");
  });

  it("keeps the first function when every message is preparatory", () => {
    const result = BlockMapper.blockTransactionsFromApiResponse(
      transaction([call("Deposit", WUGNOT_PACKAGE_PATH), call("Approve", "gno.land/r/demo/token")]),
    );
    expect(result.functionName).toBe("Deposit");
  });
});
