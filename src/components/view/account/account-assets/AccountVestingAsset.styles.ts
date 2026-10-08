import styled from "styled-components";

import { DEVICE_TYPE } from "@/common/values/ui.constant";

export const Box = styled.div<{ breakpoint: DEVICE_TYPE }>`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  min-width: 0;
  padding: ${({ breakpoint }) => (breakpoint === DEVICE_TYPE.DESKTOP ? "16px 24px" : "12px 16px")};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 4px;
`;

export const Chevron = styled.span<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(${({ $isExpanded }) => ($isExpanded ? "0deg" : "180deg")});
  transition: transform 150ms ease;

  path {
    transition: stroke 150ms ease;
  }
`;

export const HeaderButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  gap: 16px;

  &:hover ${Chevron} path,
  &:focus-visible ${Chevron} path {
    stroke: ${({ theme }) => theme.colors.reverse};
  }
`;

export const Balance = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;

  .vesting-lock path {
    stroke: ${({ theme }) => theme.colors.tertiary};
  }
`;

export const AmountInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

export const Quantity = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ExpandableContent = styled.div<{ $isExpanded: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isExpanded }) => ($isExpanded ? "1fr" : "0fr")};
  margin-top: ${({ $isExpanded }) => ($isExpanded ? "16px" : "0")};
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  transition: grid-template-rows 0.4s ease, margin-top 0.4s ease, opacity 0.4s ease;
`;

export const ExpandableInner = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: 16px;
  overflow: hidden;
`;

export const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 16px;
`;

export const LogoWrapper = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;

  img {
    width: 40px;
    height: 40px;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.vestingTrack};
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

export const ProgressTrack = styled.div<{ $disabled?: boolean }>`
  width: 100%;
  height: 8px;
  overflow: hidden;
  background-color: ${({ theme, $disabled }) => ($disabled ? theme.colors.pantone : theme.colors.vestingTrack)};
  border-radius: 999px;
`;

export const ProgressValue = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.vestingProgress};
  border-radius: inherit;
`;

export const ProgressSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;
