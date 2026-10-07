import styled from "styled-components";

import { DEVICE_TYPE } from "@/common/values/ui.constant";

export const Box = styled.div<{ breakpoint: DEVICE_TYPE }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  min-width: 0;
  padding: ${({ breakpoint }) => (breakpoint === DEVICE_TYPE.DESKTOP ? "16px 24px" : "12px 16px")};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 4px;
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
`;

export const Balance = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
`;

export const Chevron = styled.span<{ $isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(${({ $isExpanded }) => ($isExpanded ? "0deg" : "180deg")});
  transition: transform 150ms ease;
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
  background-color: ${({ theme }) => theme.colors.dimmed100};
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

export const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.dimmed100};
  border-radius: 999px;
`;

export const ProgressValue = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.green};
  border-radius: inherit;
`;

export const ProgressSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;
