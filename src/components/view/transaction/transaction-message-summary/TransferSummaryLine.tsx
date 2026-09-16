import React from "react";
import styled from "styled-components";

import Text from "@/components/ui/text";
import { AssetTransfer } from "@/types/data-type";
import { SUMMARY_LINE_HEIGHT, TransferAddress, TransferAmount, useGrc20TokenInfos } from "./transfer-render";

interface Props {
  transfers: AssetTransfer[];
}

const TransferSummaryLine = ({ transfers }: Props) => {
  const tokenInfosByTokenKey = useGrc20TokenInfos(transfers);
  const numbered = transfers.length > 1;

  return (
    <Wrapper>
      {transfers.map((transfer, index) => (
        <Line key={`${transfer.assetType}-${transfer.from}-${transfer.to}-${transfer.amount.denom}-${index}`}>
          {numbered && (
            <Text type="p2" color="tertiary" fontWeight={400} style={SUMMARY_LINE_HEIGHT}>
              {`${index + 1}.`}
            </Text>
          )}
          <Text type="p2" color="tertiary" fontWeight={400} style={SUMMARY_LINE_HEIGHT}>
            Transfer
          </Text>
          <TransferAmount transfer={transfer} tokenInfosByTokenKey={tokenInfosByTokenKey} />
          <Text type="p2" color="tertiary" fontWeight={400} style={SUMMARY_LINE_HEIGHT}>
            to
          </Text>
          <TransferAddress address={transfer.to} packagePath={transfer.toPackagePath} />
        </Line>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 8px;
  margin-bottom: 16px;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;

export default TransferSummaryLine;
