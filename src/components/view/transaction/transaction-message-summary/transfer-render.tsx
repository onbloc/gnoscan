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
import { ActionAsset, AssetTransfer, TransactionSummaryDetail } from "@/types/data-type";

// A tx is "just a transfer" when there's nothing else to summarize separately (no
// parsed actions) and exactly one transfer leg — regardless of which message shape
// produced it (bank send, a plain grc20 Transfer call, or a vm.m_run script that just
// does a transfer under the hood).
export const getSingleTransferSummary = (
  numOfMessage: number,
  summary?: TransactionSummaryDetail | null,
): AssetTransfer | null => {
  if (numOfMessage !== 1 || !summary || summary.actions.length > 0 || summary.transfers.length !== 1) return null;

  return summary.transfers[0];
};

export interface TokenDisplayInfo {
  decimals?: number;
  symbol?: string;
  tokenKey?: string;
}

export const useTokenInfosByKeys = (tokenKeys: string[]): Record<string, TokenDisplayInfo> => {
  const { apiTokenRepository } = useServiceProvider();
  const { currentNetwork } = useNetworkProvider();

  const queryKeys = React.useMemo(() => getTokenInfoQueryKeys(tokenKeys), [tokenKeys]);

  const tokenQueries = useQueries(
    queryKeys.map(tokenKey => ({
      queryKey: [currentNetwork?.chainId || "", "transferSummaryTokenDecimals", tokenKey],
      queryFn: () => {
        if (!apiTokenRepository) return Promise.reject(new Error("FAILED_INITIALIZE_REPOSITORY"));
        return apiTokenRepository.getTokenMetaByPath(tokenKey);
      },
      enabled: !!apiTokenRepository,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    })),
  );

  return React.useMemo(() => {
    const map: Record<string, TokenDisplayInfo> = {};
    queryKeys.forEach((tokenKey, index) => {
      const token = tokenQueries[index]?.data?.data;
      if (!token) return;

      map[tokenKey] = {
        decimals: token.decimals,
        symbol: token.symbol,
        tokenKey: toTokenKey(token.path || tokenKey, token.symbol),
      };
    });

    return withTokenKeyAliases(map, tokenKeys);
  }, [tokenKeys, queryKeys, tokenQueries]);
};

export const useTokenDecimalsByKeys = (tokenKeys: string[]): Record<string, number> => {
  const tokenInfos = useTokenInfosByKeys(tokenKeys);

  return React.useMemo(() => {
    const map: Record<string, number> = {};
    Object.entries(tokenInfos).forEach(([tokenKey, tokenInfo]) => {
      if (tokenInfo.decimals !== undefined) map[tokenKey] = tokenInfo.decimals;
    });
    return map;
  }, [tokenInfos]);
};

interface Grc20AmountLeg {
  assetType: string;
  amount: { denom: string };
}

export const useGrc20TokenDecimals = (items: Grc20AmountLeg[]): Record<string, number> => {
  const grc20TokenKeys = React.useMemo(() => {
    const keys = new Set<string>();
    items.forEach(item => {
      if (item.assetType === "grc20") keys.add(item.amount.denom);
    });
    return Array.from(keys);
  }, [items]);

  return useTokenDecimalsByKeys(grc20TokenKeys);
};

const isGrc20AssetType = (assetType: string) => assetType.includes("/");

export const useActionTokenInfos = (actions: { assets: ActionAsset[] }[]) => {
  const tokenKeys = React.useMemo(() => {
    const keys = new Set<string>();
    actions.forEach(action => {
      action.assets.forEach(asset => {
        if (asset.key.startsWith("amount") && isGrc20AssetType(asset.assetType)) keys.add(asset.assetType);
        // createPool's "pool" asset is the raw "token0Path:token1Path:fee" pool path - its
        // token pair has no amount leg to key off, so pull them out here too.
        if (asset.key === "pool") {
          asset.value
            .split(":")
            .slice(0, 2)
            .forEach(tokenPath => {
              if (isGrc20AssetType(tokenPath)) keys.add(tokenPath);
            });
        }
      });
    });
    return Array.from(keys);
  }, [actions]);

  return useTokenInfosByKeys(tokenKeys);
};

// Same symbol resolution TokenAmountDisplay uses (registry lookup, else the last "."-segment
// of the token path) - exported for callers that need just the symbol, not a full amount.
export function getTokenSymbol(tokenKey: string, tokenInfosByTokenKey: Record<string, TokenDisplayInfo>): string {
  const normalizedTokenKey = stripTokenKeySymbol(tokenKey);
  const tokenInfo = tokenInfosByTokenKey[tokenKey] || tokenInfosByTokenKey[normalizedTokenKey];
  const lastSegment = tokenKey.split("/").pop() || tokenKey;
  const fallbackSymbol = lastSegment.includes(".") ? lastSegment.slice(lastSegment.lastIndexOf(".") + 1) : lastSegment;
  return tokenInfo?.symbol || fallbackSymbol;
}

export const TransferAddress = ({ address, packagePath }: { address: string; packagePath?: string }) => {
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
      {packagePath ? (
        <RealmLink pkgPath={packagePath}>{packagePath.replace("gno.land/", "")}</RealmLink>
      ) : (
        <Link href={getUrlWithNetwork(`/account/${address}`)}>
          <Text type="p4" color="blue" display="contents">
            {textEllipsis(address, 6)}
          </Text>
        </Link>
      )}
      <Tooltip content="Copied!" trigger="click" copyText={address}>
        <IconCopy className="copy-icon" />
      </Tooltip>
    </AddressChip>
  );
};

export const RealmLink = ({ pkgPath, children }: { pkgPath: string; children: React.ReactNode }) => {
  const { getUrlWithNetwork } = useNetwork();

  return (
    <Link href={getUrlWithNetwork(`/realms/details?path=${pkgPath}`)}>
      <Text type="p4" color="blue" display="contents">
        {children}
      </Text>
    </Link>
  );
};

interface TokenAmountDisplayProps {
  tokenKey: string;
  rawValue: string;
  isGrc20: boolean;
  tokenInfosByTokenKey: Record<string, TokenDisplayInfo>;
  bold?: boolean;
}

const TokenAmountDisplay = ({ tokenKey, rawValue, isGrc20, tokenInfosByTokenKey, bold }: TokenAmountDisplayProps) => {
  const { getTokenAmount, getTokenImage } = useTokenMeta();
  const { getUrlWithNetwork } = useNetwork();

  if (!isGrc20) {
    // Native assets aren't linkable to a `/tokens/[...path]` page like GRC20 is, so the
    // symbol stays plain text here, but it still gets the same icon chip treatment.
    const displayAmount = getTokenAmount(tokenKey, rawValue);
    const imagePath = getTokenImage(tokenKey);

    return (
      <>
        <AmountText value={displayAmount.value} denom="" maxSize="p4" minSize="body2" bold={bold} />
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

  const normalizedTokenKey = stripTokenKeySymbol(tokenKey);
  const tokenInfo = tokenInfosByTokenKey[tokenKey] || tokenInfosByTokenKey[normalizedTokenKey];
  const lastSegment = tokenKey.split("/").pop() || tokenKey;
  const fallbackSymbol = lastSegment.includes(".") ? lastSegment.slice(lastSegment.lastIndexOf(".") + 1) : lastSegment;
  const symbol = tokenInfo?.symbol || fallbackSymbol;
  const linkTokenKey = tokenInfo?.tokenKey || (symbol ? toTokenKey(normalizedTokenKey, symbol) : tokenKey);
  const imagePath = getTokenImage(stripTokenKeySymbol(linkTokenKey));

  const decimals = tokenInfo?.decimals;
  const displayValue =
    decimals !== undefined
      ? BigNumber(rawValue).shiftedBy(-decimals).toString()
      : getTokenAmount(tokenKey, rawValue).value;

  return (
    <>
      <AmountText value={displayValue} denom="" maxSize="p4" minSize="body2" bold={bold} />
      <Link href={getUrlWithNetwork(`/tokens/${linkTokenKey}`)}>
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

interface TransferAmountProps {
  transfer: { assetType: string; amount: { value: string; denom: string } };
  decimalsByTokenKey: Record<string, number>;
  bold?: boolean;
}

export const TransferAmount = ({ transfer, decimalsByTokenKey, bold }: TransferAmountProps) => (
  <TokenAmountDisplay
    tokenKey={transfer.amount.denom}
    rawValue={transfer.amount.value}
    isGrc20={transfer.assetType === "grc20"}
    tokenInfosByTokenKey={toTokenInfos(decimalsByTokenKey)}
    bold={bold}
  />
);

interface ActionAmountProps {
  asset: ActionAsset;
  tokenInfosByTokenKey: Record<string, TokenDisplayInfo>;
}

export const ActionAmount = ({ asset, tokenInfosByTokenKey }: ActionAmountProps) => (
  <TokenAmountDisplay
    tokenKey={asset.assetType}
    rawValue={asset.value}
    isGrc20={isGrc20AssetType(asset.assetType)}
    tokenInfosByTokenKey={tokenInfosByTokenKey}
  />
);

const toTokenInfos = (decimalsByTokenKey: Record<string, number>): Record<string, TokenDisplayInfo> =>
  Object.fromEntries(Object.entries(decimalsByTokenKey).map(([tokenKey, decimals]) => [tokenKey, { decimals }]));

function getTokenInfoQueryKeys(tokenKeys: string[]): string[] {
  const keys = new Set<string>();
  tokenKeys.forEach(tokenKey => {
    keys.add(tokenKey);
    keys.add(stripTokenKeySymbol(tokenKey));
  });
  return Array.from(keys);
}

function withTokenKeyAliases(
  tokenInfosByTokenKey: Record<string, TokenDisplayInfo>,
  tokenKeys: string[],
): Record<string, TokenDisplayInfo> {
  const map = { ...tokenInfosByTokenKey };

  tokenKeys.forEach(tokenKey => {
    const normalizedTokenKey = stripTokenKeySymbol(tokenKey);
    const sourceInfo = map[tokenKey];
    const currentInfo = map[normalizedTokenKey];
    const symbol = getTokenKeySymbol(tokenKey);
    if (!sourceInfo && !symbol) return;

    map[normalizedTokenKey] = {
      ...sourceInfo,
      ...currentInfo,
      symbol: currentInfo?.symbol || sourceInfo?.symbol || symbol,
      tokenKey: currentInfo?.tokenKey || sourceInfo?.tokenKey || toTokenKey(normalizedTokenKey, symbol),
    };
  });

  return map;
}

function getTokenKeySymbol(tokenKey: string): string {
  const lastSegment = tokenKey.split("/").pop() || "";
  const dotIndex = lastSegment.lastIndexOf(".");
  return dotIndex === -1 ? "" : lastSegment.slice(dotIndex + 1);
}

function toTokenKey(path: string, symbol?: string): string {
  if (!symbol) return path;
  const normalizedPath = stripTokenKeySymbol(path);
  return `${normalizedPath}.${symbol}`;
}

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
