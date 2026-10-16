import type { NodeClient, NodeResponseABCIQuery } from "./types";
import { requestNftTokenUri } from "./nft-artwork";
import { stringToBase64 } from "./utility";

const PACKAGE = "gno.land/r/test/nft";
const TOKEN = "218";
type ArtworkClient = Pick<NodeClient, "abciQuery" | "abciQueryVMQueryFuncs">;

function response(text: string, error: unknown = null): NodeResponseABCIQuery {
  return {
    response: { ResponseBase: { Error: error, Data: stringToBase64(text) } },
  } as NodeResponseABCIQuery;
}

function clientFor(text: string, error: unknown = null, funcs = "[]"): ArtworkClient {
  return {
    abciQuery: jest.fn().mockResolvedValue(response(text, error)),
    abciQueryVMQueryFuncs: jest.fn().mockResolvedValue(response(funcs)),
  };
}

async function lookupUri(uri: string) {
  return requestNftTokenUri(clientFor(`(${JSON.stringify(uri)} string)`), PACKAGE, TOKEN);
}

const unavailable = { tokenId: TOKEN, uri: "", status: "unavailable", needsRefetch: true };
const invalidInline = { tokenId: TOKEN, uri: "", status: "found", needsRefetch: true };

// Contract fixtures mirror onbloc-api-v3 pkg/client/grc721{,_inline}_test.go
// at f428a02454a8013aa0e3f6bc527ece2268eb9dd6, projected to the listing model.
describe("requestNftTokenUri", () => {
  it.each([
    '("ipfs://token/1" string)',
    '("ipfs://token/1" string)\n(undefined)',
    '("ipfs://token/1" string)\n(undefined error)',
  ])("accepts single and nil-error URI returns: %s", async evalText => {
    expect(await requestNftTokenUri(clientFor(evalText), PACKAGE, TOKEN)).toEqual({
      tokenId: TOKEN,
      uri: "ipfs://token/1",
      status: "found",
      needsRefetch: false,
    });
  });

  it.each([
    "https://example.com/image.png",
    "data:image/svg+xml;base64,AAAA",
    "data:text/plain,{}",
    "data:application/jsonp,{}",
  ])("does not fetch or rewrite non-JSON URI %s", async uri => {
    expect(await lookupUri(uri)).toEqual({ tokenId: TOKEN, uri, status: "found", needsRefetch: false });
  });

  it.each([
    '("" string)',
    "( string)",
    '("" string)\n(undefined)',
    '("" string)\n(&(struct{("token has no uri" string)} errors.errorString) *errors.errorString)',
    '("ipfs://ignored" string)\n(&(struct{("business error" string)} errors.errorString) *errors.errorString)',
  ])("classifies empty/business-error returns as not_set: %s", async evalText => {
    expect(await requestNftTokenUri(clientFor(evalText), PACKAGE, TOKEN)).toEqual({
      tokenId: TOKEN,
      uri: "",
      status: "not_set",
      needsRefetch: false,
    });
  });

  it("unquotes Go escapes, quoted parentheses and backslash parity", async () => {
    const evalText = String.raw`("https://example.com/(a)\"/\\/\a\b\f\n\r\t\v/\x41\101\u00e9\U0001F680" string)`;
    expect(await requestNftTokenUri(clientFor(evalText), PACKAGE, TOKEN)).toEqual({
      tokenId: TOKEN,
      uri: 'https://example.com/(a)"/\\/\x07\b\f\n\r\t\x0b/AAé🚀',
      status: "found",
      needsRefetch: false,
    });
    expect(
      await requestNftTokenUri(clientFor(String.raw`("ipfs://ends-in-backslash\\" string)`), PACKAGE, TOKEN),
    ).toMatchObject({
      uri: "ipfs://ends-in-backslash\\",
      status: "found",
      needsRefetch: false,
    });
  });

  it.each([
    "",
    "garbage",
    '("ipfs://x" string',
    '("ipfs://x" string))',
    '("ipfs://x" string) trailing',
    '("ipfs://x" string)\n(undefined)\n(true bool)',
    '("ipfs://x string)',
    '("ipfs://x" string)\n(',
    "()",
    "(123 int)",
    '("x" int)',
    '("line\nbreak" string)',
    String.raw`("\q" string)`,
    '("\\x0" string)',
    String.raw`("\400" string)`,
    String.raw`("\uD800" string)`,
    String.raw`("\U00110000" string)`,
    '("x" string)\n(&(struct{("bad" string)} error]',
  ])("does not complete/cache malformed eval %s", async evalText => {
    expect(await requestNftTokenUri(clientFor(evalText), PACKAGE, TOKEN)).toEqual(unavailable);
  });

  it.each(['1"); panic("injected") //', '\\"\n\x00\t', "引号🚀", ") (undefined)"])(
    "keeps untrusted token ID inside a single Go string: %s",
    async tokenId => {
      let expression = "";
      const client = clientFor('("unused" string)');
      client.abciQuery = async (path, data) => {
        expect(path).toBe("vm/qeval");
        expression = Buffer.from(data, "base64").toString("utf8");
        return response('("unused" string)');
      };
      const result = await requestNftTokenUri(client, PACKAGE, tokenId);
      expect(result.tokenId).toBe(tokenId);
      const prefix = `${PACKAGE}.TokenURI(`;
      expect(expression.startsWith(prefix)).toBe(true);
      expect(expression.endsWith(")")).toBe(true);
      // The entire argument must parse as exactly one quoted string, including
      // malicious quotes, control characters and expression punctuation.
      expect(JSON.parse(expression.slice(prefix.length, -1))).toBe(tokenId);
    },
  );

  it("rejects executable package expressions without contacting the node", async () => {
    const client = clientFor('("unused" string)');
    await expect(requestNftTokenUri(client, `${PACKAGE}.func(){panic("x")}()`, TOKEN)).rejects.toThrow(
      "Invalid NFT package path",
    );
    expect(client.abciQuery).not.toHaveBeenCalled();
  });

  it("distinguishes invalid packages from unsupported methods", async () => {
    const client = clientFor("", { "@type": "/vm.InvalidPkgPathError" });
    await expect(requestNftTokenUri(client, PACKAGE, TOKEN)).rejects.toThrow("Invalid NFT package path");
    expect(client.abciQueryVMQueryFuncs).not.toHaveBeenCalled();
  });

  it("requires successful qfuncs confirmation before returning unsupported", async () => {
    const client = clientFor(
      "",
      { "@type": "/abci.StringError", value: "realm:0:0: name TokenURI not declared" },
      '[{"FuncName":"BalanceOf"}]',
    );
    expect(await requestNftTokenUri(client, PACKAGE, TOKEN)).toEqual({
      tokenId: TOKEN,
      uri: "",
      status: "unsupported",
      needsRefetch: false,
    });
    expect(client.abciQueryVMQueryFuncs).toHaveBeenCalledWith(PACKAGE);
  });

  it.each(['[{"FuncName":"TokenURI"}]', "not JSON", "null", "{}", '[{"FuncName":42}]'])(
    "does not blacklist a realm on failed/contradictory confirmation %s",
    async funcs => {
      const client = clientFor("", { "@type": "/abci.StringError", value: "panic: name TokenURI not declared" }, funcs);
      expect(await requestNftTokenUri(client, PACKAGE, TOKEN)).toEqual(unavailable);
    },
  );

  it.each([
    { "@type": "/abci.StringError", value: "col: unknown item" },
    { "@type": "/abci.StringError", value: "panic: dependency not declared" },
    { "@type": "/some.OtherError", value: "name TokenURI not declared" },
    "name TokenURI not declared",
  ])("keeps VM failures unavailable, not not_set/unsupported", async error => {
    const client = clientFor("", error);
    expect(await requestNftTokenUri(client, PACKAGE, TOKEN)).toEqual(unavailable);
    expect(client.abciQueryVMQueryFuncs).not.toHaveBeenCalled();
  });

  it("isolates transport and confirmation failures without a retry loop", async () => {
    const client = clientFor("", { "@type": "/abci.StringError", value: "name TokenURI not declared" });
    client.abciQueryVMQueryFuncs = jest.fn().mockRejectedValue(new Error("offline"));
    expect(await requestNftTokenUri(client, PACKAGE, TOKEN)).toEqual(unavailable);
    expect(client.abciQuery).toHaveBeenCalledTimes(1);
    expect(client.abciQueryVMQueryFuncs).toHaveBeenCalledTimes(1);
    client.abciQuery = jest.fn().mockRejectedValue(new Error("offline"));
    expect(await requestNftTokenUri(client, PACKAGE, TOKEN)).toEqual(unavailable);
    expect(client.abciQuery).toHaveBeenCalledTimes(1);
  });

  it("rejects oversized encoded RPC data before parsing it", async () => {
    const client = clientFor("");
    const oversized = response("");
    oversized.response.ResponseBase.Data = "A".repeat(1024 * 1024 + 1);
    client.abciQuery = async () => oversized;
    expect(await requestNftTokenUri(client, PACKAGE, TOKEN)).toEqual(unavailable);
  });

  it("accepts encoded RPC data exactly at the allocation boundary", async () => {
    const text = '("ipfs://boundary" string)';
    const client = clientFor(text + " ".repeat((3 * 1024 * 1024) / 4 - text.length));
    expect(await requestNftTokenUri(client, PACKAGE, TOKEN)).toEqual({
      tokenId: TOKEN,
      uri: "ipfs://boundary",
      status: "found",
      needsRefetch: false,
    });
  });

  it.each(["%%%", "e30", "e31=", stringToBase64("not eval"), "/w=="])(
    "rejects malformed/corrupt RPC data %s",
    async data => {
      const client = clientFor("");
      const malformed = response("");
      malformed.response.ResponseBase.Data = data;
      client.abciQuery = async () => malformed;
      expect(await requestNftTokenUri(client, PACKAGE, TOKEN)).toEqual(unavailable);
    },
  );
});

describe("inline TokenURI card projection", () => {
  const payload =
    '{"image":"ipfs://image+A+B","name":"Bazaar","image_data":"<svg>+</svg>","attributes":[{"display_type":"number","trait_type":"large","value":9007199254740993123456789},{"value":1.234567890123456789},{"value":true},{"value":false},{"value":null},{"value":"A+B"},{"value":1e100}]}';

  it.each([
    `data:application/json,${payload}`,
    `data:application/json;charset=utf-8,${encodeURIComponent(payload)}`,
    `data:application/json;base64,${stringToBase64(payload)}`,
    `DATA:APPLICATION/JSON;CHARSET=UTF-8;BASE64,${encodeURIComponent(stringToBase64(payload))}`,
    `data:application/json;base64,${stringToBase64(payload).replace(/.{40}/g, "$&\r\n")}`,
  ])("extracts image and validates scalar attributes without fetching metadata", async uri => {
    expect(await lookupUri(uri)).toEqual({
      tokenId: TOKEN,
      uri: "",
      image: "ipfs://image+A+B",
      status: "found",
      needsRefetch: false,
    });
  });

  it("preserves literal plus signs in base64 and percent-decoded JSON", async () => {
    const data = '{"image":"https://example.com/\uffff+A+B"}';
    expect(stringToBase64(data)).toContain("+");
    expect(await lookupUri(`data:application/json;base64,${stringToBase64(data)}`)).toMatchObject({
      image: "https://example.com/\uffff+A+B",
      needsRefetch: false,
    });
    expect(await lookupUri("data:application/json,%7B%22image%22:%22A+B%22%7D")).toMatchObject({ image: "A+B" });
  });

  it.each([
    "{}",
    '{"image":null,"attributes":null}',
    '{"image":"","attributes":[]}',
    '{"IMAGE":"ipfs://upper"}',
    '{"image":"ipfs://x","unknown":{"nested":[1,2]}}',
  ])("accepts missing/null fields and ignores unknown fields %s", async json => {
    const result = await lookupUri(`data:application/json,${json}`);
    expect(result.uri).toBe("");
    expect(result.status).toBe("found");
    expect(result.needsRefetch).toBe(false);
  });

  it.each([
    "data:application/json",
    "data:application/json,",
    "data:application/json,%",
    "data:application/json,%GG",
    "data:application/json;base64,%%%",
    "data:application/json;base64,e30",
    "data:application/json;base64,e31=",
    "data:application/json;charset=latin1,{}",
    "data:application/json;unknown,{}",
    "data:application/json;base64;base64,e30=",
    "data:application/json;charset=utf-8;charset=utf-8,{}",
    "data:application/json;base64;charset=utf-8,e30=",
    "data:application/json,[]",
    "data:application/json,null",
    "data:application/json,42",
    "data:application/json,{}{}",
    "data:application/json,{",
    'data:application/json,{"image":"ipfs://discard","name":42}',
    'data:application/json,{"image":"ipfs://discard","attributes":{}}',
    'data:application/json,{"attributes":[null]}',
    'data:application/json,{"attributes":[1]}',
    'data:application/json,{"attributes":[{"value":[]}]}',
    'data:application/json,{"attributes":[{"value":{}}]}',
    'data:application/json,{"attributes":[{"trait_type":true}]}',
    "data:application/json,%7B%22image%22:%22%FF%22%7D",
    "data:application/json,%EF%BB%BF%7B%7D",
  ])("marks found URI/incomplete metadata, never raw JSON as image: %s", async uri => {
    expect(await lookupUri(uri)).toEqual(invalidInline);
  });

  it.each([
    "image",
    "image_data",
    "external_url",
    "description",
    "name",
    "background_color",
    "animation_url",
    "youtube_url",
  ])("validates all backend scalar fields, including %s", async field => {
    expect(
      await lookupUri(`data:application/json,${JSON.stringify({ image: "ipfs://discard", [field]: 123 })}`),
    ).toEqual(invalidInline);
  });

  it("rejects invalid UTF-8 bytes from Go byte escapes as inline failure", async () => {
    expect(
      await requestNftTokenUri(
        clientFor(String.raw`("data:application/json,{\"image\":\"\xff\"}" string)`),
        PACKAGE,
        TOKEN,
      ),
    ).toEqual(invalidInline);
  });

  it("matches Go duplicate-field validation and null-string semantics", async () => {
    expect(await lookupUri('data:application/json,{"image":123,"image":"ipfs://cannot-hide-invalid"}')).toEqual(
      invalidInline,
    );
    expect(await lookupUri('data:application/json,{"image":"ipfs://retained","image":null}')).toMatchObject({
      image: "ipfs://retained",
      needsRefetch: false,
    });
    expect(
      await lookupUri('data:application/json,{"image":"ipfs://discard","attributes":[{"value":{},"value":1}]}'),
    ).toEqual(invalidInline);
  });

  it("accepts large JSON numbers without lossy number coercion or nested-field confusion", async () => {
    const json =
      '{"image":"ipfs://punctuation/[]{}:,","attributes":[{"value":1e1000},{"value":9007199254740993123456789}],"unknown":{"image":123}}';
    expect(await lookupUri(`data:application/json,${json}`)).toEqual({
      tokenId: TOKEN,
      uri: "",
      image: "ipfs://punctuation/[]{}:,",
      status: "found",
      needsRefetch: false,
    });
  });

  it.each(["raw", "percent", "base64"])("applies the exact 64KiB UTF-8 boundary to %s encoding", async encoding => {
    for (const extra of [0, 1]) {
      const json =
        '{"image":"ipfs://boundary","name":"' +
        "x".repeat(65536 - '{"image":"ipfs://boundary","name":""}'.length + extra) +
        '"}';
      const uri =
        encoding === "base64"
          ? `data:application/json;base64,${stringToBase64(json)}`
          : `data:application/json,${encoding === "percent" ? encodeURIComponent(json) : json}`;
      expect(await lookupUri(uri)).toEqual(
        extra === 0
          ? {
              tokenId: TOKEN,
              uri: "",
              image: "ipfs://boundary",
              status: "found",
              needsRefetch: false,
            }
          : invalidInline,
      );
    }
  });

  it("counts UTF-8 bytes rather than JavaScript character units", async () => {
    const prefix = '{"image":"ipfs://unicode","name":"';
    const suffix = '"}';
    const budget = 65536 - prefix.length - suffix.length;
    const json = prefix + "é".repeat(Math.floor(budget / 2)) + "x".repeat(budget % 2) + suffix;
    expect(await lookupUri(`data:application/json,${json}`)).toMatchObject({
      image: "ipfs://unicode",
      needsRefetch: false,
    });
    expect(await lookupUri(`data:application/json,${json.slice(0, -2)}x"}`)).toEqual(invalidInline);
  });

  it.each([128, 129])("retains scalar image and marks partial only beyond %s traits", async count => {
    const json = JSON.stringify({
      image: "ipfs://usable",
      attributes: Array.from({ length: count }, () => ({ value: "x" })),
    });
    expect(await lookupUri(`data:application/json,${json}`)).toEqual({
      tokenId: TOKEN,
      uri: "",
      image: "ipfs://usable",
      status: "found",
      needsRefetch: count > 128,
    });
  });

  it("does not hide malformed attributes after the retention boundary", async () => {
    const attributes = [...Array.from({ length: 128 }, () => ({ value: "x" })), { value: {} }];
    expect(await lookupUri(`data:application/json,${JSON.stringify({ image: "ipfs://discard", attributes })}`)).toEqual(
      invalidInline,
    );
  });

  it("matches attribute keys case-insensitively like top-level fields", async () => {
    expect((await lookupUri('data:application/json,{"attributes":[{"value":{}}]}')).needsRefetch).toBe(true);
    expect((await lookupUri('data:application/json,{"attributes":[{"Value":{}}]}')).needsRefetch).toBe(true);
  });
});
