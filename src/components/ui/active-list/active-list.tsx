import {eachMedia} from '@/common/hooks/use-media';
import React, {useState} from 'react';
import styled, {CSSProperties} from 'styled-components';
import mixins from '@/styles/mixins';
import {v1} from 'uuid';
import {StyledText} from '@/components/view/main-active-list/main-active-list';
import Tooltip from '../tooltip';
import {Button} from '../button';
import IconInfo from '@/assets/svgs/icon-info.svg';
import {scrollbarStyle, useScrollbar} from '@/common/hooks/use-scroll-bar';
interface ActiveListProps {
  title: string[];
  colWidth: string[];
  children: React.ReactNode;
}

const hasTooltipTitle = ['Unique Users'];

const ActiveList = ({title, colWidth, children}: ActiveListProps) => {
  const media = eachMedia();
  const {scrollVisible, onFocusIn, onFocusOut} = useScrollbar();

  return (
    <ListContainer onMouseEnter={onFocusIn} onMouseLeave={onFocusOut}>
      <ListTitleWrap>
        {title.map((v: string, i: number) => (
          <StyledText
            key={v1()}
            type={media === 'desktop' ? 'p4' : 'body1'}
            width={colWidth[i]}
            color="tertiary"
            gap={hasTooltipTitle.includes(v) ? '8px' : '0px'}>
            {v}
            {hasTooltipTitle.includes(v) && (
              <Tooltip
                content="Number of users who created a thread, reply or repost 
              (excl. duplicates) in the board.">
                <Button width="16px" height="16px" radius="50%" bgColor="surface">
                  <IconInfo className="svg-info-tooltip-icon" />
                </Button>
              </Tooltip>
            )}
          </StyledText>
        ))}
      </ListTitleWrap>
      <ListContentWrap className={scrollVisible ? 'scroll-visible' : ''}>
        {children}
      </ListContentWrap>
    </ListContainer>
  );
};

const ListContainer = styled.div`
  ${mixins.flexbox('column', 'flex-start', 'flex-start')};
  ${scrollbarStyle};
  width: 100%;
  height: 280px;
  overflow: auto hidden;
  margin-top: 16px;
  border-radius: 10px;
  background-color: ${({theme}) => theme.colors.base};
  overflow-y: overlay;
`;

const ListTitleWrap = styled.div`
  ${mixins.flexbox('row', 'center', 'space-between')};
  height: 40px;
  width: 100%;
`;

const ListContentWrap = styled.div`
  ${mixins.flexbox('column', 'flex-start', 'flex-start')};
  overflow: hidden auto;
  height: 240px;
  min-width: 100%;

  &::-webkit-scrollbar {
    display: block;
  }

  &::-webkit-scrollbar-thumb {
    display: none;
  }

  &.scroll-visible {
    overflow: hidden auto;
    overflow-y: overlay;
  }

  &.scroll-visible::-webkit-scrollbar {
    display: block;
    width: 4px;
  }

  &.scroll-visible::-webkit-scrollbar-thumb {
    width: 4px;
    position: absolute;
    display: block;
    border-radius: 8px;
    background-color: ${({theme}) => theme.colors.dimmed50};
  }
`;

export default ActiveList;
