import { eachMedia } from "@/common/hooks/use-media";
import React, { useState } from "react";
import styled, { CSSProperties } from "styled-components";
import mixins from "@/styles/mixins";
import { v1 } from "uuid";
import { StyledText } from "@/components/view/main-active-list/main-active-list";
import Tooltip from "../tooltip";
import { Button } from "../button";
import IconInfo from "@/assets/svgs/icon-info.svg";
import { scrollbarStyle, useScrollbar } from "@/common/hooks/use-scroll-bar";
interface ActiveListProps {
  title: string[];
  colWidth: string[];
  children: React.ReactNode;
}

const hasTooltipTitle = ["Unique Users"];

const ActiveList = ({ title, colWidth, children }: ActiveListProps) => {
  const media = eachMedia();
  const { scrollVisible, onFocusIn, onFocusOut } = useScrollbar();

  return (
    <ListContainer onMouseEnter={onFocusIn} onMouseLeave={onFocusOut}>
      <div className="scroll-wrap">
        <ListTitleWrap>
          {title.map((v: string, i: number) => (
            <StyledText
              key={v1()}
              type={media === "desktop" ? "p4" : "body1"}
              width={colWidth[i]}
              color="tertiary"
              gap={hasTooltipTitle.includes(v) ? "8px" : "0px"}
            >
              {v}
              {hasTooltipTitle.includes(v) && (
                <Tooltip
                  content="Number of users who created a thread, reply or repost 
              (excl. duplicates) in the board."
                >
                  <Button width="16px" height="16px" radius="50%" bgColor="surface">
                    <IconInfo className="svg-info-tooltip-icon" />
                  </Button>
                </Tooltip>
              )}
            </StyledText>
          ))}
        </ListTitleWrap>
        <ListContentWrap className={scrollVisible ? "scroll-visible" : ""}>{children}</ListContentWrap>
      </div>
    </ListContainer>
  );
};

const ListContainer = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  height: 280px;
  margin-top: 16px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.base};
  overflow: hidden;

  .scroll-wrap {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    overflow: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const ListTitleWrap = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  height: 40px;
  width: 100%;
`;

const ListContentWrap = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  overflow: hidden;
  height: 240px;
  min-width: 100%;
  ${scrollbarStyle};
`;

export default ActiveList;
