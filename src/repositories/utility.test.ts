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
    expect(getDefaultMessage(messages, true).value.func).toBe("Mint");
    expect(messages).toEqual(original);

    const decoded = messages.map(message => message.value);
    const originalDecoded = [...decoded];
    expect(getDefaultMessageByBlockTransaction(decoded, true).func).toBe("Mint");
    expect(decoded).toEqual(originalDecoded);
  });

  it("retains standalone preparation and the first message of preparation-only transactions", () => {
    const deposit = { func: "Deposit", pkg_path: WUGNOT_PACKAGE_PATH };
    const approval = { func: "Approve", pkg_path: "gno.land/r/demo/token" };
    expect(getDefaultMessageByBlockTransaction([deposit], true)).toBe(deposit);
    expect(getDefaultMessageByBlockTransaction([approval], true)).toBe(approval);
    expect(getDefaultMessageByBlockTransaction([deposit, approval], true)).toBe(deposit);
  });

  it("keeps the first message for failed indexed and decoded transactions", () => {
    const messages = [
      { value: { func: "Approve", pkg_path: "gno.land/r/demo/token" } },
      { value: { func: "Mint", pkg_path: "gno.land/r/gnoswap/position" } },
    ];
    expect(getDefaultMessage(messages, false).value.func).toBe("Approve");
    expect(
      getDefaultMessageByBlockTransaction(
        messages.map(message => message.value),
        false,
      ).func,
    ).toBe("Approve");
  });

  it.each(["Deposit", "Withdraw"])("retains wrapped GNOT %s when only approvals surround it", func => {
    const approval = { func: "Approve", pkg_path: "gno.land/r/demo/token" };
    const wrap = { func, pkg_path: WUGNOT_PACKAGE_PATH };
    const decoded = [approval, wrap, approval];
    expect(
      getDefaultMessage(
        decoded.map(value => ({ value })),
        true,
      ).value,
    ).toBe(wrap);
    expect(getDefaultMessageByBlockTransaction(decoded, true)).toBe(wrap);
  });

  it("skips wrapped GNOT withdrawal before another action in both message formats", () => {
    const withdrawal = { func: "Withdraw", pkg_path: WUGNOT_PACKAGE_PATH };
    const swap = { func: "Swap", pkg_path: "gno.land/r/gnoswap/pool" };
    const decoded = [withdrawal, swap];
    expect(
      getDefaultMessage(
        decoded.map(value => ({ value })),
        true,
      ).value,
    ).toBe(swap);
    expect(getDefaultMessageByBlockTransaction(decoded, true)).toBe(swap);
  });
});
