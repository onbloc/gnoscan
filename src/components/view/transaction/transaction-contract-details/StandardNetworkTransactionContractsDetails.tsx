/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { Transaction, TransactionContractInfo } from "@/types/data-type";
import { formatDisplayPackagePath } from "@/common/utils/string-util";
import { TransactionContractModel } from "@/repositories/api/transaction/response";

import * as S from "./TransactionContractDetails.styles";
import Text from "@/components/ui/text";
import ShowLog from "@/components/ui/show-log";
import {
  StandardNetworkBankMsgSendMessage,
  StandardNetworkAddPackageMessage,
  StandardNetworkMsgCallMessage,
  StandardNetworkMsgRunMessage,
} from "../transaction-message-card";
import { API_MESSAGE_TYPES } from "@/common/values/message-types.constant";

const TOOLTIP_PACKAGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gno.land.
  </>
);

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

  const hasCaller = React.useCallback((message: any): boolean => {
    if (["BankMsgSend", "AddPackage"].includes(message["messageType"])) {
      return false;
    }

    if (message["messageType"] === "MsgCall" && message?.funcType === "Transfer") {
      return false;
    }

    return true;
  }, []);

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

          {/* {message["messageType"] !== "BankMsgSend" && (
            <>
              <DLWrap desktop={isDesktop}>
                <dt>Name</dt>
                <dd>
                  <Badge>
                    <Text type="p4" color="secondary">
                      {message.name || "-"}
                    </Text>
                  </Badge>
                </dd>
              </DLWrap>
              <DLWrap desktop={isDesktop}>
                <dt>
                  Path
                  <div className="tooltip-wrapper">
                    <Tooltip content={TOOLTIP_PACKAGE_PATH}>
                      <IconTooltip />
                    </Tooltip>
                  </div>
                </dt>
                <dd>
                  <Badge>
                    <Text type="p4" color="blue" className="ellipsis">
                      <Link href={getUrlWithNetwork(`/realms/details?path=${message.pkgPath || "-"}`)} passHref>
                        <FitContentA>{formatDisplayPackagePath(message.pkgPath || "-")}</FitContentA>
                      </Link>
                    </Text>
                    <Tooltip
                      content="Copied!"
                      trigger="click"
                      copyText={message.pkgPath || ""}
                      className="address-tooltip"
                    >
                      <S.StyledIconCopy />
                    </Tooltip>
                  </Badge>
                </dd>
              </DLWrap>
            </>
          )}
          <DLWrap desktop={isDesktop}>
            <dt>Function</dt>
            <dd>
              <Badge type="blue">
                <Text type="p4" color="white">
                  {getContractType(message)}
                </Text>
              </Badge>
            </dd>
          </DLWrap>
          {message["messageType"] === "MsgCall" && message?.funcType === "Transfer" && (
            <StandardNetworkTransactionTransferContract
              message={message}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}
          {message["messageType"] === "BankMsgSend" && (
            <StandardNetworkTransactionTransferContract
              message={message}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}
          {message["messageType"] === "AddPackage" && (
            <TransactionAddPackageContract
              message={message}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}
          {hasCaller(message) && (
            <TransactionCallerContract message={message} isDesktop={isDesktop} getUrlWithNetwork={getUrlWithNetwork} />
          )} */}
        </S.ContractListBox>
      ))}
      {showLog && <ShowLog isTabLog={false} logData={showLog} btnTextType="Logs" />}
    </React.Fragment>
  );
};
