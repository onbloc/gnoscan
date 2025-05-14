/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { Transaction, TransactionContractInfo } from "@/types/data-type";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { API_MESSAGE_TYPES } from "@/common/values/message-types.constant";

import * as S from "./TransactionContractDetails.styles";
import Text from "@/components/ui/text";
import ShowLog from "@/components/ui/show-log";
import {
  StandardNetworkBankMsgSendMessage,
  StandardNetworkAddPackageMessage,
  StandardNetworkMsgCallMessage,
  StandardNetworkMsgRunMessage,
} from "../transaction-message-card";

export const StandardNetworkTransactionContractDetails: React.FC<{
  transactionItem: TransactionContractInfo | Transaction | null;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;

  // TODO: [temporary] to be removed after API development is complete - rawContent prop
  showLog?: string;
}> = ({ transactionItem, isDesktop, getUrlWithNetwork, showLog }) => {
  const messages: TransactionContractModel[] = React.useMemo(() => {
    if (!transactionItem?.messages) {
      return [];
    }
    return transactionItem?.messages;
  }, [transactionItem?.messages]);

  const getContractType = React.useCallback((message: any) => {
    switch (message["messageType"]) {
      case "BankMsgSend":
        return "Transfer";
      case "AddPackage":
        return "AddPackage";
      case "MsgCall":
        return message["funcType"] || message["messageType"];
      case "MsgRun":
        return "MsgRun";
    }
  }, []);

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

          {message.messageType === API_MESSAGE_TYPES.BANK_MSG_SEND && (
            <StandardNetworkBankMsgSendMessage
              message={message}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}

          {message.messageType === API_MESSAGE_TYPES.MSG_CALL && (
            <StandardNetworkMsgCallMessage
              message={message}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}

          {message.messageType === API_MESSAGE_TYPES.ADD_PACKAGE && (
            <StandardNetworkAddPackageMessage
              message={message}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}

          {message.messageType === API_MESSAGE_TYPES.MSG_RUN && (
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
