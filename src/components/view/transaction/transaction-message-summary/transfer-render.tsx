import React, { CSSProperties } from "react";
import Link from "next/link";
import styled from "styled-components";
import { useQueries } from "react-query";
import BigNumber from "bignumber.js";

import Text from "@/components/ui/text";
import Tooltip from "@/components/ui/tooltip";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import GNOTIcon from "@/assets/svgs/icon-gnoscan-symbol-light.svg";
import UnknownToken from "@/assets/svgs/icon-unknown-token.svg";
import { AmountText } from "@/components/ui/text/amount-text";
import { GNOTToken, useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useNetwork } from "@/common/hooks/use-network";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { textEllipsis } from "@/common/utils/string-util";
import { getFallbackTokenSymbol, getTokenKeySymbol, stripTokenKeySymbol } from "@/common/utils/token.utility";
import { ActionAsset, AssetTransfer, TransactionSummaryDetail } from "@/types/data-type";

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

interface Grc20AmountLeg {
  assetType: string;
  amount: { denom: string };
}

export const SUMMARY_ASSET_TYPES = {
  NATIVE: "native",
  GRC20: "grc20",
} as const;

export const useGrc20TokenInfos = (items: Grc20AmountLeg[]): Record<string, TokenDisplayInfo> => {
  const grc20TokenKeys = React.useMemo(() => {
    const keys = new Set<string>();
    items.forEach(item => {
      if (item.assetType === SUMMARY_ASSET_TYPES.GRC20) keys.add(item.amount.denom);
    });
    return Array.from(keys);
  }, [items]);

  return useTokenInfosByKeys(grc20TokenKeys);
};

const isGrc20AssetType = (assetType: string) => assetType.includes("/");

// The summary line's 18px/500 text uses a 28px line-height per Figma - a one-off value,
// not one of the app's shared text tokens (closest, p2, uses 26px) - so it's applied as
// an inline override rather than added to the theme for this single call site's sake.
export const SUMMARY_LINE_HEIGHT: CSSProperties = { lineHeight: "28px" };
const COMPACT_TRANSFER_LINE_HEIGHT: CSSProperties = { lineHeight: "20px" };

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

export const getTransferSummaryLines = (
  numOfMessage: number,
  summary?: TransactionSummaryDetail | null,
): AssetTransfer[] => {
  if (!summary || summary.actions.length > 0 || summary.transfers.length === 0) return [];
  if (summary.transfers.length !== numOfMessage) return [];
  if (
    !summary.transfers.every(
      transfer => transfer.assetType === SUMMARY_ASSET_TYPES.NATIVE || transfer.assetType === SUMMARY_ASSET_TYPES.GRC20,
    )
  )
    return [];

  return summary.transfers;
};

// Same symbol resolution TokenAmountDisplay uses (registry lookup, else the last "."-segment
// of the token path) - exported for callers that need just the symbol, not a full amount.
export function getTokenSymbol(tokenKey: string, tokenInfosByTokenKey: Record<string, TokenDisplayInfo>): string {
  const normalizedTokenKey = stripTokenKeySymbol(tokenKey);
  const tokenInfo = tokenInfosByTokenKey[tokenKey] || tokenInfosByTokenKey[normalizedTokenKey];
  return tokenInfo?.symbol || getFallbackTokenSymbol(tokenKey);
}

export const TransferAddress = ({
  address,
  packagePath,
  compact = false,
}: {
  address: string;
  packagePath?: string;
  compact?: boolean;
}) => {
  const { getUrlWithNetwork } = useNetwork();
  const textType = compact ? "p4" : "p2";
  const textStyle = compact ? COMPACT_TRANSFER_LINE_HEIGHT : SUMMARY_LINE_HEIGHT;

  if (!address) {
    return (
      <Text type={textType} color="primary" fontWeight={400} style={textStyle}>
        -
      </Text>
    );
  }

  return (
    <AddressChip>
      {packagePath ? (
        <RealmLink pkgPath={packagePath} compact={compact}>
          {packagePath.replace("gno.land/", "")}
        </RealmLink>
      ) : (
        <Link href={getUrlWithNetwork(`/account/${address}`)}>
          <Text type={textType} color="blue" fontWeight={400} display="contents" style={textStyle}>
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

export const RealmLink = ({
  pkgPath,
  children,
  compact = false,
}: {
  pkgPath: string;
  children: React.ReactNode;
  compact?: boolean;
}) => {
  const { getUrlWithNetwork } = useNetwork();

  return (
    <Link href={getUrlWithNetwork(`/realms/details?path=${pkgPath}`)}>
      <Text
        type={compact ? "p4" : "p2"}
        color="blue"
        fontWeight={400}
        display="contents"
        style={compact ? COMPACT_TRANSFER_LINE_HEIGHT : SUMMARY_LINE_HEIGHT}
      >
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
  compact?: boolean;
}

const TokenAmountDisplay = ({
  tokenKey,
  rawValue,
  isGrc20,
  tokenInfosByTokenKey,
  compact = false,
}: TokenAmountDisplayProps) => {
  const { getTokenAmount, getTokenImage } = useTokenMeta();
  const { getUrlWithNetwork } = useNetwork();
  const textType = compact ? "p4" : "p2";
  const lineHeight = compact ? COMPACT_TRANSFER_LINE_HEIGHT.lineHeight : SUMMARY_LINE_HEIGHT.lineHeight;

  if (!isGrc20) {
    // Native assets aren't linkable to a `/tokens/[...path]` page like GRC20 is, so the
    // symbol stays plain text here, but it still gets the same icon chip treatment.
    const displayAmount = getTokenAmount(tokenKey, rawValue);
    const imagePath = getTokenImage(tokenKey);

    return (
      <>
        <AmountText
          value={displayAmount.value}
          denom=""
          maxSize={textType}
          minSize="p4"
          fontWeight={500}
          lineHeight={lineHeight}
        />
        <TokenChip>
          <Text
            type={textType}
            color="primary"
            display="contents"
            fontWeight={500}
            style={compact ? COMPACT_TRANSFER_LINE_HEIGHT : SUMMARY_LINE_HEIGHT}
          >
            {displayAmount.denom}
          </Text>
          {imagePath ? (
            <img className="token-icon" src={imagePath} alt="" />
          ) : displayAmount.denom === GNOTToken.symbol ? (
            <GNOTIcon className="token-icon gnot-token-icon" />
          ) : (
            <UnknownToken className="token-icon" width="16" height="16" />
          )}
        </TokenChip>
      </>
    );
  }

  const normalizedTokenKey = stripTokenKeySymbol(tokenKey);
  const tokenInfo = tokenInfosByTokenKey[tokenKey] || tokenInfosByTokenKey[normalizedTokenKey];
  const symbol = tokenInfo?.symbol || getFallbackTokenSymbol(tokenKey);
  const linkTokenKey = tokenInfo?.tokenKey || (symbol ? toTokenKey(normalizedTokenKey, symbol) : tokenKey);
  const imagePath = getTokenImage(stripTokenKeySymbol(linkTokenKey));

  const decimals = tokenInfo?.decimals;
  const displayValue =
    decimals !== undefined
      ? BigNumber(rawValue).shiftedBy(-decimals).toString()
      : getTokenAmount(tokenKey, rawValue).value;

  return (
    <>
      <AmountText
        value={displayValue}
        denom=""
        maxSize={textType}
        minSize="p4"
        fontWeight={500}
        lineHeight={lineHeight}
      />
      <Link href={getUrlWithNetwork(`/tokens/${linkTokenKey}`)}>
        <TokenChip>
          <Text
            type={textType}
            color="blue"
            display="contents"
            fontWeight={500}
            style={compact ? COMPACT_TRANSFER_LINE_HEIGHT : SUMMARY_LINE_HEIGHT}
          >
            {symbol}
          </Text>
          {imagePath ? (
            <img className="token-icon" src={imagePath} alt="" />
          ) : (
            <UnknownToken className="token-icon" width="16" height="16" />
          )}
        </TokenChip>
      </Link>
    </>
  );
};

interface TransferAmountProps {
  transfer: { assetType: string; amount: { value: string; denom: string } };
  tokenInfosByTokenKey: Record<string, TokenDisplayInfo>;
  compact?: boolean;
}

export const TransferAmount = ({ transfer, tokenInfosByTokenKey, compact = false }: TransferAmountProps) => (
  <TokenAmountDisplay
    tokenKey={transfer.amount.denom}
    rawValue={transfer.amount.value}
    isGrc20={transfer.assetType === SUMMARY_ASSET_TYPES.GRC20}
    tokenInfosByTokenKey={tokenInfosByTokenKey}
    compact={compact}
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

function toTokenKey(path: string, symbol?: string): string {
  if (!symbol) return path;
  const normalizedPath = stripTokenKeySymbol(path);
  return `${normalizedPath}.${symbol}`;
}

export const AddressChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  .copy-icon {
    width: 16px;
    height: 16px;
    stroke: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    vertical-align: middle;
  }
`;

const TokenChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  .token-icon {
    width: 18px;
    height: 18px;
    border-radius: 50%;
  }
`;
