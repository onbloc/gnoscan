/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";

import { useTransaction } from "@/common/hooks/transactions/use-transaction";

import DataSection from "@/components/view/details-data-section";
import { DateDiffText, DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import Tooltip from "@/components/ui/tooltip";
import { AmountText } from "@/components/ui/text/amount-text";
import ShowLog from "@/components/ui/show-log";
import { StyledIconCopy } from "../Transaction.styles";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";

interface TransactionSummaryProps {
  isDesktop: boolean;
  txHash: string;
  getUrlWithNetwork: (uri: string) => string;
}

const CustomNetworkTransactionSummary = ({ isDesktop, txHash, getUrlWithNetwork }: TransactionSummaryProps) => {
  const { transaction: transactionSummaryInfo, isFetched } = useTransaction(txHash);

  const blockResultLog = React.useMemo(() => {
    if (transactionSummaryInfo.transactionItem?.success !== false) {
      return null;
    }

    try {
      return JSON.stringify(transactionSummaryInfo.blockResult, null, 2);
    } catch {
      return null;
    }
  }, [transactionSummaryInfo.transactionItem, transactionSummaryInfo.blockResult]);

  if (!isFetched) return <TableSkeleton />;

  return (
    transactionSummaryInfo.transactionItem && (
      <DataSection title="Summary">
        <DLWrap desktop={isDesktop}>
          <dt>Success</dt>
          <dd>
            <Badge type={transactionSummaryInfo.transactionItem.success ? "green" : "failed"}>
              <Text type="p4" color="white">
                {transactionSummaryInfo.transactionItem.success ? "Success" : "Failure"}
              </Text>
            </Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Timestamp</dt>
          <dd>
            <Badge>
              <Text type="p4" color="inherit" className="ellipsis">
                {transactionSummaryInfo.timeStamp.time}
              </Text>
              <DateDiffText>{transactionSummaryInfo.timeStamp.passedTime}</DateDiffText>
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
            <Badge>{transactionSummaryInfo.network}</Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Block</dt>
          <dd>
            <Badge>
              <Link href={getUrlWithNetwork(`/block/${transactionSummaryInfo.transactionItem.blockHeight}`)} passHref>
                <FitContentA>
                  <Text type="p4" color="blue">
                    {transactionSummaryInfo.transactionItem.blockHeight}
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
                value={transactionSummaryInfo.transactionItem.fee.value}
                denom={transactionSummaryInfo.transactionItem.fee.denom}
              />
            </Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Gas (Used/Wanted)</dt>
          <dd>
            <Badge>{transactionSummaryInfo.gas}</Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={isDesktop}>
          <dt>Memo</dt>
          <dd>
            <Badge>{transactionSummaryInfo.transactionItem.memo}</Badge>
          </dd>
        </DLWrap>
        {!transactionSummaryInfo.transactionItem.success && (
          <ShowLog isTabLog={false} logData={blockResultLog || ""} btnTextType="Error Logs" />
        )}
      </DataSection>
    )
  );
};

export default CustomNetworkTransactionSummary;
