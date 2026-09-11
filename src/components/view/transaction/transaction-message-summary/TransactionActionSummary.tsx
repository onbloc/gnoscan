import React from "react";
import styled from "styled-components";

import Text from "@/components/ui/text";
import { GNOSWAP_APP_BASE_URL } from "@/common/values/constant-value";
import { formatTokenDecimal } from "@/common/utils/token.utility";
import { ActionAsset, TransactionAction } from "@/types/data-type";
import {
  ActionAmount,
  RealmLink,
  TokenDisplayInfo,
  TransferAddress,
  getTokenSymbol,
  useActionTokenInfos,
} from "./transfer-render";

interface Props {
  actions: TransactionAction[];
}

const TransactionActionSummary = ({ actions }: Props) => {
  const displayActions = React.useMemo(() => dedupeActions(actions), [actions]);
  const tokenInfosByTokenKey = useActionTokenInfos(displayActions);

  if (displayActions.length === 0) return null;

  const numbered = displayActions.length > 1;

  return (
    <Wrapper>
      {displayActions.map((action, index) => (
        <ActionLine key={index}>
          {numbered && (
            <Text type="p4" color="tertiary">
              {`${index + 1}.`}
            </Text>
          )}
          {renderActionSentence(action, tokenInfosByTokenKey)}
        </ActionLine>
      ))}
    </Wrapper>
  );
};

const findAsset = (assets: ActionAsset[], key: string) => assets.find(asset => asset.key === key);
const amountAssets = (assets: ActionAsset[]) => assets.filter(asset => asset.key === "amount");
const amountInAssets = (assets: ActionAsset[]) => assets.filter(asset => asset.key === "amountIn");
const amountOutAssets = (assets: ActionAsset[]) => assets.filter(asset => asset.key === "amountOut");

const Ref = ({ label, value, href }: { label?: string; value: string; href?: string }) => {
  const text = (
    <Text type="p4" color="blue" display="contents">
      {label ? `${label} #${value}` : `#${value}`}
    </Text>
  );

  if (!href) return text;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {text}
    </a>
  );
};

// gnoscan has no page of its own for a pool/position - link out to gnoswap's app pool page
// instead (it has no separate per-position page). poolPath must be the pool's own canonical
// "token0Path:token1Path:fee" (sorted the way gnoswap itself sorts it), so this is only safe to
// build from a token pair that came from the pool's own on-chain path - see buildPoolPath.
const gnoswapPoolUrl = (poolPath: string) =>
  `${GNOSWAP_APP_BASE_URL}/earn/pool?poolPath=${encodeURIComponent(poolPath)}`;

// Only buildable when both position tokens are present - a single-sided add/remove drops the
// zero-amount side entirely (see onbloc-api-v3's nonZeroAssets), leaving no way to recover its
// path, so this deliberately returns null rather than guessing.
const buildPoolPath = (tokens: ActionAsset[], fee: ActionAsset | undefined): string | null => {
  if (tokens.length !== 2 || !fee) return null;
  return `${tokens[0].assetType}:${tokens[1].assetType}:${fee.value}`;
};

// stake/unstake/collectReward move no token amount of their own, so the backend gives the pool's
// poolPath directly (already "token0Path:token1Path:fee") instead of separate amount assets.
const poolHref = (pool: ActionAsset | undefined) => (pool ? gnoswapPoolUrl(pool.value) : undefined);

const Plain = ({ children }: { children: React.ReactNode }) => (
  <Text type="p4" color="primary" fontWeight={700} display="contents">
    {children}
  </Text>
);

const Verb = ({ children }: { children: React.ReactNode }) => (
  <Text type="p4" color="tertiary">
    {children}
  </Text>
);

// Pool fee tiers are raw hundredths-of-a-bip units (e.g. "3000" = 0.3%), same as gnoswap itself
// uses - see onbloc-api-v3's gnoswap/pool.go.
const formatFeePercent = (fee: string) => `${formatTokenDecimal(fee, 4)}%`;

const PoolFeeClause = ({ fee, pairLabel }: { fee: string; pairLabel?: string }) => (
  <>
    <Verb>{pairLabel ? "in" : "in a"}</Verb>
    {pairLabel && <Plain>{pairLabel}</Plain>}
    <Plain>{formatFeePercent(fee)}</Plain>
    <Verb>pool</Verb>
  </>
);

// "gno.land/r/gnoswap/staker/v1" -> "r/gnoswap/staker/v1" - same trim as TransferAddress's realm
// display, minus the everywhere-repeated "gno.land" prefix.
const ViaRealmClause = ({ realm }: { realm: string }) => (
  <>
    <Verb>via</Verb>
    <RealmLink pkgPath={realm}>{realm.replace("gno.land/", "")}</RealmLink>
  </>
);

// stake/unstake/collectReward have no amount to show a token pair through (see poolHref above),
// so PoolFeeClause needs the pair spelled out explicitly there - addLiquidity/removeLiquidity/
// collectFee/reposition already show it via their token amounts, so they pass no pairLabel.
const poolPairLabel = (
  pool: ActionAsset | undefined,
  tokenInfosByTokenKey: Record<string, TokenDisplayInfo>,
): string | undefined => {
  if (!pool) return undefined;
  const [token0Path, token1Path] = pool.value.split(":");
  if (!token0Path || !token1Path) return undefined;
  return `${getTokenSymbol(token0Path, tokenInfosByTokenKey)}/${getTokenSymbol(token1Path, tokenInfosByTokenKey)}`;
};

function renderActionSentence(
  action: TransactionAction,
  tokenInfosByTokenKey: Record<string, TokenDisplayInfo>,
): React.ReactNode {
  const { type, assets, tag, realm } = action;
  const amount = (asset: ActionAsset) => <ActionAmount asset={asset} tokenInfosByTokenKey={tokenInfosByTokenKey} />;

  switch (type) {
    case "swap": {
      const [from] = amountInAssets(assets);
      const [to] = amountOutAssets(assets);
      if (!from || !to) break;
      return (
        <>
          <Verb>Swap</Verb>
          {amount(from)}
          <Verb>for</Verb>
          {amount(to)}
        </>
      );
    }
    case "approve": {
      const [approvedAmount] = amountAssets(assets);
      const spender = findAsset(assets, "spender");
      if (!approvedAmount || !spender) break;
      return (
        <>
          <Verb>Approve</Verb>
          {amount(approvedAmount)}
          <Verb>for</Verb>
          <TransferAddress address={spender.value} packagePath={spender.packagePath} />
        </>
      );
    }
    case "mint": {
      if (tag === "grc721") {
        const tokenId = findAsset(assets, "tokenId");
        if (!tokenId) break;
        return (
          <>
            <Verb>Mint NFT</Verb>
            <Ref value={tokenId.value} />
          </>
        );
      }
      const [mintedAmount] = amountAssets(assets);
      if (!mintedAmount) break;
      return (
        <>
          <Verb>Mint</Verb>
          {amount(mintedAmount)}
        </>
      );
    }
    case "burn": {
      if (tag === "grc721") {
        const tokenId = findAsset(assets, "tokenId");
        if (!tokenId) break;
        return (
          <>
            <Verb>Burn NFT</Verb>
            <Ref value={tokenId.value} />
          </>
        );
      }
      const [burnedAmount] = amountAssets(assets);
      if (!burnedAmount) break;
      return (
        <>
          <Verb>Burn</Verb>
          {amount(burnedAmount)}
        </>
      );
    }
    case "addLiquidity":
    case "reposition": {
      const tokens = amountAssets(assets);
      const position = findAsset(assets, "position");
      const fee = findAsset(assets, "fee");
      if (tokens.length === 0 || !position) break;
      const poolPath = buildPoolPath(tokens, fee);
      return (
        <>
          <Verb>{type === "reposition" ? "Reposition" : "Add liquidity"}</Verb>
          {joinAmounts(tokens, amount)}
          <Verb>to</Verb>
          <Ref label="position" value={position.value} href={poolPath ? gnoswapPoolUrl(poolPath) : undefined} />
          {fee && <PoolFeeClause fee={fee.value} />}
          <ViaRealmClause realm={realm} />
        </>
      );
    }
    case "removeLiquidity": {
      const tokens = amountAssets(assets);
      const position = findAsset(assets, "position");
      const fee = findAsset(assets, "fee");
      if (tokens.length === 0 || !position) break;
      const poolPath = buildPoolPath(tokens, fee);
      return (
        <>
          <Verb>Remove liquidity</Verb>
          {joinAmounts(tokens, amount)}
          <Verb>from</Verb>
          <Ref label="position" value={position.value} href={poolPath ? gnoswapPoolUrl(poolPath) : undefined} />
          {fee && <PoolFeeClause fee={fee.value} />}
          <ViaRealmClause realm={realm} />
        </>
      );
    }
    case "collectFee": {
      const tokens = amountAssets(assets);
      const position = findAsset(assets, "position");
      const fee = findAsset(assets, "fee");
      if (tokens.length === 0 || !position) break;
      const poolPath = buildPoolPath(tokens, fee);
      return (
        <>
          <Verb>Collect fee</Verb>
          {joinAmounts(tokens, amount)}
          <Verb>from</Verb>
          <Ref label="position" value={position.value} href={poolPath ? gnoswapPoolUrl(poolPath) : undefined} />
          {fee && <PoolFeeClause fee={fee.value} />}
          <ViaRealmClause realm={realm} />
        </>
      );
    }
    case "stake": {
      const position = findAsset(assets, "position");
      if (!position) break;
      const pool = findAsset(assets, "pool");
      const fee = findAsset(assets, "fee");
      return (
        <>
          <Verb>Stake</Verb>
          <Ref label="position" value={position.value} href={poolHref(pool)} />
          {fee && <PoolFeeClause fee={fee.value} pairLabel={poolPairLabel(pool, tokenInfosByTokenKey)} />}
          <ViaRealmClause realm={realm} />
        </>
      );
    }
    case "unstake": {
      const position = findAsset(assets, "position");
      if (!position) break;
      const pool = findAsset(assets, "pool");
      const fee = findAsset(assets, "fee");
      return (
        <>
          <Verb>Unstake</Verb>
          <Ref label="position" value={position.value} href={poolHref(pool)} />
          {fee && <PoolFeeClause fee={fee.value} pairLabel={poolPairLabel(pool, tokenInfosByTokenKey)} />}
          <ViaRealmClause realm={realm} />
        </>
      );
    }
    case "collectReward": {
      const [reward] = amountAssets(assets);
      const position = findAsset(assets, "position");
      if (!reward || !position) break;
      const pool = findAsset(assets, "pool");
      const fee = findAsset(assets, "fee");
      return (
        <>
          <Verb>Collect reward</Verb>
          {amount(reward)}
          <Verb>from</Verb>
          <Ref label="position" value={position.value} href={poolHref(pool)} />
          {fee && <PoolFeeClause fee={fee.value} pairLabel={poolPairLabel(pool, tokenInfosByTokenKey)} />}
          <ViaRealmClause realm={realm} />
        </>
      );
    }
    case "createExternalIncentive": {
      const [reward, bond] = amountAssets(assets);
      const incentive = findAsset(assets, "incentive");
      if (!reward || !bond || !incentive) break;
      return (
        <>
          <Verb>Create incentive</Verb>
          <Ref value={incentive.value} />
          <Verb>with</Verb>
          {amount(reward)}
          <Verb>(+</Verb>
          {amount(bond)}
          <Verb>bond)</Verb>
        </>
      );
    }
    case "createProject": {
      const [token] = amountAssets(assets);
      const project = findAsset(assets, "project");
      if (!token || !project) break;
      return (
        <>
          <Verb>Create project</Verb>
          <Ref value={project.value} />
          <Verb>with</Verb>
          {amount(token)}
        </>
      );
    }
    case "depositGns": {
      const [gns] = amountAssets(assets);
      const deposit = findAsset(assets, "deposit");
      if (!gns || !deposit) break;
      return (
        <>
          <Verb>Deposit</Verb>
          {amount(gns)}
          <Verb>(deposit</Verb>
          <Ref value={deposit.value} />
          <Verb>)</Verb>
        </>
      );
    }
    case "collectDepositGns": {
      const [gns] = amountAssets(assets);
      const deposit = findAsset(assets, "deposit");
      if (!gns || !deposit) break;
      return (
        <>
          <Verb>Withdraw</Verb>
          {amount(gns)}
          <Verb>from deposit</Verb>
          <Ref value={deposit.value} />
        </>
      );
    }
    case "collectDepositReward": {
      const [reward] = amountAssets(assets);
      const deposit = findAsset(assets, "deposit");
      if (!reward || !deposit) break;
      return (
        <>
          <Verb>Collect reward</Verb>
          {amount(reward)}
          <Verb>from deposit</Verb>
          <Ref value={deposit.value} />
        </>
      );
    }
    case "createPool": {
      const pool = findAsset(assets, "pool");
      const fee = findAsset(assets, "fee");
      if (!pool || !fee) break;
      const [token0Path, token1Path] = pool.value.split(":");
      if (!token0Path || !token1Path) break;
      const pairLabel = `${getTokenSymbol(token0Path, tokenInfosByTokenKey)}/${getTokenSymbol(
        token1Path,
        tokenInfosByTokenKey,
      )}`;
      return (
        <>
          <Verb>Create pool</Verb>
          <a href={gnoswapPoolUrl(pool.value)} target="_blank" rel="noopener noreferrer">
            <Text type="p4" color="blue" display="contents">
              {pairLabel}
            </Text>
          </a>
          <Plain>{formatFeePercent(fee.value)}</Plain>
          <Verb>pool</Verb>
          <ViaRealmClause realm={realm} />
        </>
      );
    }
    case "delegate": {
      const [gns] = amountAssets(assets);
      if (!gns) break;
      return (
        <>
          <Verb>Delegate</Verb>
          {amount(gns)}
        </>
      );
    }
    case "undelegate":
      return <Verb>Undelegate</Verb>;
    case "redelegate":
      return <Verb>Redelegate</Verb>;
    case "collectEmissionReward": {
      const [gns] = amountAssets(assets);
      if (!gns) break;
      return (
        <>
          <Verb>Collect emission reward</Verb>
          {amount(gns)}
        </>
      );
    }
    case "collectProtocolFeeReward": {
      const [token] = amountAssets(assets);
      if (!token) break;
      return (
        <>
          <Verb>Collect protocol fee reward</Verb>
          {amount(token)}
        </>
      );
    }
    case "collectUndelegatedGns": {
      const [gns] = amountAssets(assets);
      if (!gns) break;
      return (
        <>
          <Verb>Collect undelegated</Verb>
          {amount(gns)}
        </>
      );
    }
    case "propose": {
      const proposal = findAsset(assets, "proposal");
      if (!proposal) break;
      return (
        <>
          <Verb>Create proposal</Verb>
          <Ref value={proposal.value} />
        </>
      );
    }
    case "vote": {
      const proposal = findAsset(assets, "proposal");
      if (!proposal) break;
      return (
        <>
          <Verb>Vote on proposal</Verb>
          <Ref value={proposal.value} />
        </>
      );
    }
    case "execute": {
      const proposal = findAsset(assets, "proposal");
      if (!proposal) break;
      return (
        <>
          <Verb>Execute proposal</Verb>
          <Ref value={proposal.value} />
        </>
      );
    }
    case "cancel": {
      const proposal = findAsset(assets, "proposal");
      if (!proposal) break;
      return (
        <>
          <Verb>Cancel proposal</Verb>
          <Ref value={proposal.value} />
        </>
      );
    }
    case "deploy": {
      const packageName = findAsset(assets, "packageName");
      const creator = findAsset(assets, "creator");
      if (!packageName || !creator) break;
      return (
        <>
          <Verb>Deploy</Verb>
          <RealmLink pkgPath={packageName.assetType}>{packageName.value}</RealmLink>
          <Verb>by</Verb>
          <TransferAddress address={creator.value} packagePath={creator.packagePath} />
        </>
      );
    }
  }

  return <Verb>{type}</Verb>;
}

function dedupeActions(actions: TransactionAction[]): TransactionAction[] {
  const seen = new Set<string>();

  return actions.filter(action => {
    const key = `${action.realm}:${action.type}:${action.assets
      .map(asset => `${asset.assetType}:${asset.key}:${asset.value}`)
      .join("|")}`;

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function joinAmounts(assets: ActionAsset[], renderAmount: (asset: ActionAsset) => React.ReactNode): React.ReactNode[] {
  return assets.map((asset, index) => (
    <React.Fragment key={`${asset.assetType}-${asset.key}-${asset.value}-${index}`}>
      {index > 0 && <Verb>+</Verb>}
      {renderAmount(asset)}
    </React.Fragment>
  ));
}

// The parent tab pane lays its children out with align-items: flex-start (see
// DetailsContainer), so without an explicit width this box and its border-bottom
// would only span its own content instead of the full row width like every other field.
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed100};
`;

const ActionLine = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;

export default TransactionActionSummary;
