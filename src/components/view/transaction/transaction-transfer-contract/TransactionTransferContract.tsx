/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { v1 } from "uuid";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { parseTokenAmount } from "@/common/utils/token.utility";

import * as S from "./TransactionTransferContract.styles";
import Text from "@/components/ui/text";
import { Amount } from "@/types/data-type";
import { DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import { AmountText } from "@/components/ui/text/amount-text";
import Tooltip from "@/components/ui/tooltip";

interface TransactionTransferContractProps {
  message: any;
  isDesktop: boolean;
  getUrlWithNetwork: (uri: string) => string;
  getTokenAmount: (tokenId: string, amountRaw: string | number) => Amount;
}

const TransactionTransferContract = ({
  isDesktop,
  message,
  getUrlWithNetwork,
  getTokenAmount,
}: TransactionTransferContractProps) => {
  const fromAddress = React.useMemo(() => {
    return message?.from_address || message?.caller || "-";
  }, [message]);

  const toAddress = React.useMemo(() => {
    return message?.to_address || message?.args?.[0] || "-";
  }, [message]);

  return (
    <>
      <DLWrap desktop={isDesktop}>
        <dt>Amount</dt>
        <dd>
          <Badge>
            <AmountText
              minSize="body2"
              maxSize="p4"
              {...getTokenAmount(GNOTToken.denom, parseTokenAmount(message?.amount || "0ugnot"))}
            />
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop} key={v1()}>
        <dt>{"From"}</dt>
        <dd>
          <Badge>
            <S.AddressTextBox>
              <Text type="p4" color="blue" className="ellipsis">
                <Link href={getUrlWithNetwork(`/account/${fromAddress}`)} passHref>
                  <FitContentA>{fromAddress}</FitContentA>
                </Link>
              </Text>
              <Tooltip content="Copied!" trigger="click" copyText={fromAddress} className="address-tooltip">
                <S.StyledIconCopy />
              </Tooltip>
            </S.AddressTextBox>
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop} key={v1()}>
        <dt>{"To"}</dt>
        <dd>
          <Badge>
            <S.AddressTextBox>
              <Text type="p4" color="blue" className="ellipsis">
                <Link href={getUrlWithNetwork(`/account/${toAddress}`)} passHref>
                  <FitContentA>{toAddress}</FitContentA>
                </Link>
              </Text>
              <Tooltip content="Copied!" trigger="click" copyText={toAddress} className="address-tooltip">
                <S.StyledIconCopy />
              </Tooltip>
            </S.AddressTextBox>
          </Badge>
        </dd>
      </DLWrap>
    </>
  );
};

export default TransactionTransferContract;
