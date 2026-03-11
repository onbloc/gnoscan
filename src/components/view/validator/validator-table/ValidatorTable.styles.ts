import { ValidatorStatus } from "@/models/api/validator/validator-model";
import theme from "@/styles/theme";
import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.base};
  border-radius: 10px;
  overflow-x: auto;
  padding: 20px 24px;

  ::-webkit-scrollbar {
    width: 0;
    display: none;
  }
`;

export const Table = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 1146px;
`;

export const HeaderRow = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed50};
  align-items: center;
`;

export const HeaderCell = styled.div<{ width?: string; flex?: boolean; align?: string }>`
  display: flex;
  align-items: center;
  padding: 16px;
  ${theme.fonts.p4};
  font-weight: 400;
  color: ${({ theme }) => theme.colors.tertiary};
  white-space: nowrap;

  ${({ width }) =>
    width &&
    css`
      width: ${width};
      min-width: ${width};
      max-width: ${width};
    `}

  ${({ flex }) =>
    flex &&
    css`
      flex: 1 0 0;
      min-width: 0;
    `}

  ${({ align }) =>
    align === "right" &&
    css`
      justify-content: flex-end;
    `}
`;

export const DataRow = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed50};
  align-items: center;
`;

export const DataCell = styled.div<{ width?: string; flex?: boolean; align?: string }>`
  display: flex;
  align-items: center;
  padding: 16px;
  ${theme.fonts.p4};
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;

  ${({ width }) =>
    width &&
    css`
      width: ${width};
      min-width: ${width};
      max-width: ${width};
    `}

  ${({ flex }) =>
    flex &&
    css`
      flex: 1 0 0;
      min-width: 0;
    `}

  ${({ align }) =>
    align === "right" &&
    css`
      justify-content: flex-end;
    `}
`;

export const LinkText = styled.a`
  color: ${({ theme }) => theme.colors.blue};
  cursor: pointer;
  ${theme.fonts.p4};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: fit-content;
`;

const statusColorMap: Record<ValidatorStatus, string> = {
  ACTIVE: "#00C59A",
  PENDING: "#9BA9BE",
  INACTIVE: "#FF4D4F",
  JAILED: "#FF4D4F",
};

export const StatusBadge = styled.span<{ status: ValidatorStatus; clickable?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ status }) => statusColorMap[status]};

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;

      &:hover {
        opacity: 0.85;
      }
    `}
`;

export const ProfileLink = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.gray300};
  ${theme.fonts.p4};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;

    path {
      stroke: ${({ theme }) => theme.colors.gray300};
    }
  }
`;

export const TooltipContent = styled.span`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  justify-content: center;
  align-items: center;
  word-break: keep-all;
  white-space: nowrap;
`;

export const CommitBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const CommitBlock = styled.div<{ color: string }>`
  position: relative;
  width: 5px;
  height: 28px;
  background-color: ${({ color }) => color};
  cursor: pointer;
`;

export const CommitTooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.base};
  border-radius: 8px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 16px;
  white-space: nowrap;
  z-index: 10;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.tertiary};

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 8px;
    height: 8px;
    background-color: ${({ theme }) => theme.colors.base};
    margin-top: -4px;
  }
`;

export const NoDataWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100px;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.tertiary};
  font-weight: 400;
`;
