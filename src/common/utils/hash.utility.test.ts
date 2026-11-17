import { bech32 } from "bech32";
import { toBech32AddressByPackagePath } from "./bech32.utility";
import { makeHash } from "./transaction.utility";

describe("makeHash", () => {
  it("returns base64 sha256 of the bytes", () => {
    expect(makeHash(new Uint8Array([1, 2, 3]))).toBe("A5BYxvLAy0ksUzsKTRTvd8wPeKvMztUofYShogEc+4E=");
  });

  it("handles empty input", () => {
    expect(makeHash(new Uint8Array([]))).toBe("47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=");
  });
});

describe("toBech32AddressByPackagePath", () => {
  it("encodes the first 20 bytes of sha256('pkgPath:' + path)", () => {
    const address = toBech32AddressByPackagePath("g", "gno.land/r/gnoswap/protocol_fee");
    const { prefix, words } = bech32.decode(address);

    expect(prefix).toBe("g");
    expect(Buffer.from(bech32.fromWords(words)).toString("hex")).toBe("1c6af5f1999abc23b8147f0ed53f201c255f3de7");
  });
});
