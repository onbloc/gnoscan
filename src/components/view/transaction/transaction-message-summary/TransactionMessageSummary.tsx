import React from "react";
import styled from "styled-components";

import Text from "@/components/ui/text";
import { DLWrap } from "@/components/ui/detail-page-common-styles";
import { AssetTransfer, NetTransfer, TransactionSummaryDetail } from "@/types/data-type";
import { TransferAddress, TransferAmount, useGrc20TokenDecimals } from "./transfer-render";

type TransferView = "all" | "net";

interface Props {
  summary: TransactionSummaryDetail;
  isDesktop: boolean;
}

const TransactionMessageSummary = ({ summary, isDesktop }: Props) => {
  const grc20Transfers = summary.transfers.filter(transfer => transfer.assetType === "grc20");
  const grc20NetTransfers = summary.netTransfers.filter(transfer => transfer.assetType === "grc20");

  const hasGrc20 = grc20Transfers.length > 0 || grc20NetTransfers.length > 0;

  if (!hasGrc20) return null;

  return (
    <SummaryWrapper>
      <TransferGroup
        label="GRC-20 Transferred"
        transfers={grc20Transfers}
        netTransfers={grc20NetTransfers}
        isDesktop={isDesktop}
      />
    </SummaryWrapper>
  );
};

interface TransferGroupProps {
  label: string;
  transfers: AssetTransfer[];
  netTransfers: NetTransfer[];
  isDesktop: boolean;
}

const TransferGroup = ({ label, transfers, netTransfers, isDesktop }: TransferGroupProps) => {
  const hasAll = transfers.length > 0;
  const hasNet = netTransfers.length > 0;

  const [view, setView] = React.useState<TransferView>(hasAll ? "all" : "net");

  // `view` is a user preference, not a fact about the current data: if a client-side
  // route change swaps in a tx whose transfers/netTransfers shape differs (e.g. the
  // previous tx had only "all" legs and this one has only "net" ones), a stale "all"
  // selection would satisfy neither list's render guard and show nothing. Clamp to
  // whichever view is actually valid for the current props before rendering.
  const activeView: TransferView =
    view === "all" && !hasAll && hasNet ? "net" : view === "net" && !hasNet && hasAll ? "all" : view;

  const decimalsByTokenKey = useGrc20TokenDecimals(
    React.useMemo(() => [...transfers, ...netTransfers], [transfers, netTransfers]),
  );

  return (
    <TopAlignedDLWrap desktop={isDesktop}>
      <dt>{label}</dt>
      <dd>
        <Content>
          {hasAll && hasNet && (
            <Switch>
              <button type="button" className={activeView === "all" ? "active" : ""} onClick={() => setView("all")}>
                All Transfers
              </button>
              <button type="button" className={activeView === "net" ? "active" : ""} onClick={() => setView("net")}>
                Net Transfers
              </button>
            </Switch>
          )}

          {activeView === "all" && hasAll && (
            <List>
              {transfers.map((transfer, index) => (
                <li key={index}>
                  <Text type="p4" color="primary" fontWeight={700}>
                    From
                  </Text>
                  <TransferAddress address={transfer.from} packagePath={transfer.fromPackagePath} />
                  <Text type="p4" color="primary" fontWeight={700}>
                    To
                  </Text>
                  <TransferAddress address={transfer.to} packagePath={transfer.toPackagePath} />
                  <Text type="p4" color="primary" fontWeight={700}>
                    For
                  </Text>
                  <TransferAmount transfer={transfer} decimalsByTokenKey={decimalsByTokenKey} />
                </li>
              ))}
            </List>
          )}

          {activeView === "net" && hasNet && (
            <List>
              {netTransfers.map((transfer, index) => (
                <li key={index}>
                  <TransferAddress address={transfer.address} packagePath={transfer.packagePath} />
                  <Text type="p4" color="primary" fontWeight={700}>
                    {transfer.direction === "received" ? "Received" : "Sent"}
                  </Text>
                  <TransferAmount transfer={transfer} decimalsByTokenKey={decimalsByTokenKey} />
                </li>
              ))}
            </List>
          )}
        </Content>
      </dd>
    </TopAlignedDLWrap>
  );
};

const TopAlignedDLWrap = styled(DLWrap)`
  align-items: flex-start !important;
`;

// The inner DLWrap row is always :first-of-type here, so its own top padding is zeroed.
// without padding-top below, a preceding action-summary divider would sit flush against
// the "GRC-20 Transferred" label instead of matching the normal row gap.
const SummaryWrapper = styled.div`
  width: 100%;
  padding-top: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed100};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const Switch = styled.div`
  display: inline-flex;
  padding: 3px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;

  button {
    ${({ theme }) => theme.fonts.p4};
    padding: 5px 12px;
    border: none;
    border-radius: 6px;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.tertiary};
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;

    &.active {
      background-color: ${({ theme }) => theme.colors.base};
      color: ${({ theme }) => theme.colors.primary};
      font-weight: 600;
    }
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;
  padding: 4px 16px;

  li {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 8px 0;
    ${({ theme }) => theme.fonts.p4};
  }
`;

export default TransactionMessageSummary;
