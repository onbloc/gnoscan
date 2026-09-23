import { getDefaultMessage, getDefaultMessageByBlockTransaction } from "./utility";
import { WUGNOT_PACKAGE_PATH } from "@/common/values/constant-value";

describe("custom-network transaction list selection", () => {
  it("skips preparation without reordering the messages used in transaction details", () => {
    const messages = [
      { value: { func: "Approve", pkg_path: "gno.land/r/demo/token" } },
      { value: { func: "Deposit", pkg_path: WUGNOT_PACKAGE_PATH } },
      { value: { func: "Mint", pkg_path: "gno.land/r/gnoswap/position" } },
    ];
    const original = [...messages];
    expect(getDefaultMessage(messages).value.func).toBe("Mint");
    expect(messages).toEqual(original);

    const decoded = messages.map(message => message.value);
    const originalDecoded = [...decoded];
    expect(getDefaultMessageByBlockTransaction(decoded).func).toBe("Mint");
    expect(decoded).toEqual(originalDecoded);
  });

  it("retains standalone preparation and the first message of preparation-only transactions", () => {
    const deposit = { func: "Deposit", pkg_path: WUGNOT_PACKAGE_PATH };
    const approval = { func: "Approve", pkg_path: "gno.land/r/demo/token" };
    expect(getDefaultMessageByBlockTransaction([deposit])).toBe(deposit);
    expect(getDefaultMessageByBlockTransaction([approval])).toBe(approval);
    expect(getDefaultMessageByBlockTransaction([deposit, approval])).toBe(deposit);
  });
});
