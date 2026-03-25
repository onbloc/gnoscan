/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { MESSAGE_TYPES } from "@/common/values/message-types.constant";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { Transaction, TransactionContractInfo } from "@/types/data-type";

import ShowLog from "@/components/ui/show-log";
import Text from "@/components/ui/text";
import { StorageDeposit } from "@/models/storage-deposit-model";
import {
  StandardNetworkAddPackageMessage,
  StandardNetworkBankMsgSendMessage,
  StandardNetworkMsgCallMessage,
  StandardNetworkMsgRunMessage,
} from "../transaction-message-card";
import * as S from "./TransactionContractDetails.styles";

export const StandardNetworkTransactionContractDetails: React.FC<{
  transactionItem: TransactionContractInfo | Transaction | null;
  rawTransaction: Transaction | null;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
  storageDepositInfo?: StorageDeposit | null;
}> = ({ transactionItem, isDesktop, getUrlWithNetwork, rawTransaction }) => {
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
        </S.ContractListBox>
      ))}
      {showLog && <ShowLog isTabLog={false} logData={showLog} btnTextType="Logs" />}
    </React.Fragment>
  );
};
