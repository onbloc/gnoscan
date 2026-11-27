import React from "react";
import { useRouter } from "next/router";

import { HeaderRowItem } from "@/components/ui/datatable/header/header-row-item";
import { useNetwork } from "@/common/hooks/use-network";
import { decodeGovernanceTitle, formatGovernanceNumber } from "@/common/utils/governance-util";
import { textEllipsis } from "@/common/utils/string-util";
import { GovernanceMember, GovernanceProposal, GovernanceSummary } from "@/models/api/governance";
import { GovernanceAccountView, ProposalStatusBadge, TierBadge, VoteBreakdown } from "./governance-common";
import * as S from "./governance-list.styles";

const STATUS_LABELS = { ACTIVE: "Active", ACCEPTED: "Accepted", REJECTED: "Rejected" } as const;

export interface GovernanceSort<Field extends string> {
  field: Field;
  order: "asc" | "desc";
}

interface SortHeaderProps<Field extends string> {
  label: string;
  field: Field;
  sort?: GovernanceSort<Field>;
  onSort: (sort: GovernanceSort<Field> | undefined) => void;
}

const SortHeader = <Field extends string>({ label, field, sort, onSort }: SortHeaderProps<Field>) => {
  const order = sort?.field === field ? sort.order : undefined;
  return (
    <S.SortHeaderCell scope="col" aria-sort={order === "asc" ? "ascending" : order === "desc" ? "descending" : "none"}>
      <HeaderRowItem
        header={{ key: field, name: label, sort: true }}
        sortOption={sort}
        setSortOption={({ order }) => onSort(order === "asc" || order === "desc" ? { field, order } : undefined)}
      />
    </S.SortHeaderCell>
  );
};

interface SummaryProps {
  summary?: GovernanceSummary;
  summaryError: boolean;
  live?: GovernanceProposal[];
  liveError: boolean;
  latest?: GovernanceProposal[];
  latestError: boolean;
}

export const GovernanceSummaryCards = ({
  summary,
  summaryError,
  live,
  liveError,
  latest,
  latestError,
}: SummaryProps) => {
  const { getUrlWithNetwork } = useNetwork();
  const router = useRouter();

  return (
    <S.SummaryGrid>
      <S.SummaryCard>
        <S.CardHeading>Proposals Summary</S.CardHeading>
        {summaryError ? (
          <S.Message role="alert">Unable to load governance summary.</S.Message>
        ) : summary ? (
          <S.Stats>
            {(["total", "active", "accepted", "rejected"] as const).map(key => (
              <div key={key}>
                <dt>{key[0].toUpperCase() + key.slice(1)}</dt>
                <dd>{formatGovernanceNumber(summary.proposals[key])}</dd>
              </div>
            ))}
          </S.Stats>
        ) : (
          <S.Message role="status">Loading summary…</S.Message>
        )}
      </S.SummaryCard>
      <S.LiveCard>
        <S.CardHeading>
          Live Proposals
          <S.Count>{live === undefined ? "-" : formatGovernanceNumber(live.length)}</S.Count>
        </S.CardHeading>
        {liveError || (live?.length === 0 && latestError) ? (
          <S.Message role="alert">Unable to load proposals.</S.Message>
        ) : live === undefined || (live.length === 0 && latest === undefined) ? (
          <S.Message role="status">Loading proposals…</S.Message>
        ) : live.length > 0 ? (
          live.map(proposal => {
            const href = getUrlWithNetwork(`/governance/${proposal.id}`);
            return (
              <S.LiveProposal
                key={proposal.id}
                role="link"
                tabIndex={0}
                aria-label={`View live proposal #${proposal.id}`}
                onClick={event => {
                  if (event.defaultPrevented || (event.target as Element).closest("a, button, input")) return;
                  void router.push(href);
                }}
                onKeyDown={event => {
                  if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
                  event.preventDefault();
                  void router.push(href);
                }}
              >
                <S.ProposalLink href={href}>
                  #{proposal.id} {decodeGovernanceTitle(proposal.title)}
                </S.ProposalLink>
                <VoteBreakdown votes={proposal.votes} status={proposal.status} />
              </S.LiveProposal>
            );
          })
        ) : latest?.length ? (
          <S.LatestProposal>
            <div>No active proposals</div>
            <small>
              <S.LatestLink href={getUrlWithNetwork(`/governance/${latest[0].id}`)}>
                Latest #{latest[0].id} {decodeGovernanceTitle(latest[0].title)}
              </S.LatestLink>
              {" · "}
              {STATUS_LABELS[latest[0].status]}
            </small>
          </S.LatestProposal>
        ) : (
          <S.Message>No proposals yet</S.Message>
        )}
      </S.LiveCard>
    </S.SummaryGrid>
  );
};

interface ProposalTableProps {
  proposals: GovernanceProposal[];
  sort?: GovernanceSort<"id" | "status">;
  onSort: (sort: GovernanceSort<"id" | "status"> | undefined) => void;
}

export const GovernanceProposalTable = ({ proposals, sort, onSort }: ProposalTableProps) => {
  const { getUrlWithNetwork } = useNetwork();
  const router = useRouter();

  return (
    <S.Scroll>
      <S.Table aria-label="Governance proposals">
        <colgroup>
          <col style={{ width: "8%" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "30%" }} />
        </colgroup>
        <thead>
          <tr>
            <SortHeader label="ID" field="id" sort={sort} onSort={onSort} />
            <th scope="col">Title</th>
            <th scope="col">Proposer</th>
            <SortHeader label="Status" field="status" sort={sort} onSort={onSort} />
            <th scope="col">Votes</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map(proposal => {
            const href = getUrlWithNetwork(`/governance/${proposal.id}`);
            const proposerName = proposal.proposer.nameTag?.replace(/^@/, "");
            const proposer = proposerName || proposal.proposer.address || "-";
            return (
              <S.ProposalRow
                key={proposal.id}
                tabIndex={0}
                aria-label={`View proposal #${proposal.id}`}
                onClick={event => {
                  if (event.defaultPrevented || (event.target as Element).closest("a, button, input")) return;
                  void router.push(href);
                }}
                onKeyDown={event => {
                  if (event.target !== event.currentTarget || (event.key !== "Enter" && event.key !== " ")) return;
                  event.preventDefault();
                  void router.push(href);
                }}
              >
                <td>#{proposal.id}</td>
                <td>
                  <S.ProposalLink href={href} title={decodeGovernanceTitle(proposal.title)}>
                    {decodeGovernanceTitle(proposal.title)}
                  </S.ProposalLink>
                </td>
                <td>
                  <S.ProposerName title={proposer}>{proposerName || textEllipsis(proposer, 8)}</S.ProposerName>
                </td>
                <td>
                  <ProposalStatusBadge status={proposal.status} />
                </td>
                <td>
                  <VoteBreakdown votes={proposal.votes} status={proposal.status} />
                </td>
              </S.ProposalRow>
            );
          })}
          {proposals.length === 0 && (
            <tr>
              <td colSpan={5}>
                <S.Message>No proposals to display</S.Message>
              </td>
            </tr>
          )}
        </tbody>
      </S.Table>
    </S.Scroll>
  );
};

interface MemberTableProps {
  members: GovernanceMember[];
  sort?: GovernanceSort<"tier" | "power">;
  onSort: (sort: GovernanceSort<"tier" | "power"> | undefined) => void;
}

export const GovernanceMemberTable = ({ members, sort, onSort }: MemberTableProps) => (
  <S.Scroll>
    <S.Table $members aria-label="Governance members">
      <colgroup>
        <col style={{ width: "12%" }} />
        <col style={{ width: "28%" }} />
        <col style={{ width: "20%" }} />
        <col style={{ width: "24%" }} />
        <col style={{ width: "16%" }} />
      </colgroup>
      <thead>
        <tr>
          <SortHeader label="Tier" field="tier" sort={sort} onSort={onSort} />
          <th scope="col">Address</th>
          <SortHeader label="Voting Power" field="power" sort={sort} onSort={onSort} />
          <th scope="col">Votes Cast</th>
          <th scope="col" className="right">
            Proposed
          </th>
        </tr>
      </thead>
      <tbody>
        {members.map(member => (
          <tr key={member.address}>
            <td>
              <TierBadge tier={member.tier} />
            </td>
            <td>
              <GovernanceAccountView account={{ address: member.address, nameTag: null }} addressOnly />
            </td>
            <td>{formatGovernanceNumber(member.power)}</td>
            <td>
              <S.MemberVotes>
                <span>{formatGovernanceNumber(member.votes.total)}</span>
                <S.VoteTrack aria-hidden="true">
                  {(["yes", "no", "abstain"] as const).map(choice => (
                    <S.VoteSegment
                      key={choice}
                      $choice={choice}
                      $width={
                        member.votes.total > 0 ? Math.min(100, (member.votes[choice] / member.votes.total) * 100) : 0
                      }
                    />
                  ))}
                </S.VoteTrack>
                <small>
                  Yes {formatGovernanceNumber(member.votes.yes)} · No {formatGovernanceNumber(member.votes.no)} ·
                  Abstain {formatGovernanceNumber(member.votes.abstain)}
                </small>
              </S.MemberVotes>
            </td>
            <td className="right">{formatGovernanceNumber(member.proposalsAuthored)}</td>
          </tr>
        ))}
        {members.length === 0 && (
          <tr>
            <td colSpan={5}>
              <S.Message>No members to display</S.Message>
            </td>
          </tr>
        )}
      </tbody>
    </S.Table>
  </S.Scroll>
);
