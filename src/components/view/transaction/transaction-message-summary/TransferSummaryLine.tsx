import React from "react";
import styled from "styled-components";

import Text from "@/components/ui/text";
import { AssetTransfer } from "@/types/data-type";
import { TransferAddress, TransferAmount, useGrc20TokenDecimals } from "./transfer-render";

interface Props {
  transfer: AssetTransfer;
}

// The one-line "Transfer {amount} to {address}" heading shown above a message's fields
// when the whole message is nothing but a plain transfer (native send, or a GRC-20
// `Transfer` call) — sourced from the tx-level `summary.transfers` leg rather than the
// message's own args, so it stays consistent with the "All/Net Transfers" view below it.
const TransferSummaryLine = ({ transfer }: Props) => {
  const decimalsByTokenKey = useGrc20TokenDecimals(React.useMemo(() => [transfer], [transfer]));

  return (
    <Line>
      <Text type="p4" color="tertiary">
        Transfer
      </Text>
      <TransferAmount transfer={transfer} decimalsByTokenKey={decimalsByTokenKey} bold />
      <Text type="p4" color="tertiary">
        to
      </Text>
      <TransferAddress address={transfer.to} />
    </Line>
  );
};

// The field rows below this line are DLWrap dl's, which space themselves apart with
// 18px top+bottom padding each (see DLWrap in detail-page-common-styles) — but the
// first one gets its top padding zeroed out (:first-of-type), so without compensating
// here the gap to this plain (non-DLWrap) heading line would collapse to nothing.
const Line = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding-bottom: 36px;
`;

export default TransferSummaryLine;
