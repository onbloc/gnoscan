import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled, {css} from 'styled-components';
import {isDesktop} from '@/common/hooks/use-media';
import Text from '@/components/ui/text';
import {ViewMoreButton} from '@/components/ui/button';
import mixins from '@/styles/mixins';
import Tabs from '@/components/view/tabs';
import {LogDataType} from '@/components/view/tabs/tabs';
import {v1} from 'uuid';
import {scrollbarStyle, useScrollbar} from '@/common/hooks/use-scroll-bar';
interface StyleProps {
  desktop?: boolean;
  showLog?: boolean;
  isTabLog?: boolean;
  hasRadius?: boolean;
  active?: boolean;
}

interface ShowLogProps {
  isTabLog: boolean;
  logData?: string;
  tabData?: LogDataType;
  btnTextType: string;
}

const throttle = (func: Function, ms: number) => {
  let throttled = false;
  return (...args: any) => {
    if (!throttled) {
      throttled = true;
      setTimeout(() => {
        func(...args);
        throttled = false;
      }, ms);
    }
  };
};
const delay = 10;

const ShowLog = ({
  isTabLog,
  logData = '',
  tabData = {list: [], content: []},
  btnTextType = '',
}: ShowLogProps) => {
  const desktop: boolean = isDesktop();
  const [showLog, setShowLog] = useState(false);
  const [index, setIndex] = useState(0);
  const draggable = useRef<HTMLUListElement>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState<number>(0);
  const {scrollVisible, onFocusIn, onFocusOut} = useScrollbar();

  const onDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!draggable.current) return;
    setIsDrag(true);
    setStartX(e.pageX + draggable.current.scrollLeft);
  };

  const onDragEnd = () => setIsDrag(false);

  const onDragMove = (e: React.MouseEvent) => {
    if (!draggable.current) return;
    if (isDrag) {
      const {scrollWidth, clientWidth, scrollLeft} = draggable.current;
      draggable.current.scrollLeft = startX - e.pageX;
      if (scrollLeft === 0) {
        setStartX(e.pageX);
      } else if (scrollWidth <= clientWidth + scrollLeft) {
        setStartX(e.pageX + scrollLeft);
      }
    }
  };

  const showLogHandler = useCallback(() => {
    console.log(index, showLog);
    setIndex(0);
    setShowLog((prev: boolean) => !prev);
  }, [showLog, index]);

  const activeListHandler = (i: number) => {
    setIndex(i);
  };

  const onThrottleDragMove = throttle(onDragMove, delay);

  return (
    <>
      <ShowLogsWrap showLog={showLog}>
        {isTabLog ? (
          <TabLogWrap desktop={desktop} showLog={showLog}>
            <div className="inner-tab">
              <ul
                ref={draggable}
                onMouseDown={onDragStart}
                onMouseMove={onThrottleDragMove}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}>
                {tabData.list.map((v: string, i: number) => (
                  <List
                    key={v1()}
                    active={i === index}
                    onMouseDown={() => activeListHandler(i)}
                    showLog={showLog}>
                    {v}
                  </List>
                ))}
              </ul>
              <TabLog
                onMouseEnter={onFocusIn}
                onMouseLeave={onFocusOut}
                hasRadius={index === 0}
                desktop={desktop}
                showLog={showLog}
                className={scrollVisible ? 'scroll-visible' : ''}>
                <Text type="p4" color="primary" className="inner-content">
                  {tabData.content[index]}
                </Text>
              </TabLog>
            </div>
          </TabLogWrap>
        ) : (
          <LogWrap desktop={desktop} showLog={showLog}>
            <Log
              onMouseEnter={onFocusIn}
              onMouseLeave={onFocusOut}
              desktop={desktop}
              showLog={showLog}
              className={scrollVisible ? 'scroll-visible' : ''}>
              <pre>
                <Text type="p4" color="primary">
                  {window.atob(logData)}
                </Text>
              </pre>
            </Log>
          </LogWrap>
        )}
      </ShowLogsWrap>
      <ViewMoreButton
        text={showLog ? `Hide ${btnTextType}` : `Show ${btnTextType}`}
        onClick={showLogHandler}
      />
    </>
  );
};

const ShowLogsWrap = styled.div<StyleProps>`
  ${mixins.flexbox('column', 'center', 'center')}
  width: 100%;
  /* height: auto; */
  margin-top: ${({showLog}) => (showLog ? '24px' : '8px')};
`;

const logWrapCommonStyle = css<StyleProps>`
  width: 100%;
  transition: all 0.4s ease;
`;

const TabLogWrap = styled.div<StyleProps>`
  ${logWrapCommonStyle};
  overflow: hidden;
  color: ${({theme}) => theme.colors.reverse};
  height: ${({showLog, desktop}) => {
    if (showLog) {
      return desktop ? '572px' : '336px';
    } else {
      return '0px';
    }
  }};
  .inner-tab {
    width: 100%;
    ul {
      width: 100%;
      ${mixins.flexbox('row', 'center', 'flex-start')};
      overflow-x: auto;
      user-select: none;
    }
  }
`;

const LogWrap = styled.div<StyleProps>`
  ${logWrapCommonStyle};
  overflow: auto;
  border-radius: 10px;
  background-color: ${({theme}) => theme.colors.surface};
  height: ${({showLog, desktop}) => {
    if (showLog) {
      return desktop ? '528px' : '292px';
    } else {
      return '0px';
    }
  }};
`;

const Log = styled.div<StyleProps>`
  ${scrollbarStyle};
  width: 100%;
  padding: ${({showLog}) => (showLog ? '24px' : '0px 24px')};
  word-break: keep-all;
  word-wrap: break-word;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const TabLog = styled(Log)<StyleProps>`
  ${scrollbarStyle};
  /* height: 100%; */
  /* max-height: ${({desktop}) => (desktop ? '528px' : '292px')}; */
  height: ${({showLog, desktop}) => {
    if (showLog) {
      return desktop ? '528px' : '292px';
    } else {
      return '0px';
    }
  }};
  overflow: auto;
  background-color: ${({theme}) => theme.colors.surface};
`;

const List = styled.li<StyleProps>`
  ${({theme}) => theme.fonts.p4};
  color: ${({active, theme}) => !active && theme.colors.tertiary};
  padding: 12px 16px;
  height: 44px;
  cursor: pointer;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  ${({active, theme}) =>
    active &&
    css`
      background-color: ${theme.colors.surface};
    `}
`;

export default ShowLog;
