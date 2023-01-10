import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled, {css} from 'styled-components';
import {isDesktop} from '@/common/hooks/use-media';
import Text from '@/components/ui/text';
import {ViewMoreButton} from '@/components/ui/button';
import mixins from '@/styles/mixins';
import Tabs from '@/components/view/tabs';
import {LogDataType} from '@/components/view/tabs/tabs';
import {v1} from 'uuid';

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
  const logWrapRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const draggable = useRef<HTMLUListElement>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState<number>(0);

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

  useEffect(() => {
    if (!showLog) return;
    heightSet();
  }, [index, showLog]);

  const showLogHandler = useCallback(() => {
    if (logWrapRef.current === null || logRef.current === null) return;
    if (showLog) {
      logRef.current.scrollTo(0, 0);
      setIndex(0);
      logWrapRef.current.style.height = '0px';
      logWrapRef.current.style.maxHeight = '0px';
    } else {
      heightSet();
    }
    setShowLog((prev: boolean) => !prev);
  }, [showLog, desktop, isTabLog]);

  const heightSet = () => {
    if (logWrapRef.current === null || logRef.current === null) return;
    let height = '0px';
    if (isTabLog) {
      height = desktop ? '572px' : '336px';
    } else {
      height = desktop ? '528px' : '292px';
    }
    logWrapRef.current.style.height = `${logRef.current.clientHeight}px`;
    logWrapRef.current.style.maxHeight = height;
  };

  const activeListHandler = (i: number) => {
    setIndex(i);
  };

  const onThrottleDragMove = throttle(onDragMove, delay);

  return (
    <>
      <ShowLogsWrap showLog={showLog}>
        {isTabLog ? (
          <TabLogWrap desktop={desktop} ref={logWrapRef} showLog={showLog}>
            <div className="inner-tab" ref={logRef}>
              <ul
                ref={draggable}
                onMouseDown={onDragStart}
                onMouseMove={onThrottleDragMove}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}>
                {tabData.list.map((v: string, i: number) => (
                  <List key={v1()} active={i === index} onMouseDown={() => activeListHandler(i)}>
                    {v}
                  </List>
                ))}
              </ul>
              <TabLog hasRadius={index === 0} desktop={desktop} showLog={showLog}>
                <Text type="p4" color="primary" className="inner-content">
                  {tabData.content[index]}
                </Text>
              </TabLog>
            </div>
          </TabLogWrap>
        ) : (
          <LogWrap ref={logWrapRef} desktop={desktop} showLog={showLog}>
            <Log ref={logRef} desktop={desktop} showLog={showLog}>
              <pre>
                <Text type="p4" color="primary">
                  {JSON.stringify(logData, null, 2)}
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
  height: auto;
  margin-top: ${({showLog}) => (showLog ? '24px' : '8px')};
`;

const logWrapCommonStyle = css<StyleProps>`
  width: 100%;
  height: 0px;
  transition: all 0.4s ease;
`;

const TabLogWrap = styled.div<StyleProps>`
  ${logWrapCommonStyle};
  overflow: hidden;
  color: ${({theme}) => theme.colors.reverse};
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
`;

const Log = styled.div<StyleProps>`
  width: 100%;
  padding: ${({showLog}) => (showLog ? '24px' : '0px 24px')};
  word-break: keep-all;
  word-wrap: break-word;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const TabLog = styled(Log)<StyleProps>`
  height: 100%;
  max-height: ${({desktop}) => (desktop ? '528px' : '292px')};
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
