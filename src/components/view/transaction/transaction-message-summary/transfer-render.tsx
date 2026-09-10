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
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useNetwork } from "@/common/hooks/use-network";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { textEllipsis } from "@/common/utils/string-util";
import { stripTokenKeySymbol } from "@/common/utils/token.utility";

interface Grc20AmountLeg {
  assetType: string;
  amount: { denom: string };
}

// Shared by every view that lists GRC-20 legs (the "All/Net Transfers" table and a
// single-line transfer summary): resolves each distinct GRC-20 denom's decimals once,
// rather than each caller re-querying the same token.
export const useGrc20TokenDecimals = (items: Grc20AmountLeg[]): Record<string, number> => {
  const { apiTokenRepository } = useServiceProvider();
  const { currentNetwork } = useNetworkProvider();

  const grc20TokenKeys = React.useMemo(() => {
    const keys = new Set<string>();
    items.forEach(item => {
      if (item.assetType === "grc20") keys.add(item.amount.denom);
    });
    return Array.from(keys);
  }, [items]);

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

  return React.useMemo(() => {
    const map: Record<string, number> = {};
    grc20TokenKeys.forEach((tokenKey, index) => {
      const decimals = tokenQueries[index]?.data?.data?.decimals;
      if (decimals !== undefined) map[tokenKey] = decimals;
    });
    return map;
  }, [grc20TokenKeys, tokenQueries]);
};

export const TransferAddress = ({ address }: { address: string }) => {
  const { getUrlWithNetwork } = useNetwork();

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

interface TransferAmountProps {
  transfer: { assetType: string; amount: { value: string; denom: string } };
  decimalsByTokenKey: Record<string, number>;
}

export const TransferAmount = ({ transfer, decimalsByTokenKey }: TransferAmountProps) => {
  const { getTokenAmount, getTokenImage } = useTokenMeta();
  const { getUrlWithNetwork } = useNetwork();

  if (transfer.assetType !== "grc20") {
    // Native assets aren't linkable to a `/tokens/[...path]` page like GRC20 is, so the
    // symbol stays plain text here — but it still gets the same icon chip treatment.
    const displayAmount = getTokenAmount(transfer.amount.denom, transfer.amount.value);
    const imagePath = getTokenImage(transfer.amount.denom);

    return (
      <>
        <AmountText value={displayAmount.value} denom="" maxSize="p4" minSize="body2" />
        <TokenChip>
          {imagePath ? (
            <img className="token-icon" src={imagePath} alt="" />
          ) : (
            <UnknownToken className="token-icon" width="16" height="16" />
          )}
          <Text type="p4" color="primary" display="contents">
            {displayAmount.denom}
          </Text>
        </TokenChip>
      </>
    );
  }

  // The API's denom for a GRC20 leg already comes as `pkgPath.SYMBOL` (e.g.
  // "gno.land/r/gnoswap/gns.GNS"), which is exactly the key `/tokens/[...path]`
  // expects — so it doubles as both the link target and the display symbol,
  // regardless of whether this token happens to be in the local token-meta cache.
  const tokenKey = transfer.amount.denom;
  const lastSegment = tokenKey.split("/").pop() || tokenKey;
  const symbol = lastSegment.includes(".") ? lastSegment.slice(lastSegment.lastIndexOf(".") + 1) : lastSegment;
  // Unlike `getTokenInfo`/`getTokenAmount`, `getTokenImage` does a single-key lookup
  // with no fallback to the stripped pkgPath — pass it the stripped key directly so a
  // `pkgPath.SYMBOL` denom still matches a token-meta id stored as plain `pkgPath`.
  const imagePath = getTokenImage(stripTokenKeySymbol(transfer.amount.denom));

  const decimals = decimalsByTokenKey[tokenKey];
  const displayValue =
    decimals !== undefined
      ? BigNumber(transfer.amount.value).shiftedBy(-decimals).toString()
      : getTokenAmount(transfer.amount.denom, transfer.amount.value).value;

  return (
    <>
      <AmountText value={displayValue} denom="" maxSize="p4" minSize="body2" />
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
