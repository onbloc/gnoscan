import {
  buildTokenResourceDapps,
  findDapp,
  getFunctionRealmLabel,
  getRunCalledRealms,
} from "./transaction-list.utility";

const entry = (pkgPath: string | undefined, name: string, websiteUrl = "https://example.com") => ({
  pkg_path: pkgPath,
  name,
  image: `/grc20/images/${name}.svg`,
  website_url: websiteUrl,
});

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

  test("a dApp comes from gno-token-resource first, then dapps.json, and is left out when neither has it", () => {
    const dapps = buildTokenResourceDapps([entry("gno.land/r/gnoswap/gns", "GnoSwap")]);

    expect(getFunctionRealmLabel("/vm.m_call", "gno.land/r/gnoswap/gov/governance", dapps)).toMatchObject({
      packagePath: "gno.land/r/gnoswap/gov/governance",
      dapp: { name: "GnoSwap" },
    });
    expect(getFunctionRealmLabel("/vm.m_call", "gno.land/r/gnoland/wugnot", dapps)).toMatchObject({
      dapp: { name: "wGNOT" },
    });
    expect(getFunctionRealmLabel("/vm.m_call", "gno.land/r/nobody/app", dapps)).toMatchObject({ dapp: undefined });
  });

  test("gno-token-resource wins over dapps.json for the same key", () => {
    const dapps = { "r/akkadia": { name: "From token resource", logo: "a.svg" } };
    expect(getFunctionRealmLabel("/vm.m_call", "gno.land/r/akkadia/beta/abt", dapps)).toMatchObject({
      dapp: { name: "From token resource" },
    });
  });

  test("a dapps.json realm key wins over the gno-token-resource namespace it sits in", () => {
    const dapps = buildTokenResourceDapps([
      entry("gno.land/r/g1leu8d2vsplhehcfkjg50mwgdpxdkt8tztu95wr/wbubble", "BUBBLE (wrapped)"),
    ]);
    const label = (path: string) => getFunctionRealmLabel("/vm.m_call", path, dapps);

    expect(label("gno.land/r/g1leu8d2vsplhehcfkjg50mwgdpxdkt8tztu95wr/kourtv3")).toMatchObject({
      dapp: { name: "Kourt" },
    });
    expect(label("gno.land/r/g1leu8d2vsplhehcfkjg50mwgdpxdkt8tztu95wr/bubblerumble5")).toMatchObject({
      dapp: { name: "BUBBLE (wrapped)" },
    });
  });

  test("only dapps.json applies before the gno-token-resource lists load", () => {
    expect(getFunctionRealmLabel("/vm.m_call", "gno.land/r/demo/wugnot")).toMatchObject({ dapp: { name: "wGNOT" } });
    expect(getFunctionRealmLabel("/vm.m_call", "gno.land/r/gnoswap/v1/router")).toMatchObject({ dapp: undefined });
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

describe("buildTokenResourceDapps", () => {
  test("keys an entry by its namespace with its name, image and website", () => {
    const dapps = buildTokenResourceDapps([entry("gno.land/r/gnoswap/gns", "GnoSwap", "https://gnoswap.io")]);

    expect(dapps).toEqual({
      "r/gnoswap": {
        name: "GnoSwap",
        logo: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/GnoSwap.svg",
        url: "https://gnoswap.io",
      },
    });
    expect(findDapp("gno.land/r/gnoswap/v1/router", dapps)?.name).toBe("GnoSwap");
  });

  test("a namespace takes its shortest path, then the first one listed", () => {
    // Listed as on staging, where test tokens come before GNS.
    const staging = buildTokenResourceDapps([
      entry("gno.land/r/gnoswap/test_token/foo", "Foo"),
      entry("gno.land/r/gnoswap/gns", "GnoSwap"),
    ]);
    // A GRC721 collection listed after the token at the same depth.
    const mainnet = buildTokenResourceDapps([
      entry("gno.land/r/gnoswap/gns", "GnoSwap"),
      entry("gno.land/r/gnoswap/gnft", "GNOSWAP NFT"),
    ]);

    expect(staging["r/gnoswap"].name).toBe("GnoSwap");
    expect(mainnet["r/gnoswap"].name).toBe("GnoSwap");
  });

  test("an address namespace is a dApp namespace", () => {
    const dapps = buildTokenResourceDapps([entry("gno.land/r/g1leu8/wbubble", "BUBBLE (wrapped)")]);
    expect(Object.keys(dapps)).toEqual(["r/g1leu8"]);
  });

  test("skips shared namespaces and entries without a path or image", () => {
    const dapps = buildTokenResourceDapps([
      entry("gno.land/r/gnoland/wugnot", "wGNOT"),
      entry("gno.land/r/demo/defi/grc20factory", "Perun"),
      entry("gno.land/r/sys/names", "Names"),
      entry(undefined, "GNOT"),
      { ...entry("gno.land/r/noimage/token", "No image"), image: "" },
    ]);
    expect(dapps).toEqual({});
  });

  test("an entry without a website has no url", () => {
    const dapps = buildTokenResourceDapps([entry("gno.land/r/nosite/token", "No site", "")]);
    expect(dapps["r/nosite"].url).toBeUndefined();
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
    expect(getRunCalledRealms([{ messageType: "/vm.m_run", calledFunctions: [] }])).toEqual([]);
    expect(getRunCalledRealms([])).toEqual([]);
  });
});
