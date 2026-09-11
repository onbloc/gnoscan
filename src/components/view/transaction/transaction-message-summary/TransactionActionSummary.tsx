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

// Blue only when it's an actual link (href) - an unlinked reference is just a specific value,
// same as any other Plain, not something a user could click through.
const Ref = ({ label, value, href }: { label?: string; value: string; href?: string }) => {
  const text = (
    <Text type="p4" color={href ? "blue" : "primary"} display="contents">
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
// instead (it has no separate per-position page).
const gnoswapPoolUrl = (poolPath: string) =>
  `${GNOSWAP_APP_BASE_URL}/earn/pool?poolPath=${encodeURIComponent(poolPath)}`;

// Every pool/position action carries its own canonical "pool" asset (already the on-chain
// "token0Path:token1Path:fee"), so this is never reconstructed from other assets.
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
const ViaRealmClause = ({ realm, preposition = "via" }: { realm: string; preposition?: string }) => (
  <>
    <Verb>{preposition}</Verb>
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

// Each action type's sentence lives in its own renderer, keyed by type in ACTION_RENDERERS below -
// keeps a new action type's blast radius (and its tests) to one function instead of a growing
// switch. A renderer returns null (not throws/break) when its required assets are missing, so the
// dispatcher can fall back to the raw type name.
interface ActionRenderContext {
  tokenInfosByTokenKey: Record<string, TokenDisplayInfo>;
  amount: (asset: ActionAsset) => React.ReactNode;
}

type ActionRenderer = (action: TransactionAction, ctx: ActionRenderContext) => React.ReactNode | null;

function renderSwap(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const [from] = amountInAssets(action.assets);
  const [to] = amountOutAssets(action.assets);
  if (!from || !to) return null;
  return (
    <>
      <Verb>Swap</Verb>
      {ctx.amount(from)}
      <Verb>for</Verb>
      {ctx.amount(to)}
    </>
  );
}

function renderApprove(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const [approvedAmount] = amountAssets(action.assets);
  const spender = findAsset(action.assets, "spender");
  if (!approvedAmount || !spender) return null;
  return (
    <>
      <Verb>Approve</Verb>
      {ctx.amount(approvedAmount)}
      <Verb>for</Verb>
      <TransferAddress address={spender.value} packagePath={spender.packagePath} />
    </>
  );
}

function renderMint(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const { assets, tag, realm } = action;
  if (tag === "grc721") {
    const tokenId = findAsset(assets, "tokenId");
    if (!tokenId) return null;
    const label = tokenId.assetType.includes("gnoswap") ? "position" : "NFT";
    return (
      <>
        <Verb>Mint</Verb>
        <Ref label={label} value={tokenId.value} />
        <ViaRealmClause realm={realm} preposition="on" />
      </>
    );
  }
  const [mintedAmount] = amountAssets(assets);
  if (!mintedAmount) return null;
  return (
    <>
      <Verb>Mint</Verb>
      {ctx.amount(mintedAmount)}
      <ViaRealmClause realm={realm} preposition="on" />
    </>
  );
}

function renderBurn(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const { assets, tag, realm } = action;
  if (tag === "grc721") {
    const tokenId = findAsset(assets, "tokenId");
    if (!tokenId) return null;
    const label = tokenId.assetType.includes("gnoswap") ? "position" : "NFT";
    return (
      <>
        <Verb>Burn</Verb>
        <Ref label={label} value={tokenId.value} />
        <ViaRealmClause realm={realm} preposition="on" />
      </>
    );
  }
  const [burnedAmount] = amountAssets(assets);
  if (!burnedAmount) return null;
  return (
    <>
      <Verb>Burn</Verb>
      {ctx.amount(burnedAmount)}
      <ViaRealmClause realm={realm} preposition="on" />
    </>
  );
}

// Shared by "addLiquidity" and "reposition" - identical shape, only the verb differs.
function renderAddLiquidity(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const { type, assets, realm } = action;
  const tokens = amountAssets(assets);
  const position = findAsset(assets, "position");
  const pool = findAsset(assets, "pool");
  const fee = findAsset(assets, "fee");
  if (tokens.length === 0 || !position) return null;
  return (
    <>
      <Verb>{type === "reposition" ? "Reposition" : "Add liquidity"}</Verb>
      {joinAmounts(tokens, ctx.amount)}
      <Verb>to</Verb>
      <Ref label="position" value={position.value} href={poolHref(pool)} />
      {fee && <PoolFeeClause fee={fee.value} />}
      <ViaRealmClause realm={realm} />
    </>
  );
}

function renderRemoveLiquidity(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const { assets, realm } = action;
  const tokens = amountAssets(assets);
  const position = findAsset(assets, "position");
  const pool = findAsset(assets, "pool");
  const fee = findAsset(assets, "fee");
  if (tokens.length === 0 || !position) return null;
  return (
    <>
      <Verb>Remove liquidity</Verb>
      {joinAmounts(tokens, ctx.amount)}
      <Verb>from</Verb>
      <Ref label="position" value={position.value} href={poolHref(pool)} />
      {fee && <PoolFeeClause fee={fee.value} />}
      <ViaRealmClause realm={realm} />
    </>
  );
}

function renderCollectFee(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const { assets, realm } = action;
  const tokens = amountAssets(assets);
  const position = findAsset(assets, "position");
  const pool = findAsset(assets, "pool");
  const fee = findAsset(assets, "fee");
  if (tokens.length === 0 || !position) return null;
  return (
    <>
      <Verb>Collect fee</Verb>
      {joinAmounts(tokens, ctx.amount)}
      <Verb>from</Verb>
      <Ref label="position" value={position.value} href={poolHref(pool)} />
      {fee && <PoolFeeClause fee={fee.value} />}
      <ViaRealmClause realm={realm} />
    </>
  );
}

function renderStake(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const { assets, realm } = action;
  const position = findAsset(assets, "position");
  if (!position) return null;
  const pool = findAsset(assets, "pool");
  const fee = findAsset(assets, "fee");
  return (
    <>
      <Verb>Stake</Verb>
      <Ref label="position" value={position.value} href={poolHref(pool)} />
      {fee && <PoolFeeClause fee={fee.value} pairLabel={poolPairLabel(pool, ctx.tokenInfosByTokenKey)} />}
      <ViaRealmClause realm={realm} />
    </>
  );
}

function renderUnstake(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const { assets, realm } = action;
  const position = findAsset(assets, "position");
  if (!position) return null;
  const pool = findAsset(assets, "pool");
  const fee = findAsset(assets, "fee");
  return (
    <>
      <Verb>Unstake</Verb>
      <Ref label="position" value={position.value} href={poolHref(pool)} />
      {fee && <PoolFeeClause fee={fee.value} pairLabel={poolPairLabel(pool, ctx.tokenInfosByTokenKey)} />}
      <ViaRealmClause realm={realm} />
    </>
  );
}

function renderCollectReward(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const { assets, realm } = action;
  const [reward] = amountAssets(assets);
  const position = findAsset(assets, "position");
  if (!reward || !position) return null;
  const pool = findAsset(assets, "pool");
  const fee = findAsset(assets, "fee");
  return (
    <>
      <Verb>Collect reward</Verb>
      {ctx.amount(reward)}
      <Verb>from</Verb>
      <Ref label="position" value={position.value} href={poolHref(pool)} />
      {fee && <PoolFeeClause fee={fee.value} pairLabel={poolPairLabel(pool, ctx.tokenInfosByTokenKey)} />}
      <ViaRealmClause realm={realm} />
    </>
  );
}

function renderCreateExternalIncentive(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const [reward, bond] = amountAssets(action.assets);
  const incentive = findAsset(action.assets, "incentive");
  if (!reward || !bond || !incentive) return null;
  return (
    <>
      <Verb>Create incentive</Verb>
      <Ref value={incentive.value} />
      <Verb>with</Verb>
      {ctx.amount(reward)}
      <Verb>(+</Verb>
      {ctx.amount(bond)}
      <Verb>bond)</Verb>
    </>
  );
}

function renderCreateProject(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const [token] = amountAssets(action.assets);
  const project = findAsset(action.assets, "project");
  if (!token || !project) return null;
  return (
    <>
      <Verb>Create project</Verb>
      <Ref value={project.value} />
      <Verb>with</Verb>
      {ctx.amount(token)}
    </>
  );
}

function renderDepositGns(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const [gns] = amountAssets(action.assets);
  const deposit = findAsset(action.assets, "deposit");
  if (!gns || !deposit) return null;
  return (
    <>
      <Verb>Deposit</Verb>
      {ctx.amount(gns)}
      <Verb>(deposit</Verb>
      <Ref value={deposit.value} />
      <Verb>)</Verb>
    </>
  );
}

function renderCollectDepositGns(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const [gns] = amountAssets(action.assets);
  const deposit = findAsset(action.assets, "deposit");
  if (!gns || !deposit) return null;
  return (
    <>
      <Verb>Withdraw</Verb>
      {ctx.amount(gns)}
      <Verb>from deposit</Verb>
      <Ref value={deposit.value} />
    </>
  );
}

function renderCollectDepositReward(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const [reward] = amountAssets(action.assets);
  const deposit = findAsset(action.assets, "deposit");
  if (!reward || !deposit) return null;
  return (
    <>
      <Verb>Collect reward</Verb>
      {ctx.amount(reward)}
      <Verb>from deposit</Verb>
      <Ref value={deposit.value} />
    </>
  );
}

function renderCreatePool(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const { assets, realm } = action;
  const pool = findAsset(assets, "pool");
  const fee = findAsset(assets, "fee");
  if (!pool || !fee) return null;
  const [token0Path, token1Path] = pool.value.split(":");
  if (!token0Path || !token1Path) return null;
  const pairLabel = `${getTokenSymbol(token0Path, ctx.tokenInfosByTokenKey)}/${getTokenSymbol(
    token1Path,
    ctx.tokenInfosByTokenKey,
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

function renderDelegate(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const [gns] = amountAssets(action.assets);
  if (!gns) return null;
  return (
    <>
      <Verb>Delegate</Verb>
      {ctx.amount(gns)}
    </>
  );
}

function renderUndelegate(): React.ReactNode {
  return <Verb>Undelegate</Verb>;
}

function renderRedelegate(): React.ReactNode {
  return <Verb>Redelegate</Verb>;
}

function renderCollectEmissionReward(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const [gns] = amountAssets(action.assets);
  if (!gns) return null;
  return (
    <>
      <Verb>Collect emission reward</Verb>
      {ctx.amount(gns)}
    </>
  );
}

function renderCollectProtocolFeeReward(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const [token] = amountAssets(action.assets);
  if (!token) return null;
  return (
    <>
      <Verb>Collect protocol fee reward</Verb>
      {ctx.amount(token)}
    </>
  );
}

function renderCollectUndelegatedGns(action: TransactionAction, ctx: ActionRenderContext): React.ReactNode | null {
  const [gns] = amountAssets(action.assets);
  if (!gns) return null;
  return (
    <>
      <Verb>Collect undelegated</Verb>
      {ctx.amount(gns)}
    </>
  );
}

function renderPropose(action: TransactionAction): React.ReactNode | null {
  const proposal = findAsset(action.assets, "proposal");
  if (!proposal) return null;
  return (
    <>
      <Verb>Create proposal</Verb>
      <Ref value={proposal.value} />
    </>
  );
}

function renderVote(action: TransactionAction): React.ReactNode | null {
  const proposal = findAsset(action.assets, "proposal");
  if (!proposal) return null;
  return (
    <>
      <Verb>Vote on proposal</Verb>
      <Ref value={proposal.value} />
    </>
  );
}

function renderExecute(action: TransactionAction): React.ReactNode | null {
  const proposal = findAsset(action.assets, "proposal");
  if (!proposal) return null;
  return (
    <>
      <Verb>Execute proposal</Verb>
      <Ref value={proposal.value} />
    </>
  );
}

function renderCancel(action: TransactionAction): React.ReactNode | null {
  const proposal = findAsset(action.assets, "proposal");
  if (!proposal) return null;
  return (
    <>
      <Verb>Cancel proposal</Verb>
      <Ref value={proposal.value} />
    </>
  );
}

function renderDeploy(action: TransactionAction): React.ReactNode | null {
  const packageName = findAsset(action.assets, "packageName");
  const creator = findAsset(action.assets, "creator");
  if (!packageName || !creator) return null;
  return (
    <>
      <Verb>Deploy</Verb>
      <RealmLink pkgPath={packageName.assetType}>{packageName.value}</RealmLink>
      <Verb>by</Verb>
      <TransferAddress address={creator.value} packagePath={creator.packagePath} />
    </>
  );
}

const ACTION_RENDERERS: Record<string, ActionRenderer> = {
  swap: renderSwap,
  approve: renderApprove,
  mint: renderMint,
  burn: renderBurn,
  addLiquidity: renderAddLiquidity,
  reposition: renderAddLiquidity,
  removeLiquidity: renderRemoveLiquidity,
  collectFee: renderCollectFee,
  stake: renderStake,
  unstake: renderUnstake,
  collectReward: renderCollectReward,
  createExternalIncentive: renderCreateExternalIncentive,
  createProject: renderCreateProject,
  depositGns: renderDepositGns,
  collectDepositGns: renderCollectDepositGns,
  collectDepositReward: renderCollectDepositReward,
  createPool: renderCreatePool,
  delegate: renderDelegate,
  undelegate: renderUndelegate,
  redelegate: renderRedelegate,
  collectEmissionReward: renderCollectEmissionReward,
  collectProtocolFeeReward: renderCollectProtocolFeeReward,
  collectUndelegatedGns: renderCollectUndelegatedGns,
  propose: renderPropose,
  vote: renderVote,
  execute: renderExecute,
  cancel: renderCancel,
  deploy: renderDeploy,
};

function renderActionSentence(
  action: TransactionAction,
  tokenInfosByTokenKey: Record<string, TokenDisplayInfo>,
): React.ReactNode {
  const ctx: ActionRenderContext = {
    tokenInfosByTokenKey,
    amount: asset => <ActionAmount asset={asset} tokenInfosByTokenKey={tokenInfosByTokenKey} />,
  };

  return ACTION_RENDERERS[action.type]?.(action, ctx) ?? <Verb>{action.type}</Verb>;
}

function dedupeActions(actions: TransactionAction[]): TransactionAction[] {
  const seen = new Set<string>();

  return actions.filter(action => {
    const key = `${action.tag}:${action.realm}:${action.type}:${action.assets
      .map(asset => `${asset.assetType}:${asset.key}:${asset.value}:${asset.packagePath ?? ""}`)
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
