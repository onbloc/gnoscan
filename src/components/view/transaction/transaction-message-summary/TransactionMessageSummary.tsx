import React from "react";
import Link from "next/link";
import styled from "styled-components";
import { useQueries } from "react-query";
import BigNumber from "bignumber.js";

import Text from "@/components/ui/text";
import Tooltip from "@/components/ui/tooltip";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import UnknownToken from "@/assets/svgs/icon-unknown-token.svg";
import { AmountText } from "@/components/ui/text/amount-text";
import { DLWrap } from "@/components/ui/detail-page-common-styles";
import { BadgeList, Field } from "@/components/view/transaction/common";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useNetwork } from "@/common/hooks/use-network";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { textEllipsis } from "@/common/utils/string-util";
import { AssetTransfer, NetTransfer, TransactionSummaryDetail } from "@/types/data-type";

type TransferView = "all" | "net";

interface Props {
  summary: TransactionSummaryDetail;
  isDesktop: boolean;
}

const TransactionMessageSummary = ({ summary, isDesktop }: Props) => {
  const hasTypes = summary.types.length > 0;

  const nativeTransfers = summary.transfers.filter(transfer => transfer.assetType !== "grc20");
  const grc20Transfers = summary.transfers.filter(transfer => transfer.assetType === "grc20");
  const nativeNetTransfers = summary.netTransfers.filter(transfer => transfer.assetType !== "grc20");
  const grc20NetTransfers = summary.netTransfers.filter(transfer => transfer.assetType === "grc20");

  const hasNative = nativeTransfers.length > 0 || nativeNetTransfers.length > 0;
  const hasGrc20 = grc20Transfers.length > 0 || grc20NetTransfers.length > 0;

  if (!hasTypes && !hasNative && !hasGrc20) return null;

  return (
    <SummaryWrapper>
      {hasTypes && (
        <Field label="Types" isDesktop={isDesktop}>
          <BadgeList items={summary.types} />
        </Field>
      )}
      {hasGrc20 && (
        <TransferGroup
          label="Tokens Transferred"
          transfers={grc20Transfers}
          netTransfers={grc20NetTransfers}
          isDesktop={isDesktop}
        />
      )}
      {hasNative && (
        <TransferGroup
          label="Internal Transactions"
          transfers={nativeTransfers}
          netTransfers={nativeNetTransfers}
          isDesktop={isDesktop}
        />
      )}
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

  const { getTokenAmount, getTokenImage } = useTokenMeta();
  const { getUrlWithNetwork } = useNetwork();
  const { apiTokenRepository } = useServiceProvider();
  const { currentNetwork } = useNetworkProvider();

  const grc20TokenKeys = React.useMemo(() => {
    const keys = new Set<string>();
    transfers.forEach(transfer => {
      if (transfer.assetType === "grc20") keys.add(transfer.amount.denom);
    });
    netTransfers.forEach(transfer => {
      if (transfer.assetType === "grc20") keys.add(transfer.amount.denom);
    });
    return Array.from(keys);
  }, [transfers, netTransfers]);

  const tokenQueries = useQueries(
    grc20TokenKeys.map(tokenKey => ({
      queryKey: [currentNetwork?.chainId || "", "transferSummaryTokenDecimals", tokenKey],
      queryFn: () => {
        if (!apiTokenRepository) return Promise.reject(new Error("FAILED_INITIALIZE_REPOSITORY"));
        return apiTokenRepository.getToken(tokenKey);
      },
      enabled: !!apiTokenRepository,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    })),
  );

  const decimalsByTokenKey = React.useMemo(() => {
    const map: Record<string, number> = {};
    grc20TokenKeys.forEach((tokenKey, index) => {
      const decimals = tokenQueries[index]?.data?.data?.decimals;
      if (decimals !== undefined) map[tokenKey] = decimals;
    });
    return map;
  }, [grc20TokenKeys, tokenQueries]);

  const renderAddress = (address: string) => {
    if (!address) {
      return (
        <Text type="p4" color="primary">
          -
        </Text>
      );
    }

    return (
      <AddressChip>
        <Link href={getUrlWithNetwork(`/account/${address}`)}>
          <Text type="p4" color="blue" display="contents">
            {textEllipsis(address, 6)}
          </Text>
        </Link>
        <Tooltip content="Copied!" trigger="click" copyText={address}>
          <IconCopy className="copy-icon" />
        </Tooltip>
      </AddressChip>
    );
  };

  const renderAmount = (transfer: { assetType: string; amount: { value: string; denom: string } }) => {
    if (transfer.assetType !== "grc20") {
      const displayAmount = getTokenAmount(transfer.amount.denom, transfer.amount.value);
      return <AmountText value={displayAmount.value} denom={displayAmount.denom} maxSize="p4" minSize="p4" />;
    }

    // The API's denom for a GRC20 leg already comes as `pkgPath.SYMBOL` (e.g.
    // "gno.land/r/gnoswap/gns.GNS"), which is exactly the key `/tokens/[...path]`
    // expects — so it doubles as both the link target and the display symbol,
    // regardless of whether this token happens to be in the local token-meta cache.
    const tokenKey = transfer.amount.denom;
    const lastSegment = tokenKey.split("/").pop() || tokenKey;
    const symbol = lastSegment.includes(".") ? lastSegment.slice(lastSegment.lastIndexOf(".") + 1) : lastSegment;
    const imagePath = getTokenImage(transfer.amount.denom);

    const decimals = decimalsByTokenKey[tokenKey];
    const displayValue =
      decimals !== undefined
        ? BigNumber(transfer.amount.value).shiftedBy(-decimals).toString()
        : getTokenAmount(transfer.amount.denom, transfer.amount.value).value;

    return (
      <>
        <AmountText value={displayValue} denom="" maxSize="p4" minSize="p4" />
        <Link href={getUrlWithNetwork(`/tokens/${tokenKey}`)}>
          <TokenChip>
            {imagePath ? (
              <img className="token-icon" src={imagePath} alt="" />
            ) : (
              <UnknownToken className="token-icon" width="16" height="16" />
            )}
            <Text type="p4" color="blue" display="contents">
              {symbol}
            </Text>
          </TokenChip>
        </Link>
      </>
    );
  };

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
                  {renderAddress(transfer.from)}
                  <Text type="p4" color="primary" fontWeight={700}>
                    To
                  </Text>
                  {renderAddress(transfer.to)}
                  <Text type="p4" color="primary" fontWeight={700}>
                    For
                  </Text>
                  {renderAmount(transfer)}
                </li>
              ))}
            </List>
          )}

          {activeView === "net" && hasNet && (
            <List>
              {netTransfers.map((transfer, index) => (
                <li key={index}>
                  {renderAddress(transfer.address)}
                  <Text type="p4" color="primary" fontWeight={700}>
                    {transfer.direction === "received" ? "Received" : "Sent"}
                  </Text>
                  {renderAmount(transfer)}
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

const SummaryWrapper = styled.div`
  width: 100%;
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

  li {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 8px 0;
    ${({ theme }) => theme.fonts.p4};
  }
`;

const AddressChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;

  .copy-icon {
    width: 14px;
    height: 14px;
    stroke: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    vertical-align: middle;
  }
`;

const TokenChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 2px;

  .token-icon {
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }
`;

export default TransactionMessageSummary;
