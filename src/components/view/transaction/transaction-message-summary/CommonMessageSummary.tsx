import React from "react";
import styled from "styled-components";

import { getSummaryCaller, getTransactionMessageType } from "@/common/utils/message.utility";
import Text from "@/components/ui/text";
import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { SUMMARY_LINE_HEIGHT, SummaryLine, TransferAddress } from "./transfer-render";

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
        <SummaryLine key={`${message.messageType}-${message.pkgPath}-${message.funcType}-${index}`}>
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
          <TransferAddress {...getSummaryCaller(message)} />
        </SummaryLine>
      ))}
    </Wrapper>
  );
};

function getSummaryFunctionName(message: TransactionContractModel): string {
  const [calledFunction] = message.calledFunctions ?? [];
  return calledFunction?.method || getTransactionMessageType(message);
}

const Wrapper = styled.div<{ $embedded: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: ${({ $embedded }) => ($embedded ? "0px" : "16px")};
  padding-bottom: ${({ $embedded }) => ($embedded ? "0px" : "16px")};
`;

export default CommonMessageSummary;
