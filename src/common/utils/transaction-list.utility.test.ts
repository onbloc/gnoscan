import { findDapp, getFunctionRealmLabel } from "./transaction-list.utility";

describe("getFunctionRealmLabel", () => {
  test("a call shows its package path, from both API and custom network type names", () => {
    expect(getFunctionRealmLabel("/vm.m_call", "gno.land/r/demo/foo")).toEqual({
      kind: "call",
      packagePath: "gno.land/r/demo/foo",
      displayPath: "r/demo/foo",
      dapp: undefined,
    });
    expect(getFunctionRealmLabel("MsgCall", "gno.land/r/demo/foo")?.kind).toBe("call");
  });

  test("a deploy shows its package path", () => {
    expect(getFunctionRealmLabel("AddPackage", "gno.land/r/demo/foo")).toEqual({
      kind: "deploy",
      packagePath: "gno.land/r/demo/foo",
      displayPath: "r/demo/foo",
    });
  });

  test("a registered dApp shows only the realm under its namespace", () => {
    expect(getFunctionRealmLabel("/vm.m_call", "gno.land/r/gnoswap/gov/governance")).toMatchObject({
      displayPath: "gov/governance",
      dapp: { name: "GnoSwap" },
    });
  });

  test("messages without a realm show their kind", () => {
    expect(getFunctionRealmLabel("/bank.MsgSend", "GNOT Transfer")).toEqual({ kind: "text", text: "bank · native" });
    expect(getFunctionRealmLabel("/vm.m_run", "gno.land/r/g1abc/run")).toEqual({ kind: "text", text: "run" });
  });

  test("unknown types and calls without a path have no label", () => {
    expect(getFunctionRealmLabel("/auth.m_create_session", "")).toBeUndefined();
    expect(getFunctionRealmLabel("/vm.m_call", "")).toBeUndefined();
  });
});

describe("findDapp", () => {
  const registry = { "r/gnoswap": { name: "GnoSwap", logo: "gnoswap.svg", url: "https://gnoswap.io" } };

  test("matches by namespace", () => {
    expect(findDapp("gno.land/r/gnoswap/v1/router", registry)?.name).toBe("GnoSwap");
    expect(findDapp("gno.land/r/gnoswapx/router", registry)).toBeUndefined();
    expect(findDapp("gno.land/p/gnoswap/uint256", registry)).toBeUndefined();
  });
});
