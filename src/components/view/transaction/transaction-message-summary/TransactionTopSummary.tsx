import React from "react";

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
  const transferSummaryLines = getTransferSummaryLines(numOfMessage, summary);
  const summaryCase = getTransactionTopSummaryCase({
    hasCustomSummary: hasDisplayActions(actions, summary?.types),
    hasTransferSummary: transferSummaryLines.length > 0,
    hasMessages: messages.length > 0,
  });

  switch (summaryCase) {
    case "custom":
      return (
        <>
          <TransactionActionSummary actions={actions} types={summary?.types} />
          {summary && <TransactionMessageSummary summary={summary} isDesktop={isDesktop} />}
        </>
      );
    case "common-summary":
      return (
        <>
          <TransferSummaryLine transfers={transferSummaryLines} />
          {summary && <TransactionMessageSummary summary={summary} isDesktop={isDesktop} />}
        </>
      );
    case "common-message":
      return (
        <>
          <CommonMessageSummary messages={messages} />
          {summary && <TransactionMessageSummary summary={summary} isDesktop={isDesktop} />}
        </>
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

export default TransactionTopSummary;
