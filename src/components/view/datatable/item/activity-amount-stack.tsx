import React from "react";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import theme from "@/styles/theme";

import { ActivityAmount } from "@/models/api/activity/activity-model";
import { toDisplayAmount } from "@/common/utils/activity.utility";
import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { Amount } from "./amount";

interface Props {
  amounts: ActivityAmount[];
}

/** Renders a stack of activity amounts - accounts/realms can carry several distinct tokens per tx. */
export const ActivityAmountStack = ({ amounts }: Props) => {
  const { getTokenMeta } = useTokenResourceMeta();

  // Zero raw amounts show as a dash, like StandardNetworkAmount (a nonzero value that rounds to 0 still shows).
  const nonZeroAmounts = amounts.filter(amount => !new BigNumber(amount.value).isZero());
  if (!nonZeroAmounts.length) return <span>-</span>;

  return (
    <StackWrapper>
      {nonZeroAmounts.map((amount, index) => {
        // Token resource list first, backend symbol/decimals as fallback (also applies the wugnot override).
        const meta = getTokenMeta(amount.denom, {
          name: amount.symbol,
          symbol: amount.symbol,
          decimals: amount.decimals,
        });
        const display = toDisplayAmount(amount, meta);
        // NFTs read as "{symbol} #id, #id" - the ids already convey the count.
        if (display.tokenIds && display.tokenIds.length > 0) {
          return (
            <div className="amount-row" key={index}>
              <span className="nft">{`${display.denom} #${display.tokenIds.join(", #")}`}</span>
            </div>
          );
        }
        return (
          <div className="amount-row" key={index}>
            <Amount value={display.value} denom={display.denom} />
          </div>
        );
      })}
    </StackWrapper>
  );
};

const StackWrapper = styled.div`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 4px;

    .amount-row {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: flex-start;
    }

    .amount-row:not(:last-child) {
      padding-bottom: 4px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed50};
    }

    .nft {
      ${theme.fonts.p4};
      color: ${({ theme }) => theme.colors.primary};
    }) => theme.colors.tertiary};
      font-size: 11px;
    }
  }
`;
