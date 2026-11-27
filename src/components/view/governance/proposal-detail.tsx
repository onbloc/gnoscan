import React from "react";
import Link from "next/link";
import styled from "styled-components";

import { useNetwork } from "@/common/hooks/use-network";
import { getDateDiff, getLocalDateString } from "@/common/utils/date-util";
import { decodeGovernanceTitle, formatGovernanceNumber } from "@/common/utils/governance-util";
import { GovernanceProposalDetail } from "@/models/api/governance";
import Badge from "@/components/ui/badge";
import { Field } from "@/components/ui/detail-field";
import { DateDiffText, DetailsContainer } from "@/components/ui/detail-page-common-styles";
import Text from "@/components/ui/text";
import { TxHashCopy } from "@/components/view/datatable/item/tx-hash-copy";
import {
  getGovernanceLabel,
  GovernanceAccountView,
  ProposalStatusBadge,
  TierBadge,
  VoteBreakdown,
} from "./governance-common";
import ProposalMarkdown from "./proposal-markdown";

const TYPE_LABELS: Record<GovernanceProposalDetail["type"], string> = {
  VALIDATOR_SET: "Validator set",
  PARAMETER: "Parameter",
  MEMBER_CHANGE: "Member change",
  OTHER: "Other",
};

const ProposalDetail = ({ proposal }: { proposal: GovernanceProposalDetail }) => {
  const { getUrlWithNetwork, gnoWebUrl } = useNetwork();
  const { createdTx, turnout } = proposal;
  const memberPercent =
    turnout.eligibleMembers != null && turnout.eligibleMembers > 0
      ? (turnout.castMembers / turnout.eligibleMembers) * 100
      : null;

  return (
    <Rows>
      <Text type="h6" desktopType="h4" color="primary" margin="0 0 16px 0">
        Summary
      </Text>
      <Field label="Title">
        <Badge>{decodeGovernanceTitle(proposal.title)}</Badge>
      </Field>
      <Field label="Type">
        <Badge>{getGovernanceLabel(TYPE_LABELS, proposal.type)}</Badge>
      </Field>
      <Field label="Status">
        <ProposalStatusBadge status={proposal.status} />
      </Field>
      <Field label="Proposer">
        <Badge>
          <GovernanceAccountView account={proposal.proposer} showNameTagPrefix={false} />
        </Badge>
      </Field>
      {proposal.newMember != null && (
        <Field label="New Member">
          <Badge>
            <MemberValue>
              <GovernanceAccountView account={{ address: proposal.newMember.address, nameTag: null }} addressOnly />
              <TierBadge tier={proposal.newMember.tier} />
            </MemberValue>
          </Badge>
        </Field>
      )}
      <Field label="Created Tx">
        <Badge>{createdTx?.hash ? <TxHashCopy txHash={createdTx.hash} ellipsis={false} /> : "-"}</Badge>
      </Field>
      <Field label="Block">
        <Badge>
          {createdTx?.height != null ? (
            <Link href={getUrlWithNetwork(`/block/${createdTx.height}`)}>
              {formatGovernanceNumber(createdTx.height)}
            </Link>
          ) : (
            "-"
          )}
        </Badge>
      </Field>
      <Field label="Timestamp">
        <Badge>
          {createdTx?.time ? (
            <>
              {getLocalDateString(createdTx.time)}
              <DateDiffText>{getDateDiff(createdTx.time)}</DateDiffText>
            </>
          ) : (
            "-"
          )}
        </Badge>
      </Field>
      <Field label="Votes">
        <VoteValue>
          <VoteBreakdown votes={proposal.votes} status={proposal.status} />
        </VoteValue>
      </Field>
      <Field label="Turnout">
        <Badge>
          <span>
            {formatGovernanceNumber(turnout.castMembers)}
            {turnout.eligibleMembers == null
              ? " members (eligible members unknown)"
              : ` / ${formatGovernanceNumber(turnout.eligibleMembers)} members`}
            {memberPercent != null && <Muted> ({formatGovernanceNumber(memberPercent)}%)</Muted>}
            {turnout.castPowerPercent != null &&
              ` · ${formatGovernanceNumber(turnout.castPowerPercent)}% of voting power`}
          </span>
        </Badge>
      </Field>
      <Field label="Description" className="top-aligned">
        <Badge className="description-value">
          <ProposalMarkdown description={proposal.description} gnoWebUrl={gnoWebUrl} />
        </Badge>
      </Field>
    </Rows>
  );
};

export default ProposalDetail;

const Rows = styled(DetailsContainer)`
  min-width: 0;

  dd {
    min-width: 0;
  }
  a {
    color: ${({ theme }) => theme.colors.blue};
  }
  .path-copy-tooltip .svg-icon {
    stroke: ${({ theme }) => theme.colors.primary};
  }
  .badge {
    height: auto;
    white-space: normal;
    overflow-wrap: anywhere;
  }
  .description-value {
    max-width: 100%;
    width: 100%;
    justify-content: flex-start;
  }
`;

const MemberValue = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const VoteValue = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 10px 16px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const Muted = styled.span`
  color: ${({ theme }) => theme.colors.tertiary};
`;
