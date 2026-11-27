import React from "react";
import { useRouter } from "next/router";

import { HeaderRowItem } from "@/components/ui/datatable/header/header-row-item";
import { useNetwork } from "@/common/hooks/use-network";
import { decodeGovernanceTitle, formatGovernanceNumber } from "@/common/utils/governance-util";
import { textEllipsis } from "@/common/utils/string-util";
import { GovernanceMember, GovernanceProposal, GovernanceSummary } from "@/models/api/governance";
import IconArrow from "@/assets/svgs/icon-arrow.svg";
import { ArrowButton } from "@/components/view/common/title-option/TitleOption.styles";
import {
  getProposalStatusLabel,
  GovernanceAccountView,
  ProposalStatusBadge,
  TierBadge,
  VoteBreakdown,
} from "./governance-common";
import * as S from "./governance-list.styles";

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

const LiveHeading = ({ count, children }: { count?: number; children?: React.ReactNode }) => (
  <S.LiveHeading>
    <S.CardHeading>
      Live Proposals
      <S.Count>{count === undefined ? "-" : formatGovernanceNumber(count)}</S.Count>
    </S.CardHeading>
    {children}
  </S.LiveHeading>
);

const getLiveProposalStep = (element: HTMLDivElement) => {
  const first = element.children[0] as HTMLElement;
  const second = element.children[1] as HTMLElement | undefined;
  return second ? second.offsetLeft - first.offsetLeft : element.clientWidth;
};

const LiveProposalCarousel = ({ proposals }: { proposals: GovernanceProposal[] }) => {
  const { getUrlWithNetwork } = useNetwork();
  const router = useRouter();
  const viewport = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);
  const navigate = (direction: number) => {
    const element = viewport.current;
    if (element) element.scrollTo({ left: (index + direction) * getLiveProposalStep(element) });
  };

  return (
    <>
      <LiveHeading count={proposals.length}>
        {proposals.length > 1 && (
          <S.LiveControls>
            <ArrowButton
              as="button"
              type="button"
              aria-label="Previous live proposal"
              disabled={index === 0}
              onClick={() => navigate(-1)}
            >
              <IconArrow className="icon-arrow-right" />
            </ArrowButton>
            <ArrowButton
              as="button"
              type="button"
              aria-label="Next live proposal"
              disabled={index === proposals.length - 1}
              onClick={() => navigate(1)}
            >
              <IconArrow />
            </ArrowButton>
          </S.LiveControls>
        )}
      </LiveHeading>
      <S.LiveViewport
        ref={viewport}
        role="region"
        aria-label="Live proposals"
        aria-roledescription="carousel"
        tabIndex={0}
        onScroll={event => {
          const element = event.currentTarget;
          const step = getLiveProposalStep(element);
          if (step > 0) setIndex(Math.max(0, Math.min(proposals.length - 1, Math.round(element.scrollLeft / step))));
        }}
      >
        {proposals.map(proposal => {
          const href = getUrlWithNetwork(`/governance/${proposal.id}`);
          return (
            <S.LiveProposal
              key={proposal.id}
              onClick={event => {
                if (event.defaultPrevented || (event.target as Element).closest("a, button, input")) return;
                void router.push(href);
              }}
            >
              <S.ProposalLink href={href}>
                #{proposal.id} {decodeGovernanceTitle(proposal.title)}
              </S.ProposalLink>
              <VoteBreakdown votes={proposal.votes} status={proposal.status} />
            </S.LiveProposal>
          );
        })}
      </S.LiveViewport>
    </>
  );
};

export const GovernanceSummaryCards = ({
  summary,
  summaryError,
  live,
  liveError,
  latest,
  latestError,
}: SummaryProps) => {
  const { getUrlWithNetwork } = useNetwork();

  return (
    <S.SummaryGrid>
      <S.ProposalsSummaryCard aria-label="Proposals summary">
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
      </S.ProposalsSummaryCard>
      <S.LiveCard>
        {!liveError && live && live.length > 0 ? (
          <LiveProposalCarousel key={live.map(proposal => proposal.id).join(",")} proposals={live} />
        ) : (
          <>
            <LiveHeading count={live?.length} />
            {liveError || (live?.length === 0 && latestError) ? (
              <S.Message role="alert">Unable to load proposals.</S.Message>
            ) : live === undefined || (live.length === 0 && latest === undefined) ? (
              <S.Message role="status">Loading proposals…</S.Message>
            ) : latest?.length ? (
              <S.LatestProposal>
                <div>No active proposals</div>
                <small>
                  <S.LatestLink href={getUrlWithNetwork(`/governance/${latest[0].id}`)}>
                    Latest #{latest[0].id} {decodeGovernanceTitle(latest[0].title)}
                  </S.LatestLink>
                  {" · "}
                  {getProposalStatusLabel(latest[0].status)}
                </small>
              </S.LatestProposal>
            ) : (
              <S.Message>No proposals yet</S.Message>
            )}
          </>
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
                onClick={event => {
                  if (event.defaultPrevented || (event.target as Element).closest("a, button, input")) return;
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
