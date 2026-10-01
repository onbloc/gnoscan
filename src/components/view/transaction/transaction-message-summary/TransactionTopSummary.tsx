import React from "react";
import styled from "styled-components";

import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { TransactionSummaryDetail } from "@/types/data-type";
import CommonMessageSummary from "./CommonMessageSummary";
import TransactionActionSummary, { hasDisplayActions } from "./TransactionActionSummary";
import TransactionMessageSummary from "./TransactionMessageSummary";
import TransferSummaryLine from "./TransferSummaryLine";
import { getTransferSummaryLines } from "./transfer-render";

type TransactionTopSummaryCase = "custom" | "common-summary" | "common-message" | "none";

interface Props {
  messages: TransactionContractModel[];
  numOfMessage: number;
  summary?: TransactionSummaryDetail | null;
  isDesktop: boolean;
}

const TransactionTopSummary = ({ messages, numOfMessage, summary, isDesktop }: Props) => {
  const actions = summary?.actions ?? [];
  const positionOwnerAddress = getSharedSummaryCaller(messages);
  const transferSummaryLines = getTransferSummaryLines(numOfMessage, summary);
  const summaryCase = getTransactionTopSummaryCase({
    hasCustomSummary: hasDisplayActions(actions, summary?.types),
    hasTransferSummary: transferSummaryLines.length > 0,
    hasMessages: messages.length > 0,
  });

  switch (summaryCase) {
    case "custom":
      return (
        <SummaryCard>
          <TransactionActionSummary
            actions={actions}
            types={summary?.types}
            positionOwnerAddress={positionOwnerAddress}
            embedded
          />
          {summary && <TransactionMessageSummary summary={summary} isDesktop={isDesktop} embedded />}
        </SummaryCard>
      );
    case "common-summary":
      return (
        <SummaryCard>
          <TransferSummaryLine transfers={transferSummaryLines} embedded />
          {summary && <TransactionMessageSummary summary={summary} isDesktop={isDesktop} embedded />}
        </SummaryCard>
      );
    case "common-message":
      return (
        <SummaryCard>
          <CommonMessageSummary messages={messages} embedded />
          {summary && <TransactionMessageSummary summary={summary} isDesktop={isDesktop} embedded />}
        </SummaryCard>
      );
    case "none":
      return summary ? <TransactionMessageSummary summary={summary} isDesktop={isDesktop} /> : null;
    default:
      return null;
  }
};

function getTransactionTopSummaryCase({
  hasCustomSummary,
  hasTransferSummary,
  hasMessages,
}: {
  hasCustomSummary: boolean;
  hasTransferSummary: boolean;
  hasMessages: boolean;
}): TransactionTopSummaryCase {
  if (hasCustomSummary) return "custom";
  if (hasTransferSummary) return "common-summary";
  if (hasMessages) return "common-message";
  return "none";
}

function getSharedSummaryCaller(messages: TransactionContractModel[]): string {
  const callers = new Set(messages.map(getSummaryCaller).filter(Boolean));
  return callers.size === 1 ? Array.from(callers)[0] : "";
}

function getSummaryCaller(message: TransactionContractModel): string {
  return message.caller || message.from || message.creator || "";
}

const SummaryCard = styled.div`
  width: 100%;
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
`;

export default TransactionTopSummary;
