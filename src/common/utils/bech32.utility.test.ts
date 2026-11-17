import { bech32 } from "bech32";
import { toBech32AddressByPackagePath } from "./bech32.utility";

describe("toBech32AddressByPackagePath", () => {
  it("encodes the first 20 bytes of sha256('pkgPath:' + path)", () => {
    const address = toBech32AddressByPackagePath("g", "gno.land/r/gnoswap/protocol_fee");
    const { prefix, words } = bech32.decode(address);

    expect(prefix).toBe("g");
    expect(Buffer.from(bech32.fromWords(words)).toString("hex")).toBe("1c6af5f1999abc23b8147f0ed53f201c255f3de7");
  });
});
