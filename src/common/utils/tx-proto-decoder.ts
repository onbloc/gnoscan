import { MsgEnablePackage, MsgRejectPackage } from "@/common/proto/vendor/gno/vm";

export type { MsgEnablePackage, MsgRejectPackage };

// Message types not yet supported by @gnolang/gno-js-client (gnolang/gno-js-client#260).
export const EXTRA_MESSAGE_TYPES = {
  VM_ENABLE_PKG: "/vm.m_enable_pkg",
  VM_REJECT_PKG: "/vm.m_reject_pkg",
} as const;

export function decodeExtraTxMessage(typeUrl: string, value: Uint8Array): Record<string, unknown> | null {
  switch (typeUrl) {
    case EXTRA_MESSAGE_TYPES.VM_ENABLE_PKG:
      return { "@type": typeUrl, ...(MsgEnablePackage.toJSON(MsgEnablePackage.decode(value)) as object) };
    case EXTRA_MESSAGE_TYPES.VM_REJECT_PKG:
      return { "@type": typeUrl, ...(MsgRejectPackage.toJSON(MsgRejectPackage.decode(value)) as object) };
    default:
      return null;
  }
}
