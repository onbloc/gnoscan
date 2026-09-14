import { MsgAddPackage, MsgCall, MsgRun, MsgSend } from "@gnolang/gno-js-client";
import { MsgEnablePackage, MsgRejectPackage } from "@/common/utils/tx-proto-decoder";

export type EMessageType =
  | "/bank.MsgSend"
  | "/vm.m_call"
  | "/vm.m_addpkg"
  | "/vm.m_run"
  | "/vm.m_enable_pkg"
  | "/vm.m_reject_pkg";
export type TMessage = MsgAddPackage | MsgCall | MsgSend | MsgRun | MsgEnablePackage | MsgRejectPackage;

export interface ContractMessage {
  type: EMessageType;
  value: TMessage;
}
