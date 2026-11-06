import styled from "styled-components";

import mixins from "@/styles/mixins";
import { media } from "@/common/values/ui.constant";

// Fills the tab panel of the account activity tabs.
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
`;

export const RangeTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  // Sets the date filter button apart from the preset ranges.
  & > button:last-child {
    margin-left: 4px;
  }
`;

export const RangeButton = styled.button<{ $selected: boolean }>`
  height: 28px;
  padding: 0 12px;
  border-radius: 4px;
  ${({ theme }) => theme.fonts.h7};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.tertiary)};
  background-color: ${({ theme, $selected }) => ($selected ? theme.colors.surface : "transparent")};

  &:focus-visible {
    ${mixins.insetFocusRing()};
  }
`;

export const SummaryList = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
  width: 100%;

  ${media.DESKTOP} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
`;

export const SummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 4px;

  ${media.DESKTOP} {
    padding: 16px 24px;
  }
`;

export const SummaryAmount = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
`;

export const ChartArea = styled.div`
  position: relative;
  width: 100%;
  height: 240px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 4px;
  overflow: hidden;

  ${media.DESKTOP} {
    height: 300px;
    padding: 24px;
  }
`;

export const Notice = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;
