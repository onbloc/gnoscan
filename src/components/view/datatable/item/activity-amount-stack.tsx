import React from "react";
import styled from "styled-components";

import { ActivityAmount } from "@/models/api/activity/activity-model";
import { toDisplayAmount } from "@/common/utils/activity.utility";
import { Amount } from "./amount";

interface Props {
  amounts: ActivityAmount[];
}

/** Renders a stack of activity amounts - accounts/realms can carry several distinct tokens per tx. */
export const ActivityAmountStack = ({ amounts }: Props) => {
  if (!amounts.length) return <span>-</span>;

  return (
    <StackWrapper>
      {amounts.map((amount, index) => {
        const display = toDisplayAmount(amount);
        return (
          <div className="amount-row" key={index}>
            <Amount value={display.value} denom={display.denom} />
            {display.tokenIds && display.tokenIds.length > 0 && (
              <span className="token-ids">{`#${display.tokenIds.join(", #")}`}</span>
            )}
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
      align-items: center;
    }

    .amount-row:not(:last-child) {
      padding-bottom: 4px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed50};
    }

    .token-ids {
      color: ${({ theme }) => theme.colors.tertiary};
      font-size: 11px;
    }
  }
`;
