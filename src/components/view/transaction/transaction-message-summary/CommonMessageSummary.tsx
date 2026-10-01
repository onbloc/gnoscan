import React from "react";
import styled from "styled-components";

import { getTransactionMessageType } from "@/common/utils/message.utility";
import Text from "@/components/ui/text";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { SUMMARY_LINE_HEIGHT, TransferAddress } from "./transfer-render";

interface Props {
  messages: TransactionContractModel[];
  embedded?: boolean;
}

const CommonMessageSummary = ({ messages, embedded = false }: Props) => {
  if (messages.length === 0) return null;

  const numbered = messages.length > 1;

  return (
    <Wrapper $embedded={embedded}>
      {messages.map((message, index) => (
        <Line key={`${message.messageType}-${message.pkgPath}-${message.funcType}-${index}`}>
          {numbered && (
            <Text type="p2" color="tertiary" fontWeight={400} style={SUMMARY_LINE_HEIGHT}>
              {`${index + 1}.`}
            </Text>
          )}
          <Text type="p2" color="tertiary" fontWeight={400} style={SUMMARY_LINE_HEIGHT}>
            {getSummaryFunctionName(message)}
          </Text>
          <Text type="p2" color="tertiary" fontWeight={400} style={SUMMARY_LINE_HEIGHT}>
            by
          </Text>
          <TransferAddress address={getSummaryCaller(message)} />
        </Line>
      ))}
    </Wrapper>
  );
};

function getSummaryFunctionName(message: TransactionContractModel): string {
  const [calledFunction] = message.calledFunctions ?? [];
  return calledFunction?.method || getTransactionMessageType(message);
}

function getSummaryCaller(message: TransactionContractModel): string {
  return message.caller || message.from || message.creator || "";
}

const Wrapper = styled.div<{ $embedded: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: ${({ $embedded }) => ($embedded ? "0px" : "16px")};
  padding-bottom: ${({ $embedded }) => ($embedded ? "0px" : "16px")};
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;

export default CommonMessageSummary;
