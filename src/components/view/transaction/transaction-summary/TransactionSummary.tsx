/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";

import { GnoEvent, Transaction } from "@/types/data-type";

import DataSection from "../../details-data-section";
import { DateDiffText, DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import Tooltip from "@/components/ui/tooltip";
import { AmountText } from "@/components/ui/text/amount-text";
import ShowLog from "@/components/ui/show-log";
import { StyledIconCopy } from "./Transaction.styles";

interface TransactionSummaryProps {
  isDesktop: boolean;
  txHash: string;
  network: any;
  timeStamp: {
    time: string;
    passedTime: string | undefined;
  };
  blockResult: any;
  gas: string;
  transactionItem: Transaction | null;
  transactionEvents: GnoEvent[];
  isFetched: boolean;
  isError: boolean;
  getUrlWithNetwork: (uri: string) => string;
}

const TransactionSummary = ({
  isDesktop,
  txHash,
  gas,
  network,
  timeStamp,
  transactionItem,
  blockResult,
  transactionEvents,
  isFetched,
  isError,
  getUrlWithNetwork,
}: TransactionSummaryProps) => {
  const blockResultLog = React.useMemo(() => {
    if (transactionItem?.success !== false) {
      return null;
    }

    try {
      return JSON.stringify(blockResult, null, 2);
    } catch {
      return null;
    }
  }, [transactionItem, blockResult]);

  return (
    transactionItem && (
      <DataSection title="Summary">
        <DLWrap desktop={isDesktop}>
          <dt>Success</dt>
          <dd>
            <Badge type={transactionItem.success ? "green" : "failed"}>
              <Text type="p4" color="white">
                {transactionItem.success ? "Success" : "Failure"}
              </Text>
            </Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Timestamp</dt>
          <dd>
            <Badge>
              <Text type="p4" color="inherit" className="ellipsis">
                {timeStamp.time}
              </Text>
              <DateDiffText>{timeStamp.passedTime}</DateDiffText>
            </Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Tx Hash</dt>
          <dd>
            <Badge>
              <Text type="p4" color="inherit" className="ellipsis">
                {txHash}
              </Text>
              <Tooltip content="Copied!" trigger="click" copyText={txHash}>
                <StyledIconCopy className="svg-icon" />
              </Tooltip>
            </Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Network</dt>
          <dd>
            <Badge>{network}</Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Block</dt>
          <dd>
            <Badge>
              <Link href={getUrlWithNetwork(`/block/${transactionItem.blockHeight}`)} passHref>
                <FitContentA>
                  <Text type="p4" color="blue">
                    {transactionItem.blockHeight}
                  </Text>
                </FitContentA>
              </Link>
            </Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Transaction Fee</dt>
          <dd>
            <Badge>
              <AmountText
                minSize="body2"
                maxSize="p4"
                value={transactionItem.fee.value}
                denom={transactionItem.fee.denom}
              />
            </Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Gas (Used/Wanted)</dt>
          <dd>
            <Badge>{gas}</Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Memo</dt>
          <dd>
            <Badge>{transactionItem.memo}</Badge>
          </dd>
        </DLWrap>
        {!transactionItem.success && (
          <ShowLog isTabLog={false} logData={blockResultLog || ""} btnTextType="Error Logs" />
        )}
      </DataSection>
    )
  );
};

export default TransactionSummary;
