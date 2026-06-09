import { MsgAddPackage, MsgCall, MsgRun, MsgSend } from "@gnolang/gno-js-client";

export type EMessageType = "/bank.MsgSend" | "/vm.m_call" | "/vm.m_addpkg" | "/vm.m_run";
export type TMessage = MsgAddPackage | MsgCall | MsgSend | MsgRun;

export interface ContractMessage {
  type: EMessageType;
  value: TMessage;
}
