import React from "react";
import Link from "next/link";
import styled from "styled-components";

import { useNetwork } from "@/common/hooks/use-network";
import { formatGovernanceNumber } from "@/common/utils/governance-util";
import Badge from "@/components/ui/badge";
import { AddressCopy } from "@/components/view/datatable/item/address-copy";
import type { GovernanceAccount, GovernanceStatus, GovernanceVote, GovernanceVotes } from "@/models/api/governance";
import type { PaletteKeyType } from "@/styles";

const statusLabels = { ACTIVE: "Active", ACCEPTED: "Accepted", REJECTED: "Rejected" };
const statusColors: Record<GovernanceStatus, PaletteKeyType> = {
  ACTIVE: "blue",
  ACCEPTED: "green",
  REJECTED: "failed",
};
const choiceColors: Record<GovernanceVote["choice"], PaletteKeyType> = {
  YES: "green",
  NO: "failed",
  ABSTAIN: "pending",
};
const choices = ["yes", "no", "abstain"] as const;
const choiceLabels = { yes: "Yes", no: "No", abstain: "Abstain" };
const tierColors: Record<string, { background: string; text: string }> = {
  T1: { background: "#329175", text: "#FFFFFF" },
  T2: { background: "#21577A", text: "#FFFFFF" },
  T3: { background: "#F3D3BC", text: "#7a4f2a" },
};

export const GovernanceAccountView = ({
  account,
  addressOnly = false,
  copy = false,
  showNameTagPrefix = true,
}: {
  account: GovernanceAccount;
  addressOnly?: boolean;
  copy?: boolean;
  showNameTagPrefix?: boolean;
}) => {
  const { getUrlWithNetwork } = useNetwork();
  if (account.address && (addressOnly || copy || !account.nameTag)) {
    return <AddressCopy address={account.address} />;
  }
  const nameTag = account.nameTag ? `${showNameTagPrefix ? "@" : ""}${account.nameTag.replace(/^@/, "")}` : "-";
  if (!account.address) return <span>{nameTag}</span>;
  return <AccountLink href={getUrlWithNetwork(`/account/${account.address}`)}>{nameTag}</AccountLink>;
};

export const ProposalStatusBadge = ({ status }: { status: GovernanceStatus }) => (
  <Badge type={statusColors[status]} margin="0" style={{ color: "#FFFFFF" }}>
    {statusLabels[status]}
  </Badge>
);

export const VoteChoiceBadge = ({ choice }: { choice: GovernanceVote["choice"] }) => (
  <Badge type={choiceColors[choice]} margin="0" padding="2px 12px" style={{ color: "#FFFFFF", minHeight: 20 }}>
    {choiceLabels[choice.toLowerCase() as (typeof choices)[number]]}
  </Badge>
);

export const TierBadge = ({ tier }: { tier: string }) => {
  const colors = tierColors[tier];
  if (!colors) return <span>-</span>;
  return (
    <TierChip $background={colors.background} $text={colors.text}>
      {tier}
    </TierChip>
  );
};

export const VoteBreakdown = ({ votes, status }: { votes: GovernanceVotes; status: GovernanceStatus }) => {
  const hasPercent = choices.every(choice => votes[choice].percent !== null);
  const unknown = status === "ACTIVE" && !hasPercent;
  const totalCount = choices.reduce((total, choice) => total + votes[choice].count, 0);
  const description = choices
    .map(choice => {
      const value = unknown
        ? "-"
        : hasPercent
        ? `${formatGovernanceNumber(votes[choice].percent!)}%`
        : formatGovernanceNumber(votes[choice].count);
      return `${choiceLabels[choice]} ${value}`;
    })
    .join(" / ");

  return (
    <VoteContainer>
      <VoteTrack role="img" aria-label={unknown ? `${description}; voting power unavailable` : description}>
        {!unknown &&
          choices.map(choice => {
            const width = hasPercent
              ? votes[choice].percent!
              : totalCount > 0
              ? (votes[choice].count / totalCount) * 100
              : 0;
            return <VoteSegment key={choice} $choice={choice} style={{ width: `${width}%` }} />;
          })}
      </VoteTrack>
      <VoteLegend>
        {choices.map(choice => (
          <span key={choice}>
            {choiceLabels[choice]}{" "}
            <strong>
              {unknown
                ? "-"
                : hasPercent
                ? `${formatGovernanceNumber(votes[choice].percent!)}%`
                : formatGovernanceNumber(votes[choice].count)}
            </strong>
          </span>
        ))}
      </VoteLegend>
      {unknown && <UnknownPower>Voting power unavailable</UnknownPower>}
    </VoteContainer>
  );
};

const AccountLink = styled(Link)`
  color: ${({ theme }) => theme.colors.blue};
`;
const TierChip = styled.span<{ $background: string; $text: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${({ $background }) => $background};
  color: ${({ $text }) => $text};
  ${({ theme }) => theme.fonts.h8};
`;
const VoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  min-width: 220px;
`;
const VoteTrack = styled.div`
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.dimmed100};
`;
const VoteSegment = styled.span<{ $choice: (typeof choices)[number] }>`
  display: block;
  flex-shrink: 0;
  background: ${({ theme, $choice }) => theme.colors[choiceColors[$choice.toUpperCase() as GovernanceVote["choice"]]]};
`;
const VoteLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  color: ${({ theme }) => theme.colors.tertiary};
  ${({ theme }) => theme.fonts.body1};
  strong {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
  }
`;
const UnknownPower = styled.span`
  color: ${({ theme }) => theme.colors.tertiary};
  ${({ theme }) => theme.fonts.body1};
`;
