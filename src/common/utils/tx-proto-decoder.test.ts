import { MsgEnablePackage, MsgRejectPackage } from "@/common/proto/vendor/gno/vm";
import { Tx } from "@/common/proto/vendor/tm2/tx";
import { decodeExtraTxMessage } from "./tx-proto-decoder";

describe("decodeExtraTxMessage", () => {
  it("decodes /vm.m_enable_pkg into an amino-style object", () => {
    const value = MsgEnablePackage.encode({
      approver: "g1approver",
      pkg_path: "gno.land/r/demo/foo",
      pkg_hash: "abc123",
      pkg_height: BigInt(123456),
    }).finish();

    expect(decodeExtraTxMessage("/vm.m_enable_pkg", value)).toEqual({
      "@type": "/vm.m_enable_pkg",
      approver: "g1approver",
      pkg_path: "gno.land/r/demo/foo",
      pkg_hash: "abc123",
      pkg_height: "123456",
    });
  });

  it("decodes /vm.m_reject_pkg into an amino-style object", () => {
    const value = MsgRejectPackage.encode({ sender: "g1sender", pkg_path: "gno.land/r/demo/bar" }).finish();

    expect(decodeExtraTxMessage("/vm.m_reject_pkg", value)).toEqual({
      "@type": "/vm.m_reject_pkg",
      sender: "g1sender",
      pkg_path: "gno.land/r/demo/bar",
    });
  });

  it("returns null for type urls it does not handle", () => {
    expect(decodeExtraTxMessage("/vm.m_call", new Uint8Array(0))).toBeNull();
  });
});

describe("vendored Tx", () => {
  it("round-trips session_addr on signatures", () => {
    const bytes = Tx.encode({
      messages: [],
      fee: { gas_wanted: BigInt(1), gas_fee: "1ugnot" },
      signatures: [{ pub_key: undefined, signature: new Uint8Array([1]), session_addr: "g1session" }],
      memo: "",
    }).finish();

    expect(Tx.decode(bytes).signatures[0].session_addr).toBe("g1session");
  });
});
