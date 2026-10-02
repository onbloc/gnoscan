/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { v1 } from "uuid";

import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { parseTokenAmount } from "@/common/utils/token.utility";

import Text from "@/components/ui/text";
import { Amount } from "@/types/data-type";
import { DLWrap, FitContentSpan } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import { AddressTextBox } from "@/components/ui/detail-field";
import { AmountText } from "@/components/ui/text/amount-text";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";

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
              wrap={false}
            />
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop} key={v1()}>
        <dt>{"From"}</dt>
        <dd>
          <Badge>
            <AddressTextBox>
              <Text type="p4" color="blue" className="ellipsis">
                <Link href={getUrlWithNetwork(`/account/${fromAddress}`)} passHref>
                  <FitContentSpan>{fromAddress}</FitContentSpan>
                </Link>
              </Text>
              <CopyTooltip variant="address" copyText={fromAddress} />
            </AddressTextBox>
          </Badge>
        </dd>
      </DLWrap>
      <DLWrap desktop={isDesktop} key={v1()}>
        <dt>{"To"}</dt>
        <dd>
          <Badge>
            <AddressTextBox>
              <Text type="p4" color="blue" className="ellipsis">
                <Link href={getUrlWithNetwork(`/account/${toAddress}`)} passHref>
                  <FitContentSpan>{toAddress}</FitContentSpan>
                </Link>
              </Text>
              <CopyTooltip variant="address" copyText={toAddress} />
            </AddressTextBox>
          </Badge>
        </dd>
      </DLWrap>
    </>
  );
};

export default TransactionTransferContract;
