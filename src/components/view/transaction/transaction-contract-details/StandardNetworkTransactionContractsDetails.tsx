/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";

import { Amount, Transaction, TransactionContractInfo } from "@/types/data-type";
import { formatDisplayPackagePath } from "@/common/utils/string-util";

import * as S from "./TransactionContractDetails.styles";
import Text from "@/components/ui/text";
import { DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Tooltip from "@/components/ui/tooltip";
import IconTooltip from "@/assets/svgs/icon-tooltip.svg";
import TransactionTransferContract from "../transaction-transfer-contract/TransactionTransferContract";
import ShowLog from "@/components/ui/show-log";
import { TransactionAddPackageContract } from "../transaction-add-package-contract/TransactionAddPackageContract";
import { TransactionCallerContract } from "../transaction-caller-contract/TransactionCallerContract";
import StandardNetworkTransactionTransferContract from "../transaction-transfer-contract/StandardNetworkTransferContract";

const TOOLTIP_PACKAGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on gno.land.
  </>
);

export const StandardNetworkTransactionContractDetails: React.FC<{
  transactionItem: TransactionContractInfo | Transaction | null;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
  getTokenAmount: (tokenId: string, amountRaw: string | number) => Amount;
  getName?: (address: string) => string;
}> = ({ transactionItem, isDesktop, getUrlWithNetwork, getTokenAmount }) => {
  const messages = React.useMemo(() => {
    if (!transactionItem?.messages) {
      return [];
    }
    return transactionItem?.messages;
  }, [transactionItem?.messages]);

  const hasCaller = React.useCallback((message: any): boolean => {
    if (["BankMsgSend", "AddPackage"].includes(message["messageType"])) {
      return false;
    }

    if (message["messageType"] === "MsgCall" && message?.func === "Transfer") {
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
      {messages.map((message: any, i: number) => (
        <S.ContractListBox key={i}>
          {transactionItem.numOfMessage > 1 && (
            <Text type="h6" color="primary" margin="0px 0px 12px">{`#${i + 1}`}</Text>
          )}
          {message["messageType"] !== "BankMsgSend" && (
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
            <dt>Type</dt>
            <dd>
              <Badge type="blue">
                <Text type="p4" color="white">
                  {getContractType(message)}
                </Text>
              </Badge>
            </dd>
          </DLWrap>
          {message["messageType"] === "MsgCall" && message?.funcType === "Transfer" && (
            <TransactionTransferContract
              message={message}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
              getTokenAmount={getTokenAmount}
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
          )}
          {message["log"] && <ShowLog isTabLog={false} logData={message.log} btnTextType="Logs" />}
        </S.ContractListBox>
      ))}
    </React.Fragment>
  );
};
