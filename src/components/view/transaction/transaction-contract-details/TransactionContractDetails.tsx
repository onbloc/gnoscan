/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";

import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
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

const TOOLTIP_PACKAGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gno.land.
  </>
);

export const TransactionContractDetails: React.FC<{
  transactionItem: TransactionContractInfo | Transaction | null;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
  getTokenAmount: (tokenId: string, amountRaw: string | number) => Amount;
  getName?: (address: string) => string;
}> = ({ transactionItem, isDesktop, getUrlWithNetwork, getTokenAmount }) => {
  const { tokenMap } = useTokenMeta();

  const messages = React.useMemo(() => {
    if (!transactionItem?.messages) {
      return [];
    }
    return transactionItem?.messages;
  }, [transactionItem?.messages]);

  const hasCaller = React.useCallback((message: any): boolean => {
    if (["/bank.MsgSend", "/vm.m_addpkg"].includes(message["@type"])) {
      return false;
    }

    if (message["@type"] === "/vm.m_call" && message?.func === "Transfer") {
      return false;
    }

    return true;
  }, []);

  const getContractType = React.useCallback((message: any) => {
    switch (message["@type"]) {
      case "/bank.MsgSend":
        return "Transfer";
      case "/vm.m_addpkg":
        return "AddPackage";
      case "/vm.m_call":
        const arg0 = message["args"] && message["args"][0];
        if (typeof arg0 === "string" && arg0.trim() !== "") {
          return arg0;
        }
        if (typeof message["func"] === "string" && message["func"].trim() !== "") {
          return message["func"];
        }
        return message["@type"];
      case "/vm.m_run":
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
          {message["@type"] !== "/bank.MsgSend" && (
            <>
              <DLWrap desktop={isDesktop}>
                <dt>Name</dt>
                <dd>
                  <Badge>
                    <Text type="p4" color="primary">
                      {message["@type"] ||
                        message?.package?.name ||
                        tokenMap?.[message?.pkg_path]?.name ||
                        message.func ||
                        "-"}
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
                      <Link
                        href={getUrlWithNetwork(
                          `/realms/details?path=${message?.package?.path || message?.pkg_path || "-"}`,
                        )}
                        passHref
                      >
                        <FitContentA>
                          {formatDisplayPackagePath(
                            message?.func || message?.package?.path || message?.pkg_path || "-",
                          )}
                        </FitContentA>
                      </Link>
                    </Text>
                    <Tooltip
                      content="Copied!"
                      trigger="click"
                      copyText={message?.package?.path || message?.pkg_path || "-"}
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
          {message["@type"] === "/vm.m_call" && message?.func === "Transfer" && (
            <TransactionTransferContract
              message={message}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
              getTokenAmount={getTokenAmount}
            />
          )}
          {message["@type"] === "/bank.MsgSend" && (
            <TransactionTransferContract
              message={message}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
              getTokenAmount={getTokenAmount}
            />
          )}
          {message["@type"] === "/vm.m_addpkg" && (
            <TransactionAddPackageContract
              message={message}
              isDesktop={isDesktop}
              getUrlWithNetwork={getUrlWithNetwork}
            />
          )}
          {hasCaller(message) && (
            <TransactionCallerContract message={message} isDesktop={isDesktop} getUrlWithNetwork={getUrlWithNetwork} />
          )}
        </S.ContractListBox>
      ))}
      {transactionItem?.rawContent && (
        <ShowLog isTabLog={false} logData={transactionItem.rawContent} btnTextType="Logs" />
      )}
    </React.Fragment>
  );
};
