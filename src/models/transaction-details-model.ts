/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusResultType } from "@/common/utils";
import { PaletteKeyType } from "@/styles";

export type SummaryDataType = {
  statusType: StatusResultType;
  statusColor: PaletteKeyType;
  timestamp: string;
  dateDiff: string;
  hash: string;
  network: string;
  height: number;
  txFee: string;
  denom: string;
  gas: string;
  memo: string;
};

export interface TransactionDetailsModel {
  summary: SummaryDataType;
  contract: any;
  log: string;
}

export type ContractKeyType =
  | "GetBoardIDFromName"
  | "CreateBoard"
  | "CreateThread"
  | "CreateReply"
  | "CreateRepost"
  | "DeletePost"
  | "EditPost"
  | "RenderBoard"
  | "Render"
  | "Register"
  | "Invite"
  | "GrantInvites"
  | "SetMinFee"
  | "SetMaxFeeMultiple"
  | "GetUserByName"
  | "GetUserByAddress"
  | "GetUserByAddressOrName";

export type KeyOfContract = {
  type: string;
  data: { [i in string]: any };
};

export const contractObj = {
  GetBoardIDFromName: ["Name"],
  CreateBoard: ["Name"],
  CreateThread: ["Board ID", "Title", "Body"],
  CreateReply: ["Board ID", "Thread ID", "Post ID", "Body"],
  CreateRepost: ["Board ID", "Post ID", "Title", "Body", "Destination Board ID"],
  DeletePost: ["Board ID", "Thread ID", "Post ID", "Reason"],
  EditPost: ["Board ID", "Thread ID", "Post ID", "Title", "Body"],
  RenderBoard: ["Board ID"],
  Render: ["Path"],
  Register: ["Inviter", "Name", "Profile"],
  Invite: ["Invitee"],
  GrantInvites: ["Invites"],
  SetMinFee: ["New Min Fee"],
  SetMaxFeeMultiple: ["New Max Fee Mult"],
  GetUserByName: ["Name"],
  GetUserByAddress: ["Addr"],
  GetUserByAddressOrName: ["Input"],
  AddPkg: ["Creator", "Name", "Path"],
  Transfer: ["From", "To", "Amount"],
} as const;
