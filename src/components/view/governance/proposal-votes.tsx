import React from "react";
import dayjs from "dayjs";
import styled from "styled-components";

import { formatGovernanceNumber } from "@/common/utils/governance-util";
import { GovernanceVote } from "@/models/api/governance";
import { DetailsContainer } from "@/components/ui/detail-page-common-styles";
import Text from "@/components/ui/text";
import { TxHashCopy } from "@/components/view/datatable/item/tx-hash-copy";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";
import { ListPagination, ListPaginationProps } from "@/components/view/common/list-pagination/ListPagination";
import { GovernanceAccountView, TierBadge, VoteChoiceBadge } from "./governance-common";

interface ProposalVotesProps {
  votes: GovernanceVote[];
  totalCount?: number;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  pagination: ListPaginationProps;
}

const ProposalVotes = ({ votes, totalCount, isLoading, isError, onRetry, pagination }: ProposalVotesProps) => (
  <VotesSection>
    <Heading role="tablist" aria-label="Proposal details">
      <VoteTab
        type="button"
        role="tab"
        id="proposal-votes-tab"
        aria-selected="true"
        aria-controls="proposal-votes-panel"
      >
        <Text type="h6" color="primary">
          Votes
        </Text>
        {totalCount !== undefined && <Count>{formatGovernanceNumber(totalCount)}</Count>}
      </VoteTab>
    </Heading>
    <div role="tabpanel" id="proposal-votes-panel" aria-labelledby="proposal-votes-tab" className="votes-panel">
      {isError ? (
        <Message role="alert">
          Unable to load votes.{" "}
          <button type="button" onClick={onRetry}>
            Try again
          </button>
        </Message>
      ) : isLoading ? (
        <TableSkeleton />
      ) : votes.length === 0 ? (
        <Message>No votes yet</Message>
      ) : (
        <TableViewport>
          <VotesTable aria-label="Proposal votes">
            <colgroup>
              <col style={{ width: "26%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "19%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Voter</th>
                <th scope="col">Tier</th>
                <th scope="col">Vote</th>
                <th scope="col">Voting Power</th>
                <th scope="col">Tx Hash</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              {votes.map((vote, index) => (
                <tr key={`${vote.voter.address ?? vote.voter.nameTag ?? "unknown"}:${index}`}>
                  <td>
                    <GovernanceAccountView account={vote.voter} addressOnly />
                  </td>
                  <td>
                    <TierBadge tier={vote.tier} />
                  </td>
                  <td>
                    <VoteChoiceBadge choice={vote.choice} />
                  </td>
                  <td>{formatGovernanceNumber(vote.power)}</td>
                  <td>{vote.txHash ? <TxHashCopy txHash={vote.txHash} /> : "-"}</td>
                  <td>{vote.txHash && vote.votedAt ? dayjs(vote.votedAt).format("YYYY-MM-DD HH:mm:ss") : "-"}</td>
                </tr>
              ))}
            </tbody>
          </VotesTable>
        </TableViewport>
      )}
      {!isLoading && <ListPagination {...pagination} />}
    </div>
  </VotesSection>
);

export default ProposalVotes;

const VotesSection = styled(DetailsContainer)`
  gap: 16px;
  a {
    color: ${({ theme }) => theme.colors.blue};
  }
  .path-copy-tooltip .svg-icon {
    stroke: ${({ theme }) => theme.colors.primary};
  }
  .votes-panel {
    width: 100%;
  }
`;

const TableViewport = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const VotesTable = styled.table`
  width: 100%;
  min-width: 1000px;
  table-layout: fixed;
  border-collapse: collapse;
  color: ${({ theme }) => theme.colors.primary};
  ${({ theme }) => theme.fonts.p4};

  th,
  td {
    padding: 16px 12px;
    text-align: left;
    vertical-align: middle;
    overflow-wrap: anywhere;
  }
  th {
    color: ${({ theme }) => theme.colors.tertiary};
    font-weight: 400;
  }
  td {
    border-top: 1px solid ${({ theme }) => theme.colors.dimmed50};
  }
  th:first-child,
  td:first-child {
    padding-left: 0;
  }
  th:last-child,
  td:last-child {
    padding-right: 0;
    text-align: right;
    white-space: nowrap;
  }
`;

const Heading = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed100};
`;

const VoteTab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 0 14px;
  margin-bottom: -1px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
`;

const Count = styled.span`
  padding: 0 8px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.dimmed100};
  color: ${({ theme }) => theme.colors.primary};
  ${({ theme }) => theme.fonts.body1};
`;

const Message = styled.div`
  width: 100%;
  padding: 24px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.tertiary};
  button {
    color: ${({ theme }) => theme.colors.blue};
  }
`;
