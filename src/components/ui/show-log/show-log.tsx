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

  return (
    <>
      <ShowLogsWrap showLog={showLog}>
        {isTabLog ? (
          <TabLogWrap desktop={desktop} ref={logWrapRef} showLog={showLog}>
            <div className="inner-tab" ref={logRef}>
              <ul>
                {tabData.list.map((v: string, i: number) => (
                  <List key={v1()} active={i === index} onClick={() => setIndex(i)}>
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
  border-top: ${({showLog, theme}) => showLog && `1px solid ${theme.colors.dimmed100}`};
`;

const logWrapCommonStyle = css<StyleProps>`
  width: 100%;
  height: 0px;
  margin-top: ${({showLog}) => (showLog ? '24px' : '0px')};
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
`;

const TabLog = styled(Log)<StyleProps>`
  height: 100%;
  max-height: ${({desktop}) => (desktop ? '528px' : '292px')};
  overflow: auto;
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: 10px;
  border-top-left-radius: 0px;
`;

const List = styled.li<StyleProps>`
  padding: 12px 16px;
  height: 44px;
  cursor: pointer;
  color: ${({active, theme}) => !active && theme.colors.tertiary};
  &:last-of-type {
    border-top-right-radius: 10px;
  }
  &:first-of-type {
    border-top-left-radius: 10px;
  }
  ${({active, theme}) =>
    active &&
    css`
      background-color: ${theme.colors.surface};
    `}
`;

export default ShowLog;
