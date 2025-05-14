/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { v1 } from "uuid";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { MESSAGE_TYPES } from "@/common/values/message-types.constant";

import * as S from "../TransactionMessageCard.styles";
import Text from "@/components/ui/text";
import { Amount } from "@/types/data-type";
import { DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import { AmountText } from "@/components/ui/text/amount-text";
import Tooltip from "@/components/ui/tooltip";

interface TransactionTransferContractProps {
  message: TransactionContractModel;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
}

const StandardNetworkBankMsgSendMessage = ({
  isDesktop,
  message,
  getUrlWithNetwork,
}: TransactionTransferContractProps) => {
  const creator = React.useMemo(() => {
    return message?.caller || "-";
  }, [message]);

  const amount: Amount | null = React.useMemo(() => {
    if (!message?.amount) return null;

    return toGNOTAmount(message.amount.value, message.amount.denom);
  }, [message?.amount]);

  const getContractType = React.useCallback((message: any) => {
    switch (message.messageType) {
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

  return (
    <>
      <DLWrap desktop={isDesktop}>
        <dt>Type</dt>
        <dd>
          <Badge>
            <Text type="p4" color="secondary">
              {MESSAGE_TYPES.BANK_MSG_SEND}
            </Text>
          </Badge>
        </dd>
      </DLWrap>

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

      <DLWrap desktop={isDesktop}>
        <dt>Amount</dt>
        <dd>
          <Badge>
            <AmountText
              minSize="body2"
              maxSize="p4"
              value={amount?.value || "0"}
              denom={amount?.denom || GNOTToken.symbol}
            />
          </Badge>
        </dd>
      </DLWrap>

      <DLWrap desktop={isDesktop}>
        <dt>From</dt>
        <dd>
          <Badge>
            <S.AddressTextBox>
              <Text type="p4" color="blue" className="ellipsis">
                <Link href={getUrlWithNetwork(`/account/${creator}`)} passHref>
                  <FitContentA>{creator}</FitContentA>
                </Link>
              </Text>
              <Tooltip content="Copied!" trigger="click" copyText={creator} className="address-tooltip">
                <S.StyledIconCopy />
              </Tooltip>
            </S.AddressTextBox>
          </Badge>
        </dd>
      </DLWrap>

      <DLWrap desktop={isDesktop}>
        <dt>To</dt>
        <dd>
          <Badge>
            <S.AddressTextBox>
              <Text type="p4" color="blue" className="ellipsis">
                <Link href={getUrlWithNetwork(`/account/${creator}`)} passHref>
                  <FitContentA>{creator}</FitContentA>
                </Link>
              </Text>
              <Tooltip content="Copied!" trigger="click" copyText={creator} className="address-tooltip">
                <S.StyledIconCopy />
              </Tooltip>
            </S.AddressTextBox>
          </Badge>
        </dd>
      </DLWrap>
    </>
  );
};

export default StandardNetworkBankMsgSendMessage;
