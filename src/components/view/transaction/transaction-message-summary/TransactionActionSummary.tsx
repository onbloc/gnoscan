import React from "react";
import styled from "styled-components";

import Text from "@/components/ui/text";
import { ActionAsset, TransactionAction } from "@/types/data-type";
import { ActionAmount, TokenDisplayInfo, TransferAddress, useActionTokenInfos } from "./transfer-render";

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

const Ref = ({ value }: { value: string }) => (
  <Text type="p4" color="blue" display="contents">
    {`#${value}`}
  </Text>
);

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

function renderActionSentence(
  action: TransactionAction,
  tokenInfosByTokenKey: Record<string, TokenDisplayInfo>,
): React.ReactNode {
  const { type, assets, realm } = action;
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
          <TransferAddress address={spender.value} />
        </>
      );
    }
    case "mint": {
      if (realm === "grc721") {
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
      if (realm === "grc721") {
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
      if (tokens.length === 0 || !position) break;
      return (
        <>
          <Verb>{type === "reposition" ? "Reposition" : "Add liquidity"}</Verb>
          {joinAmounts(tokens, amount)}
          <Verb>to position</Verb>
          <Ref value={position.value} />
        </>
      );
    }
    case "removeLiquidity": {
      const tokens = amountAssets(assets);
      const position = findAsset(assets, "position");
      if (tokens.length === 0 || !position) break;
      return (
        <>
          <Verb>Remove liquidity</Verb>
          {joinAmounts(tokens, amount)}
          <Verb>from position</Verb>
          <Ref value={position.value} />
        </>
      );
    }
    case "collectFee": {
      const tokens = amountAssets(assets);
      const position = findAsset(assets, "position");
      if (tokens.length === 0 || !position) break;
      return (
        <>
          <Verb>Collect fee</Verb>
          {joinAmounts(tokens, amount)}
          <Verb>from position</Verb>
          <Ref value={position.value} />
        </>
      );
    }
    case "stake": {
      const position = findAsset(assets, "position");
      if (!position) break;
      return (
        <>
          <Verb>Stake position</Verb>
          <Ref value={position.value} />
        </>
      );
    }
    case "unstake": {
      const position = findAsset(assets, "position");
      if (!position) break;
      return (
        <>
          <Verb>Unstake position</Verb>
          <Ref value={position.value} />
        </>
      );
    }
    case "collectReward": {
      const [reward] = amountAssets(assets);
      const position = findAsset(assets, "position");
      if (!reward || !position) break;
      return (
        <>
          <Verb>Collect reward</Verb>
          {amount(reward)}
          <Verb>from position</Verb>
          <Ref value={position.value} />
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
      if (!pool) break;
      return (
        <>
          <Verb>Create pool</Verb>
          <Plain>{pool.value}</Plain>
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
