/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { MESSAGE_TYPES, TRANSACTION_FUNCTION_TYPES } from "@/common/values/message-types.constant";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { AssetTransfer, Transaction, TransactionContractInfo, TransactionSummaryDetail } from "@/types/data-type";

import ShowLog from "@/components/ui/show-log";
import Text from "@/components/ui/text";
import { StorageDeposit } from "@/models/storage-deposit-model";
import TransferSummaryLine from "../transaction-message-summary/TransferSummaryLine";
import {
  StandardNetworkAddPackageMessage,
  StandardNetworkBankMsgSendMessage,
  StandardNetworkCreateSessionMessage,
  StandardNetworkMsgCallMessage,
  StandardNetworkMsgRunMessage,
  StandardNetworkRevokeSessionMessage,
} from "../transaction-message-card";
import * as S from "./TransactionContractDetails.styles";

// A message is "just a transfer" when there's nothing else in the tx to summarize
// separately — the top-line heading would otherwise duplicate (or fight with) a
// multi-action summary, which is out of scope here (needs the backend's action data).
const getSingleTransferSummary = (
  message: TransactionContractModel | undefined,
  numOfMessage: number,
  summary?: TransactionSummaryDetail | null,
): AssetTransfer | null => {
  if (!message || numOfMessage !== 1 || !summary || summary.transfers.length !== 1) return null;

  const isBankSend = message.messageType === MESSAGE_TYPES.BANK_MSG_SEND;
  const isTransferCall =
    message.messageType === MESSAGE_TYPES.VM_CALL &&
    message.funcType === TRANSACTION_FUNCTION_TYPES.TRANSFER &&
    message.args.length === 2;

  if (!isBankSend && !isTransferCall) return null;

  return summary.transfers[0];
};

export const StandardNetworkTransactionContractDetails: React.FC<{
  transactionItem: TransactionContractInfo | Transaction | null;
  rawTransaction: Transaction | null;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
  storageDepositInfo?: StorageDeposit | null;
  summary?: TransactionSummaryDetail | null;
}> = ({ transactionItem, isDesktop, getUrlWithNetwork, rawTransaction, summary }) => {
  const messages: TransactionContractModel[] = React.useMemo(() => {
    if (!transactionItem?.messages) {
      return [];
    }
    return transactionItem?.messages;
  }, [transactionItem?.messages]);

  const getMessageFiles = React.useCallback(
    (index: number) => {
      if (!rawTransaction?.messages || rawTransaction?.messages.length <= index) {
        return null;
      }

      const message = rawTransaction?.messages?.[index];
      if (!message) {
        return null;
      }

      const packageFiles = message?.package?.files;
      if (!packageFiles) {
        return null;
      }

      return packageFiles.map((file: any) => {
        return {
          name: file?.name ?? "",
          body: file?.body ?? "",
        };
      });
    },
    [rawTransaction?.messages],
  );

  const showLog = React.useMemo(() => {
    if (!rawTransaction) {
      return null;
    }
    return rawTransaction.rawContent;
  }, [rawTransaction]);

  if (!transactionItem) {
    return <React.Fragment />;
  }

  return (
    <React.Fragment>
      {messages.map((message, i) => (
        <S.ContractListBox key={i}>
          {transactionItem.numOfMessage > 1 && (
            <Text type="h6" color="primary" margin="0px 0px 12px">{`#${i + 1}`}</Text>
          )}

          {(() => {
            const transferSummary = getSingleTransferSummary(message, transactionItem.numOfMessage, summary);
            return transferSummary && <TransferSummaryLine transfer={transferSummary} />;
          })()}

          {message.messageType === MESSAGE_TYPES.BANK_MSG_SEND && (
            <StandardNetworkBankMsgSendMessage
              message={message}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}

          {message.messageType === MESSAGE_TYPES.VM_CALL && (
            <StandardNetworkMsgCallMessage
              message={message}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}

          {message.messageType === MESSAGE_TYPES.VM_ADDPKG && (
            <StandardNetworkAddPackageMessage
              message={message}
              isDesktop={isDesktop}
              files={getMessageFiles(i) || []}
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}

          {message.messageType === MESSAGE_TYPES.VM_RUN && (
            <StandardNetworkMsgRunMessage
              message={message}
              isDesktop={isDesktop}
              files={getMessageFiles(i) || []}
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}

          {message.messageType === MESSAGE_TYPES.AUTH_CREATE_SESSION && (
            <StandardNetworkCreateSessionMessage
              message={message}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}

          {(message.messageType === MESSAGE_TYPES.AUTH_REVOKE_SESSION ||
            message.messageType === MESSAGE_TYPES.AUTH_REVOKE_ALL_SESSIONS) && (
            <StandardNetworkRevokeSessionMessage
              message={message}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}
        </S.ContractListBox>
      ))}
      {showLog && <ShowLog isTabLog={false} logData={showLog} btnTextType="Logs" />}
    </React.Fragment>
  );
};
