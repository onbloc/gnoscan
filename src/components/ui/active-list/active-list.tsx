import {eachMedia} from '@/common/hooks/use-media';
import React, {useRef, useState} from 'react';
import styled from 'styled-components';
import mixins from '@/styles/mixins';
import {v1} from 'uuid';
import {StyledText} from '@/components/view/main-active-list/main-active-list';

interface ActiveListProps {
  title: string[];
  colWidth: string[];
  children: React.ReactNode;
}

const ActiveList = ({title, colWidth, children}: ActiveListProps) => {
  const media = eachMedia();
  const [scrollVisible, setScrollVisible] = useState(false);

  const onFocusIn = () => {
    setScrollVisible(true);
  };

  const onFocusOut = () => {
    setScrollVisible(false);
  };

  return (
    <ListContainer
      className={!scrollVisible ? 'scroll-visible' : ''}
      onMouseEnter={onFocusIn}
      onMouseLeave={onFocusOut}>
      <ListTitleWrap>
        {title.map((v: string, i: number) => (
          <StyledText
            key={v1()}
            type={media === 'desktop' ? 'p4' : 'body1'}
            width={colWidth[i]}
            color="tertiary">
            {v}
          </StyledText>
        ))}
      </ListTitleWrap>
      <ListContentWrap>{children}</ListContentWrap>
    </ListContainer>
  );
};

const ListContainer = styled.div`
  ${mixins.flexbox('column', 'flex-start', 'flex-start')};
  width: 100%;
  height: 280px;
  overflow: auto hidden;
  margin-top: 16px;
  border-radius: 10px;
  background-color: ${({theme}) => theme.colors.base};

  &.scroll-visible {
    overflow: hidden scroll;
  }

  &.scroll-visible::-webkit-scrollbar {
    width: 5px;
    display: block;
  }

  &.scroll-visible::-webkit-scrollbar-track {
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: black !important;
    display: block !important;
  }
  ::-webkit-scrollbar-button {
    width: 20px;
    height: 10px;
  }
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
`;

export default ActiveList;
