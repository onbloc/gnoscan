import { MsgAddPackage, MsgCall, MsgSend } from "@gnolang/gno-js-client";
import { MsgRun } from "@gnolang/gno-js-client/bin/proto/gno/vm";

export type EMessageType = "/bank.MsgSend" | "/vm.m_call" | "/vm.m_addpkg" | "/vm.m_run";
export type TMessage = MsgAddPackage | MsgCall | MsgSend | MsgRun;

export interface ContractMessage {
  type: EMessageType;
  value: TMessage;
}
