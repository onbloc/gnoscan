import { getDefaultMessage, getDefaultMessageByBlockTransaction } from "./utility";
import { WUGNOT_PACKAGE_PATH } from "@/common/values/constant-value";

describe("custom-network transaction list selection", () => {
  it("skips SetApprovalForAll like Approve in both message formats", () => {
    const messages = [
      { value: { func: "SetApprovalForAll", pkg_path: "gno.land/r/gnoswap/gnft" } },
      { value: { func: "StakeToken", pkg_path: "gno.land/r/gnoswap/staker" } },
    ];
    expect(getDefaultMessage(messages).value.func).toBe("StakeToken");
    expect(getDefaultMessageByBlockTransaction(messages.map(message => message.value)).func).toBe("StakeToken");
  });

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

  it("selects the action after approval in both message formats", () => {
    const messages = [
      { value: { func: "Approve", pkg_path: "gno.land/r/demo/token" } },
      { value: { func: "Mint", pkg_path: "gno.land/r/gnoswap/position" } },
    ];
    expect(getDefaultMessage(messages).value.func).toBe("Mint");
    expect(getDefaultMessageByBlockTransaction(messages.map(message => message.value)).func).toBe("Mint");
  });

  it.each(["Deposit", "Withdraw"])("retains wrapped GNOT %s when only approvals surround it", func => {
    const approval = { func: "Approve", pkg_path: "gno.land/r/demo/token" };
    const wrap = { func, pkg_path: WUGNOT_PACKAGE_PATH };
    const decoded = [approval, wrap, approval];
    expect(getDefaultMessage(decoded.map(value => ({ value }))).value).toBe(wrap);
    expect(getDefaultMessageByBlockTransaction(decoded)).toBe(wrap);
  });

  it("skips wrapped GNOT withdrawal before another action in both message formats", () => {
    const withdrawal = { func: "Withdraw", pkg_path: WUGNOT_PACKAGE_PATH };
    const swap = { func: "Swap", pkg_path: "gno.land/r/gnoswap/pool" };
    const decoded = [withdrawal, swap];
    expect(getDefaultMessage(decoded.map(value => ({ value }))).value).toBe(swap);
    expect(getDefaultMessageByBlockTransaction(decoded)).toBe(swap);
  });
});
