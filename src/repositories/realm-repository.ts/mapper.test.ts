import { mapTransactionTypeNameByMessage } from "./mapper";

describe("mapTransactionTypeNameByMessage", () => {
  test("maps each selected message type", () => {
    expect(mapTransactionTypeNameByMessage({ caller: "g1", pkg_path: "gno.land/r/demo/foo" })).toBe("MsgCall");
    expect(mapTransactionTypeNameByMessage({ creator: "g1", package: { path: "gno.land/r/demo/foo" } })).toBe(
      "AddPackage",
    );
    expect(mapTransactionTypeNameByMessage({ caller: "g1", package: { path: "gno.land/r/g1/run" } })).toBe("MsgRun");
    expect(mapTransactionTypeNameByMessage({ from_address: "g1", to_address: "g2", amount: "1ugnot" })).toBe(
      "BankMsgSend",
    );
  });

  test("a message without known fields is not taken for a transfer", () => {
    expect(mapTransactionTypeNameByMessage({})).toBe("Unknown");
    expect(mapTransactionTypeNameByMessage(undefined)).toBe("Unknown");
  });
});
