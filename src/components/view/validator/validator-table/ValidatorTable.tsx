import React, { useState, useCallback } from "react";

import {
  ValidatorModel,
  ValidatorStatus,
  ValidatorCommitModel,
  ValidatorCommitItem,
} from "@/models/api/validator/validator-model";
import { textEllipsis } from "@/common/utils/string-util";
import { getDateDiff, getLocalDateString, formatDate } from "@/common/utils/date-util";
import { useNetwork } from "@/common/hooks/use-network";
import Tooltip from "@/components/ui/tooltip";
import IconLink from "@/assets/svgs/icon-link.svg";

import * as S from "./ValidatorTable.styles";

interface ValidatorTableProps {
  validators: ValidatorModel[];
  commits: ValidatorCommitModel[];
  fromHeight: number | null;
  toHeight: number | null;
  commitSize: number;
}

const COLUMN_WIDTHS = {
  name: "210px",
  status: "133px",
  address: "160px",
  shares: "120px",
  startTime: "180px",
  profile: "160px",
};

const STATUS_DISPLAY_MAP: Record<ValidatorStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  JAILED: "Jailed",
  PENDING: "Pending",
};

const ValidatorTable = ({ validators, commits, fromHeight, toHeight, commitSize }: ValidatorTableProps) => {
  const { getUrlWithNetwork, gnoWebUrl } = useNetwork();

  const getCommitsByAddress = useCallback(
    (address: string) => {
      return commits.find(c => c.validatorAddress === address)?.commits ?? [];
    },
    [commits],
  );

  const getCommitColor = useCallback((signed: boolean, status: ValidatorStatus): string => {
    if (status === "PENDING") return "#9BA9BE";
    return signed ? "#00C59A" : "#FF4D4F";
  }, []);

  const getProposalUrl = useCallback(
    (proposalId: string | null) => {
      if (!proposalId || !gnoWebUrl) return null;
      return `${gnoWebUrl}/r/gov/dao:${proposalId}`;
    },
    [gnoWebUrl],
  );

  const getProfileUrl = useCallback(
    (address: string) => {
      if (!gnoWebUrl) return null;
      return `${gnoWebUrl}/r/gnops/valopers:${address}`;
    },
    [gnoWebUrl],
  );

  if (validators.length === 0) {
    return (
      <S.Container>
        <S.NoDataWrapper>No data to display</S.NoDataWrapper>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Table>
        <S.HeaderRow>
          <S.HeaderCell width={COLUMN_WIDTHS.name}>Validator Name</S.HeaderCell>
          <S.HeaderCell width={COLUMN_WIDTHS.status}>Status</S.HeaderCell>
          <S.HeaderCell width={COLUMN_WIDTHS.address}>Address</S.HeaderCell>
          <S.HeaderCell width={COLUMN_WIDTHS.shares}>Shares</S.HeaderCell>
          <S.HeaderCell width={COLUMN_WIDTHS.startTime}>Start Time</S.HeaderCell>
          <S.HeaderCell width={COLUMN_WIDTHS.profile}>Profile</S.HeaderCell>
          <S.HeaderCell flex align="right">
            Last 20 blocks
          </S.HeaderCell>
        </S.HeaderRow>

        {validators.map(validator => {
          const proposalUrl = getProposalUrl(validator.proposalId);
          const profileUrl = getProfileUrl(validator.address);

          return (
            <S.DataRow key={validator.address}>
              <S.DataCell width={COLUMN_WIDTHS.name}>
                <S.LinkText href={getUrlWithNetwork(`/account/${validator.address}`)}>
                  {validator.monikerName || textEllipsis(validator.address, 6)}
                </S.LinkText>
              </S.DataCell>
              <S.DataCell width={COLUMN_WIDTHS.status}>
                <StatusBadgeCell status={validator.status} proposalUrl={proposalUrl} />
              </S.DataCell>
              <S.DataCell width={COLUMN_WIDTHS.address}>
                <AddressCell address={validator.address} />
              </S.DataCell>
              <S.DataCell width={COLUMN_WIDTHS.shares}>{validator.shareRate}%</S.DataCell>
              <S.DataCell width={COLUMN_WIDTHS.startTime}>
                <StartTimeCell timestamp={validator.firstCommittedTime} />
              </S.DataCell>
              <S.DataCell width={COLUMN_WIDTHS.profile}>
                <ProfileCell profileUrl={profileUrl} />
              </S.DataCell>
              <S.DataCell flex align="right">
                <CommitBar
                  commits={getCommitsByAddress(validator.address)}
                  status={validator.status}
                  getCommitColor={getCommitColor}
                  fromHeight={fromHeight}
                  toHeight={toHeight}
                  commitSize={commitSize}
                />
              </S.DataCell>
            </S.DataRow>
          );
        })}
      </S.Table>
    </S.Container>
  );
};

const StatusBadgeCell = ({ status, proposalUrl }: { status: ValidatorStatus; proposalUrl: string | null }) => {
  const badge = (
    <S.StatusBadge status={status} clickable={!!proposalUrl}>
      {STATUS_DISPLAY_MAP[status]}
    </S.StatusBadge>
  );

  if (proposalUrl) {
    return (
      <a href={proposalUrl} target="_blank" rel="noopener noreferrer">
        {badge}
      </a>
    );
  }

  return badge;
};

const AddressCell = ({ address }: { address: string }) => {
  const { getUrlWithNetwork } = useNetwork();

  return (
    <Tooltip content={<S.TooltipContent>{address}</S.TooltipContent>}>
      <S.LinkText className="ellipsis" href={getUrlWithNetwork(`/account/${address}`)}>
        {textEllipsis(address, 6)}
      </S.LinkText>
    </Tooltip>
  );
};

const StartTimeCell = ({ timestamp }: { timestamp: string }) => {
  if (!timestamp) return <>-</>;

  const formattedDate = formatDate(timestamp);
  if (formattedDate === "-") return <>-</>;

  return (
    <Tooltip content={<S.TooltipContent>{getLocalDateString(timestamp)}</S.TooltipContent>}>
      <span>{getDateDiff(timestamp)}</span>
    </Tooltip>
  );
};

const ProfileCell = ({ profileUrl }: { profileUrl: string | null }) => {
  if (!profileUrl) return <>-</>;

  return (
    <S.ProfileLink href={profileUrl} target="_blank" rel="noopener noreferrer">
      Gnoweb
      <IconLink />
    </S.ProfileLink>
  );
};

interface CommitBarProps {
  commits: ValidatorCommitItem[];
  status: ValidatorStatus;
  getCommitColor: (signed: boolean, status: ValidatorStatus) => string;
  fromHeight: number | null;
  toHeight: number | null;
  commitSize: number;
}

const getFallbackColor = (status: ValidatorStatus): string => {
  if (status === "PENDING") return "#9BA9BE";
  return "#FF4D4F";
};

const trimToSize = <T,>(arr: T[], size: number): T[] => {
  if (arr.length <= size) return arr;
  return arr.slice(arr.length - size);
};

const CommitBar = ({ commits, status, getCommitColor, fromHeight, toHeight, commitSize }: CommitBarProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (commits.length === 0) {
    const fallbackColor = getFallbackColor(status);
    const totalRange = fromHeight != null && toHeight != null ? toHeight - fromHeight + 1 : commitSize;
    const barCount = Math.min(totalRange, commitSize);
    const startHeight = toHeight != null ? toHeight - barCount + 1 : fromHeight;

    return (
      <S.CommitBarContainer>
        {Array.from({ length: barCount }).map((_, index) => {
          const height = startHeight != null ? startHeight + index : null;
          return (
            <S.CommitBlock
              key={index}
              color={fallbackColor}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {hoveredIndex === index && height != null && <S.CommitTooltip>{height}</S.CommitTooltip>}
            </S.CommitBlock>
          );
        })}
      </S.CommitBarContainer>
    );
  }

  const trimmedCommits = trimToSize(commits, commitSize);

  return (
    <S.CommitBarContainer>
      {trimmedCommits.map((commit, index) => (
        <S.CommitBlock
          key={commit.height}
          color={getCommitColor(commit.signed, status)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {hoveredIndex === index && <S.CommitTooltip>{commit.height}</S.CommitTooltip>}
        </S.CommitBlock>
      ))}
    </S.CommitBarContainer>
  );
};

export default ValidatorTable;
