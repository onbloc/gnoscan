import React from "react";
import styled, { css } from "styled-components";
import Card from "@/components/ui/card";
import mixins from "@/styles/mixins";
import ActiveAccount from "./active-account";
import Text from "@/components/ui/text";
import { AmountText } from "@/components/ui/text/amount-text";
import { TextProps } from "@/components/ui/text/text";
import { PaletteKeyType } from "@/styles";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import ActiveAccountApi from "./active-account/active-account-api";
import ActiveLatestBlogs from "./active-latest-blogs/active-latest-blogs";
import { DEVICE_TYPE } from "@/common/values/ui.constant";

interface StyledTextProps extends TextProps {
  width?: string;
  gap?: string;
}

export const listTitle = {
  accounts: ["No.", "Account", "Total Txs", "Non-Transfer Txs", "Balance (GNOT)"],
  boards: ["No.", "Name", "Replies", "Reposts", "Unique Users"],
  blogs: ["No.", "Title", "Publisher"],
  newest: ["No.", "Path", "Publisher", "Functions", "Calls", "Block"],
};

export const colWidth = {
  accounts: ["52px", "127px", "114px", "138px", "127px"],
  boards: ["52px", "126.5px", "126.5px", "126.5px", "126.5px"],
  blogs: ["52px", "380px", "126px"],
  newest: ["52px", "101px", "101px", "101px", "101px", "102px"],
};

interface MainActiveListProps {
  breakpoint: DEVICE_TYPE;
}

const MainActiveList = ({ breakpoint }: MainActiveListProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  return (
    <Wrapper className={breakpoint}>
      {isCustomNetwork ? (
        <React.Fragment>
          <ActiveAccount />
          <ActiveLatestBlogs />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ActiveAccountApi />
          <ActiveLatestBlogs />
        </React.Fragment>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 16px;
  &.desktop {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 32px;
  }
  .svg-info-tooltip-icon {
    fill: ${({ theme }) => theme.colors.reverse};
  }
`;

export const List = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  /* max-width: 100%; */
  min-width: 100%;
  width: 100%;
  &:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed50};
  }
`;

export const StyledCard = styled(Card)`
  overflow: hidden;
  width: 100%;
  min-height: 368px;
  max-height: 408px;
  .active-list-title {
    ${mixins.flexbox("row", "center", "space-between")};
  }
  .icon-link {
    stroke: ${({ theme }) => theme.colors.reverse};
    margin-left: 5px;
  }
`;

const textStyle = css`
  padding: 12px;
  flex: 1;
  ${mixins.flexbox("row", "center", "flex-start")};
  :first-of-type {
    max-width: 52px;
  }
  &.with-link {
    a {
      ${mixins.flexbox("row", "center", "flex-start", false)};
      width: fit-content;
      max-width: 100%;
    }
  }
`;

export const StyledText = styled(Text)<StyledTextProps>`
  max-width: ${({ width }) => width};
  min-width: ${({ width }) => width};
  gap: ${({ gap }) => gap && gap};
  white-space: nowrap;
  ${textStyle};
`;

export const StyledAmountText = styled(AmountText)<{ width?: string; color?: PaletteKeyType }>`
  min-width: ${({ width }) => width};
  max-width: ${({ width }) => width};
  ${textStyle}

  & .amount-wrapper {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${({ theme, color }) => theme.colors[color ?? "reverse"]};
    & * {
      display: inline;
      white-space: nowrap;
    }
  }
`;

export const FitContentA = styled.span`
  width: fit-content;
`;

export default MainActiveList;
