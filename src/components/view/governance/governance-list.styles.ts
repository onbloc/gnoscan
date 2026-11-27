import Link from "next/link";
import styled from "styled-components";

import { media } from "@/common/values/ui.constant";
import { Card as ListSummaryCard } from "@/components/view/list-summary/ListSummary.styles";

export const Subtitle = styled.p`
  margin-top: 4px;
  ${({ theme }) => theme.fonts.p4};
  color: ${({ theme }) => theme.colors.tertiary};
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  ${media.MOBILE} {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const ProposalsSummaryCard = styled(ListSummaryCard)`
  ${media.NOT_DESKTOP} {
    align-self: start;

    > h3 {
      display: none;
    }

    > [role="status"],
    > [role="alert"] {
      padding: 0;
      text-align: left;
      ${({ theme }) => theme.fonts.p4};
    }
  }
`;

export const CardHeading = styled.h3`
  display: flex;
  align-items: center;
  gap: 6px;
  ${({ theme }) => theme.fonts.p4};
  color: ${({ theme }) => theme.colors.tertiary};
`;

export const Count = styled.span`
  padding: 0 8px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.dimmed100};
  color: ${({ theme }) => theme.colors.primary};
  ${({ theme }) => theme.fonts.body1};
`;

export const TabCount = styled(Count)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  border-radius: 14px;
  background-color: ${({ theme }) => theme.colors.surface};
  ${({ theme }) => theme.fonts.p4};

  ${media.DESKTOP} {
    min-width: 28px;
    height: 28px;
  }
`;

export const Stats = styled.dl`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  > div {
    padding: 12px 16px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.surface};
  }

  dt {
    ${({ theme }) => theme.fonts.p4};
    color: ${({ theme }) => theme.colors.tertiary};
  }

  dd {
    margin-top: 2px;
    ${({ theme }) => theme.fonts.h4};
    font-weight: 700;
  }

  ${media.NOT_DESKTOP} {
    display: flex;
    justify-content: space-between;
    gap: 4px;
    white-space: nowrap;

    > div {
      display: flex;
      align-items: baseline;
      gap: 4px;
      padding: 0;
      border-radius: 0;
      background: transparent;
    }

    dt {
      ${({ theme }) => theme.fonts.body1};
    }

    dd {
      margin-top: 0;
      ${({ theme }) => theme.fonts.p3};
      font-weight: 600;
    }
  }
`;

export const LiveCard = styled(ListSummaryCard)`
  overflow: hidden;
`;

export const LiveHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const LiveControls = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  ${media.MOBILE} {
    display: none;
  }
`;

export const LiveViewport = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }
`;

export const LiveProposal = styled.article`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  flex: 0 0 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  cursor: pointer;

  > a {
    ${({ theme }) => theme.fonts.p4};
  }
`;

export const ProposalLink = styled(Link)`
  display: block;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.blue};
  text-overflow: ellipsis;
  white-space: nowrap;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue};
    outline-offset: -2px;
  }
`;

export const ProposerName = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const LatestProposal = styled.div`
  margin: auto;
  text-align: center;
  color: ${({ theme }) => theme.colors.tertiary};

  small {
    display: block;
    margin-top: 4px;
    ${({ theme }) => theme.fonts.body1};
  }
`;

export const LatestLink = styled(Link)`
  color: ${({ theme }) => theme.colors.blue};
`;

export const Message = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: ${({ theme }) => theme.colors.tertiary};
`;

export const Panel = styled.section`
  min-width: 0;
  border-radius: 10px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.base};
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 24px;
  padding: 24px 24px 0;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 24px;
`;

export const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.tertiary)};
  ${({ theme, $active }) => ($active ? theme.fonts.h6 : theme.fonts.h7)};

  ${media.DESKTOP} {
    ${({ theme, $active }) => ($active ? theme.fonts.h4 : theme.fonts.h6)};
  }
`;

export const Search = styled.div`
  display: flex;
  align-items: center;
  width: 240px;
  max-width: 100%;
  height: 36px;
  margin-left: auto;

  > label {
    width: 100%;
    height: 36px;
    background-color: ${({ theme }) => theme.colors.surface};
  }

  ${media.NOT_MOBILE} {
    /* Keep one-row search controls from stretching the shared heading height. */
    height: 0;
  }
`;

export const Scroll = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 16px 24px 20px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Table = styled.table<{ $members?: boolean }>`
  width: 100%;
  min-width: ${({ $members }) => ($members ? "760px" : "920px")};
  table-layout: fixed;
  border-collapse: collapse;
  ${({ theme }) => theme.fonts.p4};

  a {
    color: ${({ theme }) => theme.colors.blue};
  }

  th,
  td {
    padding: 16px;
    text-align: left;
    vertical-align: middle;
    border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed50};
  }

  th {
    font-weight: 400;
    color: ${({ theme }) => theme.colors.tertiary};
    white-space: nowrap;
  }

  tbody tr:hover td {
    background-color: ${({ theme }) => theme.colors.dimmed50};
  }

  .right {
    text-align: right;
  }
`;

export const ProposalRow = styled.tr`
  cursor: pointer;
`;

export const SortHeaderCell = styled.th`
  > div {
    min-width: 0;
    width: 100%;
    padding: 0;
    gap: 4px;
  }
`;

export const MemberVotes = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 10px;

  small {
    width: 100%;
    ${({ theme }) => theme.fonts.body1};
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

export const VoteTrack = styled.div`
  display: flex;
  width: 90px;
  height: 8px;
  overflow: hidden;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.dimmed100};
`;

export const VoteSegment = styled.span<{ $width: number; $choice: "yes" | "no" | "abstain" }>`
  width: ${({ $width }) => $width}%;
  background-color: ${({ theme, $choice }) =>
    $choice === "yes" ? theme.colors.green : $choice === "no" ? theme.colors.failed : theme.colors.pending};
`;
