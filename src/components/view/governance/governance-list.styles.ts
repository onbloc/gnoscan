import Link from "next/link";
import styled from "styled-components";

import { media } from "@/common/values/ui.constant";

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

export const SummaryCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding: 20px 24px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.base};
`;

export const ProposalsSummaryCard = styled(SummaryCard)`
  ${media.NOT_DESKTOP} {
    align-self: start;
    padding: 16px;

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
  gap: 8px;
  ${({ theme }) => theme.fonts.h6};
`;

export const Count = styled.span`
  padding: 0 8px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.dimmed100};
  ${({ theme }) => theme.fonts.body1};
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

export const LiveCard = styled(SummaryCard)`
  overflow: hidden;

  ${media.NOT_DESKTOP} {
    padding: 16px;
  }
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

  ${media.NOT_DESKTOP} {
    > a {
      ${({ theme }) => theme.fonts.p4};
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue};
    outline-offset: -2px;
  }
`;

export const ProposalLink = styled(Link)`
  display: block;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.blue};
  text-overflow: ellipsis;
  white-space: nowrap;
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
  gap: 12px 28px;
  padding: 0 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed100};
`;

export const Tabs = styled.div`
  display: flex;
  gap: 28px;
`;

export const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 18px 0 14px;
  margin-bottom: -1px;
  border-bottom: 2px solid ${({ theme, $active }) => ($active ? theme.colors.primary : "transparent")};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.tertiary)};
  ${({ theme }) => theme.fonts.p3};
  font-weight: ${({ $active }) => ($active ? 500 : 400)};
`;

export const Search = styled.div`
  width: 240px;
  margin-left: auto;

  > label {
    width: 100%;
    height: 36px;
    background-color: ${({ theme }) => theme.colors.surface};
  }

  @media (max-width: 600px) {
    margin-bottom: 12px;
  }
`;

export const Scroll = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 8px 24px 20px;
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

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue};
    outline-offset: -2px;
  }
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
