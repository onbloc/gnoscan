/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { Transaction, TransactionContractInfo } from "@/types/data-type";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";

import * as S from "./TransactionContractDetails.styles";
import Text from "@/components/ui/text";
import ShowLog from "@/components/ui/show-log";
import {
  StandardNetworkBankMsgSendMessage,
  StandardNetworkAddPackageMessage,
  StandardNetworkMsgCallMessage,
  StandardNetworkMsgRunMessage,
} from "../transaction-message-card";
import { StorageDeposit } from "@/models/storage-deposit-model";

export const StandardNetworkTransactionContractDetails: React.FC<{
  transactionItem: TransactionContractInfo | Transaction | null;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
  showLog?: string;
  storageDepositInfo?: StorageDeposit | null;
}> = ({ transactionItem, isDesktop, getUrlWithNetwork, showLog, storageDepositInfo }) => {
  const messages: TransactionContractModel[] = React.useMemo(() => {
    if (!transactionItem?.messages) {
      return [];
    }
    return transactionItem?.messages;
  }, [transactionItem?.messages]);

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
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}

          {message.messageType === MESSAGE_TYPES.VM_RUN && (
            <StandardNetworkMsgRunMessage
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
