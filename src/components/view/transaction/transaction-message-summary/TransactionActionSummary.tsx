import React from "react";
import styled from "styled-components";

import Text from "@/components/ui/text";
import Tooltip from "@/components/ui/tooltip";
import IconCopy from "@/assets/svgs/icon-copy.svg";
import { GNOSWAP_APP_BASE_URL } from "@/common/values/constant-value";
import { toBech32AddressByPackagePath } from "@/common/utils/bech32.utility";
import { formatTokenDecimal } from "@/common/utils/token.utility";
import { ActionAsset, TransactionAction } from "@/types/data-type";
import {
  ActionAmount,
  AddressChip,
  RealmLink,
  SUMMARY_LINE_HEIGHT,
  TokenDisplayInfo,
  TransferAddress,
  getTokenSymbol,
  useActionTokenInfos,
} from "./transfer-render";

interface Props {
  actions: TransactionAction[];
  types?: string[];
}

const TransactionActionSummary = ({ actions, types }: Props) => {
  const displayActions = React.useMemo(() => selectDisplayActions(actions, types), [actions, types]);
  const tokenInfosByTokenKey = useActionTokenInfos(displayActions);

  if (displayActions.length === 0) return null;

  const numbered = displayActions.length > 1;

  return (
    <Wrapper>
      {displayActions.map((action, index) => (
        <ActionLine key={index}>
          {numbered && (
            <Text type="p2" color="tertiary" style={SUMMARY_LINE_HEIGHT}>
              {`${index + 1}.`}
            </Text>
          )}
          {renderActionSentence(action, tokenInfosByTokenKey, displayActions)}
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
    <Text type="p2" color={href ? "blue" : "primary"} display="contents" style={SUMMARY_LINE_HEIGHT}>
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

const Verb = ({ children }: { children: React.ReactNode }) => (
  <Text type="p2" color="tertiary" style={SUMMARY_LINE_HEIGHT}>
    {children}
  </Text>
);

// Pool fee tiers are raw hundredths-of-a-bip units (e.g. "3000" = 0.3%), same as gnoswap itself
// uses - see onbloc-api-v3's gnoswap/pool.go.
const formatFeePercent = (fee: string) => `${formatTokenDecimal(fee, 4)}%`;

// pairLabel and the fee% live in one Text (not two adjacent "display: contents" nodes) - two
// such nodes next to each other don't reliably get the flex gap between them, so they'd render
// glued together ("GNS0.3%") otherwise. Blue+linked when href is given (same rule as Ref), else
// a plain bold black value.
const PoolFeeClause = ({ fee, pairLabel, href }: { fee: string; pairLabel?: string; href?: string }) => {
  const label = pairLabel ? `${pairLabel} ${formatFeePercent(fee)}` : formatFeePercent(fee);
  const text = (
    <Text
      type="p2"
      color={href ? "blue" : "primary"}
      fontWeight={href ? undefined : 700}
      display="contents"
      style={SUMMARY_LINE_HEIGHT}
    >
      {label}
    </Text>
  );

  return (
    <>
      <Verb>{pairLabel ? "in" : "in a"}</Verb>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ) : (
        text
      )}
      <Text type="p2" color="primary" fontWeight={700} display="contents" style={SUMMARY_LINE_HEIGHT}>
        pool
      </Text>
    </>
  );
};

// Same chip+copy treatment as TransferAddress's packagePath branch, for a realm link shown
// on its own (not resolved from some other address field) - keeps every pkgPath link in the
// summary copyable the same way, and copies the realm's actual g1... address (same convention
// as TransferAddress, and as RealmSummary.realmAddress) rather than the path text.
const RealmChip = ({ pkgPath, children }: { pkgPath: string; children: React.ReactNode }) => (
  <AddressChip>
    <RealmLink pkgPath={pkgPath}>{children}</RealmLink>
    <Tooltip content="Copied!" trigger="click" copyText={toBech32AddressByPackagePath("g", pkgPath)}>
      <IconCopy className="copy-icon" />
    </Tooltip>
  </AddressChip>
);

// "gno.land/r/gnoswap/staker/v1" -> "r/gnoswap/staker/v1" - same trim as TransferAddress's realm
// display, minus the everywhere-repeated "gno.land" prefix.
const ViaRealmClause = ({ realm, preposition = "via" }: { realm: string; preposition?: string }) => (
  <>
    <Verb>{preposition}</Verb>
    <RealmChip pkgPath={realm}>{realm.replace("gno.land/", "")}</RealmChip>
  </>
);

// Shared tail of every pool/position action (addLiquidity/removeLiquidity/collectFee/stake/
// unstake/collectReward): the position ref, its pool's fee tier, and the emitting realm.
const PositionClause = ({
  position,
  pool,
  fee,
  pairLabel,
  realm,
}: {
  position: ActionAsset;
  pool: ActionAsset | undefined;
  fee: ActionAsset | undefined;
  pairLabel?: string;
  realm: string;
}) => (
  <>
    <Ref label="position" value={position.value} href={poolHref(pool)} />
    {fee && <PoolFeeClause fee={fee.value} pairLabel={pairLabel} href={poolHref(pool)} />}
    <ViaRealmClause realm={realm} />
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
  actions: TransactionAction[];
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
  const { assets, tag } = action;
  const spender = findAsset(assets, "spender");
  if (!spender) return null;

  if (tag === "grc721") {
    const tokenId = findAsset(assets, "tokenId");
    if (!tokenId) return null;
    const label = tokenId.assetType.includes("gnoswap") ? "position" : "NFT";
    const pool = findStakePoolByPosition(ctx.actions, tokenId.value);

    return (
      <>
        <Verb>Approve</Verb>
        <Ref label={label} value={tokenId.value} href={poolHref(pool)} />
        <Verb>for</Verb>
        <TransferAddress address={spender.value} packagePath={spender.packagePath} />
      </>
    );
  }

  const [approvedAmount] = amountAssets(assets);
  if (!approvedAmount) return null;
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
      <PositionClause position={position} pool={pool} fee={fee} realm={realm} />
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
      <PositionClause position={position} pool={pool} fee={fee} realm={realm} />
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
      <PositionClause position={position} pool={pool} fee={fee} realm={realm} />
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
      <PositionClause
        position={position}
        pool={pool}
        fee={fee}
        pairLabel={poolPairLabel(pool, ctx.tokenInfosByTokenKey)}
        realm={realm}
      />
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
      <PositionClause
        position={position}
        pool={pool}
        fee={fee}
        pairLabel={poolPairLabel(pool, ctx.tokenInfosByTokenKey)}
        realm={realm}
      />
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
      <PositionClause
        position={position}
        pool={pool}
        fee={fee}
        pairLabel={poolPairLabel(pool, ctx.tokenInfosByTokenKey)}
        realm={realm}
      />
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
      <PoolFeeClause fee={fee.value} pairLabel={pairLabel} href={poolHref(pool)} />
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

// Same format as renderDeploy (Verb + package name + "by" + creator) — the only
// difference is that the package now has a realm page, so its name links there
// (via the pkgPath the summary reports as the packageName asset's assetType).
function renderEnable(action: TransactionAction): React.ReactNode | null {
  const packageName = findAsset(action.assets, "packageName");
  const creator = findAsset(action.assets, "creator");
  if (!packageName || !creator) return null;
  return (
    <>
      <Verb>Enabled</Verb>
      <RealmLink pkgPath={packageName.assetType}>{packageName.value}</RealmLink>
      <Verb>by</Verb>
      <TransferAddress address={creator.value} packagePath={creator.packagePath} />
    </>
  );
}

// AddPkg creates its realm page immediately, so the package name links to realm detail
// the same way enable does.
function renderDeploy(action: TransactionAction): React.ReactNode | null {
  const packageName = findAsset(action.assets, "packageName");
  const creator = findAsset(action.assets, "creator");
  if (!packageName || !creator) return null;
  return (
    <>
      <Verb>Deploy</Verb>
      <RealmLink pkgPath={packageName.assetType}>{packageName.value}</RealmLink>
      <Verb>by</Verb>
      <TransferAddress address={creator.value} />
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
  enable: renderEnable,
  deploy: renderDeploy,
};

function renderActionSentence(
  action: TransactionAction,
  tokenInfosByTokenKey: Record<string, TokenDisplayInfo>,
  actionList: TransactionAction[],
): React.ReactNode {
  const ctx: ActionRenderContext = {
    tokenInfosByTokenKey,
    actions: actionList,
    amount: asset => <ActionAmount asset={asset} tokenInfosByTokenKey={tokenInfosByTokenKey} />,
  };

  return ACTION_RENDERERS[action.type]?.(action, ctx) ?? <Verb>{action.type}</Verb>;
}

function findStakePoolByPosition(actions: TransactionAction[], positionId: string): ActionAsset | undefined {
  return actions
    .filter(action => action.type === "stake")
    .find(action => findAsset(action.assets, "position")?.value === positionId)
    ?.assets.find(asset => asset.key === "pool");
}

function selectDisplayActions(actions: TransactionAction[], types?: string[]): TransactionAction[] {
  const uniqueActions = dedupeActions(actions);
  if (!types?.length) return uniqueActions;

  const displayActions = uniqueActions.filter(action => types.some(type => actionMatchesSummaryType(action, type)));
  const approveActions = displayActions.filter(action => action.type === "approve");
  const approveTypeCount = types.filter(type =>
    approveActions.some(action => actionMatchesSummaryType(action, type)),
  ).length;

  if (approveActions.length <= approveTypeCount) {
    return displayActions;
  }

  const preferredApprove =
    approveActions.find(action => amountAssets(action.assets)[0]?.value !== "0") ?? approveActions[0];
  let usedPreferredApprove = false;

  return displayActions.filter(action => {
    if (action.type !== "approve") return true;
    if (action !== preferredApprove || usedPreferredApprove) return false;

    usedPreferredApprove = true;
    return true;
  });
}

export function hasDisplayActions(actions: TransactionAction[], types?: string[]): boolean {
  return selectDisplayActions(actions, types).length > 0;
}

function actionMatchesSummaryType(action: TransactionAction, type: string): boolean {
  const actionType = action.type.toLowerCase();
  const summaryType = type.toLowerCase();

  return summaryType === actionType || summaryType.includes(actionType);
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
// DetailsContainer), so without an explicit width this box would only span its
// own content instead of the full row width like every other field.
// margin-top pairs with the tab label's own 16px bottom margin (DataListSection)
// to reach the 32px gap Figma specifies between the tab row and this summary line.
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 16px;
  padding-bottom: 16px;
`;

const ActionLine = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
`;

export default TransactionActionSummary;
