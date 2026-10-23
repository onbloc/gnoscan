import { findDapp, getFunctionRealmLabel, getRunCalledRealms } from "./transaction-list.utility";

describe("getFunctionRealmLabel", () => {
  test("a call shows its package path, from both API and custom network type names", () => {
    expect(getFunctionRealmLabel("/vm.m_call", "gno.land/r/demo/foo")).toEqual({
      kind: "call",
      packagePath: "gno.land/r/demo/foo",
      dapp: undefined,
    });
    expect(getFunctionRealmLabel("MsgCall", "gno.land/r/demo/foo")?.kind).toBe("call");
  });

  test("a deploy shows its package path", () => {
    expect(getFunctionRealmLabel("AddPackage", "gno.land/r/demo/foo")).toEqual({
      kind: "deploy",
      packagePath: "gno.land/r/demo/foo",
    });
  });

  test("a call to a registered dApp carries its logo", () => {
    expect(getFunctionRealmLabel("/vm.m_call", "gno.land/r/gnoswap/gov/governance")).toMatchObject({
      packagePath: "gno.land/r/gnoswap/gov/governance",
      dapp: { name: "GnoSwap" },
    });
    expect(getFunctionRealmLabel("/vm.m_call", "gno.land/r/gnoland/wugnot")).toMatchObject({ dapp: { name: "wGNOT" } });
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
  const gnoswap = { name: "GnoSwap", logo: "gnoswap.svg", url: "https://gnoswap.io" };
  const wugnot = { name: "wGNOT", logo: "wugnot.svg", url: "https://gno.land/r/gnoland/wugnot" };
  const registry = { "r/gnoswap": gnoswap, "r/gnoland/wugnot": wugnot };

  test("matches by namespace", () => {
    expect(findDapp("gno.land/r/gnoswap/v1/router", registry)).toBe(gnoswap);
    expect(findDapp("gno.land/r/gnoswapx/router", registry)).toBeUndefined();
    expect(findDapp("gno.land/p/gnoswap/uint256", registry)).toBeUndefined();
  });

  test("a full realm path key covers only that realm", () => {
    expect(findDapp("gno.land/r/gnoland/wugnot", registry)).toBe(wugnot);
    expect(findDapp("gno.land/r/gnoland/users", registry)).toBeUndefined();
  });
});

describe("getRunCalledRealms", () => {
  const called = (...packagePaths: string[]) => packagePaths.map(packagePath => ({ packagePath, method: "Do" }));

  test("lists the called realms of run messages in call order without repeats", () => {
    expect(
      getRunCalledRealms([
        {
          messageType: "/vm.m_run",
          calledFunctions: called("gno.land/r/sys/validators/v0", "gno.land/r/gov/dao", "gno.land/r/gov/dao"),
        },
        { messageType: "/vm.m_call", calledFunctions: called("gno.land/r/demo/foo") },
      ]),
    ).toEqual(["gno.land/r/sys/validators/v0", "gno.land/r/gov/dao"]);
  });

  test("a run without called realms has none", () => {
    expect(getRunCalledRealms([{ messageType: "/vm.m_run", calledFunctions: null }])).toEqual([]);
    expect(getRunCalledRealms([])).toEqual([]);
  });
});
