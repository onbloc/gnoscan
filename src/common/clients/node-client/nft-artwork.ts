import type { NftTokenUriModel } from "@/repositories/api/token/response";
import type { NodeClient } from "./types";
import { stringToBase64 } from "./utility";

const MAX_RPC_BYTES = 1024 * 1024;
const MAX_INLINE_BYTES = 64 * 1024;
const MAX_ATTRIBUTES = 128;
const MAX_ATTRIBUTE_BYTES = 64 * 1024;
const encoder = new TextEncoder();

function decodeBase64(value: string, limit: number): Uint8Array {
  // Go's standard encoding ignores CR/LF, but not other whitespace. Check
  // the allocation bound before removing them or decoding the payload.
  if (value.length > Math.ceil(limit / 3) * 4) throw new Error("Oversized base64 payload");
  const encoded = value.replace(/[\r\n]/g, "");
  if (encoded.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)) {
    throw new Error("Invalid base64 payload");
  }
  const binary = atob(encoded);
  if (binary.length > limit || btoa(binary) !== encoded) throw new Error("Noncanonical base64 payload");
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}

function decodeRpcData(data: string | null): string {
  if (typeof data !== "string" || data.length > MAX_RPC_BYTES) throw new Error("Invalid RPC data");
  return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(decodeBase64(data, MAX_RPC_BYTES));
}

function splitEvalValues(text: string): string[] {
  const values: string[] = [];
  const closers: string[] = [];
  let quoted = false;
  let escaped = false;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (closers.length === 0) {
      if (/[ \t\r\n]/.test(char)) continue;
      if (char !== "(" || values.length === 2) throw new Error("Invalid eval return shape");
      start = i + 1;
      closers.push(")");
      continue;
    }
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') quoted = false;
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === "(" || char === "[" || char === "{") {
      closers.push(char === "(" ? ")" : char === "[" ? "]" : "}");
    } else if (char === ")" || char === "]" || char === "}") {
      if (closers.pop() !== char) throw new Error("Unbalanced eval return value");
      if (closers.length === 0) {
        const value = text.slice(start, i);
        if (!value.trim()) throw new Error("Empty eval return value");
        values.push(value);
      }
    }
  }
  if (quoted || closers.length || !values.length) throw new Error("Truncated eval response");
  return values;
}

function unquoteGoString(literal: string): { text: string; validUtf8: boolean } {
  const bytes: number[] = [];
  const appendText = (text: string) => {
    for (const byte of encoder.encode(text)) bytes.push(byte);
  };
  const escapes: Record<string, number> = { a: 7, b: 8, f: 12, n: 10, r: 13, t: 9, v: 11, "\\": 92, '"': 34 };
  let start = 1;
  for (let i = 1; i < literal.length - 1; i++) {
    if (literal[i] === "\n" || literal[i] === '"') throw new Error("Invalid Go string literal");
    if (literal[i] !== "\\") continue;
    appendText(literal.slice(start, i));
    const escape = literal[++i];
    if (Object.prototype.hasOwnProperty.call(escapes, escape)) bytes.push(escapes[escape]);
    else {
      const octal = /[0-7]/.test(escape);
      const count = escape === "x" ? 2 : escape === "u" ? 4 : escape === "U" ? 8 : octal ? 3 : 0;
      if (!count) throw new Error("Invalid Go string escape");
      const offset = octal ? i : i + 1;
      const digits = literal.slice(offset, offset + count);
      if (digits.length !== count || !(octal ? /^[0-7]+$/ : /^[0-9a-fA-F]+$/).test(digits)) {
        throw new Error("Invalid Go string escape digits");
      }
      const code = parseInt(digits, octal ? 8 : 16);
      if (octal || escape === "x") {
        if (code > 255) throw new Error("Invalid Go byte escape");
        bytes.push(code);
      } else {
        if (code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) throw new Error("Invalid Go rune escape");
        appendText(String.fromCodePoint(code));
      }
      i = offset + count - 1;
    }
    start = i + 1;
  }
  appendText(literal.slice(start, -1));
  const data = new Uint8Array(bytes);
  try {
    return { text: new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(data), validUtf8: true };
  } catch {
    // Go strings may contain arbitrary bytes. JSON responses replace invalid
    // UTF-8 in direct URIs; inline metadata instead rejects those bytes.
    return { text: new TextDecoder("utf-8", { ignoreBOM: true }).decode(data), validUtf8: false };
  }
}

function decodeInlinePayload(payload: string, base64: boolean): string {
  const limit = base64 ? Math.ceil(MAX_INLINE_BYTES / 3) * 4 : MAX_INLINE_BYTES;
  const bytes: number[] = [];
  let start = 0;
  const appendText = (text: string) => {
    for (const byte of encoder.encode(text)) {
      if (bytes.length === limit) throw new Error("Oversized inline metadata");
      bytes.push(byte);
    }
  };
  for (let i = 0; i < payload.length; i++) {
    if (payload[i] !== "%") continue;
    appendText(payload.slice(start, i));
    const digits = payload.slice(i + 1, i + 3);
    if (!/^[0-9a-fA-F]{2}$/.test(digits)) throw new Error("Invalid percent escape");
    if (bytes.length === limit) throw new Error("Oversized inline metadata");
    bytes.push(parseInt(digits, 16));
    i += 2;
    start = i + 1;
  }
  appendText(payload.slice(start));
  const decoded = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(new Uint8Array(bytes));
  if (!base64) return decoded;
  return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(decodeBase64(decoded, MAX_INLINE_BYTES));
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// The payload is validated with JSON.parse first. Retain the original scalar
// lexemes and duplicate fields: Go preserves number spelling and rejects an
// invalid earlier string field even if a later duplicate would overwrite it.
function jsonEntries(source: string): Array<[string, string]> {
  const object = source.trimStart()[0] === "{";
  const entries: Array<[string, string]> = [];
  const tokens = /"(?:\\[\s\S]|[^"\\])*"|[{}[\]:,]/g;
  let depth = 0;
  let key = "";
  let start = -1;
  let match: RegExpExecArray | null;
  while ((match = tokens.exec(source)) !== null) {
    const token = match[0];
    if (depth === 1 && (token === "," || token === "}" || token === "]")) {
      if (start !== -1) {
        const value = source.slice(start, match.index).trim();
        if (value) entries.push([key, value]);
      }
      start = object ? -1 : tokens.lastIndex;
    } else if (depth === 1 && object && start === -1) {
      if (token[0] === '"') key = JSON.parse(token);
      else if (token === ":") start = tokens.lastIndex;
    }
    if (token === "{" || token === "[") {
      depth++;
      if (depth === 1 && !object) start = tokens.lastIndex;
    } else if (token === "}" || token === "]") depth--;
  }
  return entries;
}

function projectInlineUri(uri: string, validUtf8: boolean): Pick<NftTokenUriModel, "uri" | "image" | "needsRefetch"> {
  if (!/^data:/i.test(uri)) return { uri, needsRefetch: false };
  const comma = uri.indexOf(",");
  const header = uri.slice(5, comma === -1 ? undefined : comma).split(";");
  if (header[0].toLowerCase() !== "application/json") return { uri, needsRefetch: false };
  try {
    if (comma === -1 || !validUtf8) throw new Error("Invalid inline URI");
    let base64 = false;
    let charset = false;
    for (const part of header.slice(1)) {
      const parameter = part.toLowerCase();
      if (parameter === "base64" && !base64) base64 = true;
      else if (parameter === "charset=utf-8" && !charset && !base64) charset = true;
      else throw new Error("Invalid inline URI parameter");
    }
    const source = decodeInlinePayload(uri.slice(comma + 1), base64);
    if (!isObject(JSON.parse(source))) throw new Error("Metadata must be an object");
    const scalarFields: Record<string, true> = {
      image: true,
      image_data: true,
      external_url: true,
      description: true,
      name: true,
      background_color: true,
      animation_url: true,
      youtube_url: true,
    };
    let image = "";
    let attributes = "";
    // encoding/json matches struct field names case-insensitively.
    for (const [key, raw] of jsonEntries(source)) {
      const field = key.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(scalarFields, field)) {
        const value: unknown = JSON.parse(raw);
        if (value !== null && typeof value !== "string") throw new Error("Invalid metadata string");
        if (field === "image" && typeof value === "string") {
          image = new TextDecoder("utf-8", { ignoreBOM: true }).decode(encoder.encode(value));
        }
      } else if (field === "attributes") attributes = raw;
    }
    let partial = false;
    if (attributes && attributes !== "null") {
      if (attributes[0] !== "[") throw new Error("Attributes must be an array");
      let count = 0;
      let attributeBytes = 0;
      for (const [, trait] of jsonEntries(attributes)) {
        if (trait[0] !== "{") throw new Error("Attribute must be an object");
        let displayType = "";
        let traitType = "";
        let traitValue = "";
        for (const [key, raw] of jsonEntries(trait)) {
          if (key !== "display_type" && key !== "trait_type" && key !== "value") continue;
          const value: unknown = JSON.parse(raw);
          if (key === "value") {
            if (value === null) traitValue = "";
            else if (typeof value === "string") traitValue = value;
            else if (typeof value === "number" || typeof value === "boolean") traitValue = raw;
            else throw new Error("Attribute value must be scalar");
          } else {
            if (value !== null && typeof value !== "string") throw new Error("Invalid trait string");
            if (typeof value === "string") {
              if (key === "display_type") displayType = value;
              else traitType = value;
            }
          }
        }
        count++;
        attributeBytes +=
          encoder.encode(displayType).length + encoder.encode(traitType).length + encoder.encode(traitValue).length;
      }
      partial = count > MAX_ATTRIBUTES || attributeBytes > MAX_ATTRIBUTE_BYTES;
    }
    return { uri: "", ...(image ? { image } : {}), needsRefetch: partial };
  } catch {
    // TokenURI was found even when its inline metadata is invalid. Never
    // expose application/json data as a card image or cache it as complete.
    return { uri: "", needsRefetch: true };
  }
}

/** Card-only TokenURI lookup, matching the backend's inline metadata projection. */
export async function requestNftTokenUri(
  nodeClient: Pick<NodeClient, "abciQuery" | "abciQueryVMQueryFuncs">,
  packagePath: string,
  tokenId: string,
): Promise<NftTokenUriModel> {
  // Package names enter the VM expression unquoted. Reject expression syntax
  // here; syntactically valid but undeployed packages are classified by the VM.
  if (!/^[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*(?:\/[a-zA-Z0-9_-]+)+$/.test(packagePath)) {
    throw new Error(`Invalid NFT package path: ${packagePath}`);
  }
  const unavailable: NftTokenUriModel = { tokenId, uri: "", status: "unavailable", needsRefetch: true };
  let response;
  try {
    // JSON's quoted string syntax is valid Go string syntax. In particular,
    // quotes, backslashes, control characters and newlines cannot escape it.
    const literal = JSON.stringify(tokenId);
    unquoteGoString(literal);
    response = await nodeClient.abciQuery("vm/qeval", stringToBase64(`${packagePath}.TokenURI(${literal})`));
  } catch {
    return unavailable;
  }
  const base = response?.response?.ResponseBase;
  if (!base) return unavailable;
  if (base.Error != null) {
    const error: unknown = base.Error;
    if (!isObject(error)) return unavailable;
    if (error["@type"] === "/vm.InvalidPkgPathError") throw new Error(`Invalid NFT package path: ${packagePath}`);
    if (
      error["@type"] !== "/abci.StringError" ||
      typeof error.value !== "string" ||
      !error.value.includes("name TokenURI not declared")
    ) {
      return unavailable;
    }
    try {
      const funcs = await nodeClient.abciQueryVMQueryFuncs(packagePath);
      const funcsBase = funcs?.response?.ResponseBase;
      if (!funcsBase || funcsBase.Error != null) return unavailable;
      const signatures: unknown = JSON.parse(decodeRpcData(funcsBase.Data));
      if (
        !Array.isArray(signatures) ||
        signatures.some(signature => !isObject(signature) || typeof signature.FuncName !== "string")
      ) {
        return unavailable;
      }
      if (signatures.some(signature => signature.FuncName === "TokenURI")) return unavailable;
      return { tokenId, uri: "", status: "unsupported", needsRefetch: false };
    } catch {
      return unavailable;
    }
  }
  try {
    const values = splitEvalValues(decodeRpcData(base.Data));
    const match = /^("(?:\\[\s\S]|[^"\\])*"|) string$/.exec(values[0]);
    if (!match) return unavailable;
    const uri = match[1] ? unquoteGoString(match[1]) : { text: "", validUtf8: true };
    if ((values.length === 2 && !/^undefined(?: \S.*)?$/.test(values[1])) || !uri.text) {
      return { tokenId, uri: "", status: "not_set", needsRefetch: false };
    }
    return { tokenId, status: "found", ...projectInlineUri(uri.text, uri.validUtf8) };
  } catch {
    return unavailable;
  }
}
