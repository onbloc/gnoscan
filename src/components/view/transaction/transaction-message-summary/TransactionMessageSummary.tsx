import React from "react";
import styled from "styled-components";

import Text from "@/components/ui/text";
import { DLWrap } from "@/components/ui/detail-page-common-styles";
import { AssetTransfer, NetTransfer, TransactionSummaryDetail } from "@/types/data-type";
import { SUMMARY_ASSET_TYPES, TransferAddress, TransferAmount, useGrc20TokenInfos } from "./transfer-render";

type TransferView = "all" | "net";
const GNOSWAP_EMISSION_PACKAGE_PATH = "gno.land/r/gnoswap/emission";

interface Props {
  summary: TransactionSummaryDetail;
  isDesktop: boolean;
}

const TransactionMessageSummary = ({ summary, isDesktop }: Props) => {
  const grc20Transfers = summary.transfers.filter(
    transfer => transfer.assetType === SUMMARY_ASSET_TYPES.GRC20 && !isGnoswapEmissionTransfer(transfer),
  );
  const grc20TransferAddresses = new Set(grc20Transfers.flatMap(transfer => [transfer.from, transfer.to]));
  const grc20NetTransfers = summary.netTransfers.filter(
    transfer =>
      transfer.assetType === SUMMARY_ASSET_TYPES.GRC20 &&
      !isGnoswapEmissionNetTransfer(transfer) &&
      grc20TransferAddresses.has(transfer.address),
  );

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

function isGnoswapEmissionTransfer(transfer: AssetTransfer): boolean {
  return (
    transfer.fromPackagePath === GNOSWAP_EMISSION_PACKAGE_PATH ||
    transfer.toPackagePath === GNOSWAP_EMISSION_PACKAGE_PATH
  );
}

function isGnoswapEmissionNetTransfer(transfer: NetTransfer): boolean {
  return transfer.packagePath === GNOSWAP_EMISSION_PACKAGE_PATH;
}

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

  const tokenInfosByTokenKey = useGrc20TokenInfos(
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
                  <Text type="p4" color="primary" fontWeight={400}>
                    From
                  </Text>
                  <TransferAddress address={transfer.from} compact />
                  <Text type="p4" color="primary" fontWeight={400}>
                    To
                  </Text>
                  <TransferAddress address={transfer.to} compact />
                  <Text type="p4" color="primary" fontWeight={400}>
                    For
                  </Text>
                  <TransferAmount transfer={transfer} tokenInfosByTokenKey={tokenInfosByTokenKey} compact />
                </li>
              ))}
            </List>
          )}

          {activeView === "net" && hasNet && (
            <List>
              {netTransfers.map((transfer, index) => (
                <li key={index}>
                  <TransferAddress address={transfer.address} compact />
                  <Text type="p4" color="primary" fontWeight={400}>
                    {transfer.direction === "received" ? "Received" : "Sent"}
                  </Text>
                  <TransferAmount transfer={transfer} tokenInfosByTokenKey={tokenInfosByTokenKey} compact />
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

// Figma places a 1px separator 16px above the GRC-20 transfer row.
const SummaryWrapper = styled.div`
  width: 100%;
  padding-top: 16px;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.dimmed100};
  border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed100};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

const Switch = styled.div`
  display: inline-flex;
  width: 206px;
  height: 32px;
  padding: 3px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 8px;

  button {
    ${({ theme }) => theme.fonts.p4};
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 0;
    border: none;
    border-radius: 6px;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.tertiary};
    cursor: pointer;
    transition: background-color 0.15s, color 0.15s;

    &.active {
      background-color: ${({ theme }) => theme.colors.base};
      color: ${({ theme }) => theme.colors.primary};
      font-weight: 400;
    }
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  width: 740px;
  max-width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 4px;
  padding: 6px 16px;
  gap: 6px;

  li {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    ${({ theme }) => theme.fonts.p4};
  }
`;

export default TransactionMessageSummary;
