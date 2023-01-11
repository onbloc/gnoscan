import React, {useState, useCallback, useEffect} from 'react';
import styled, {css} from 'styled-components';
import Text from '@/components/ui/text';
import mixins from '@/styles/mixins';
import {Tooltip as AntdTooltip} from 'antd';
import {default as themeStyle} from '@/styles/theme';
import {useRecoilState, useRecoilValue} from 'recoil';
import {themeState} from '@/states';
import {zindex} from '@/common/values/z-index';

type TriggerType = 'click' | 'hover';
interface TooltipProps {
  className?: string;
  children: React.ReactNode;
  content: React.ReactNode | string;
  trigger?: TriggerType;
  width?: number;
  copyText?: string;
  contentWidth?: string;
}

const Tooltip = ({
  className,
  children,
  content,
  trigger = 'hover',
  width,
  copyText = '',
}: TooltipProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const themeMode = useRecoilValue(themeState);

  // useEffect(() => {
  //   const timer = setTimeout(() => setIsClicked(false), 2000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [isClicked]);

  const getCurrentTheme = () => {
    return themeMode === 'dark' ? themeStyle.darkTheme : themeStyle.lightTheme;
  };
  const getTooltipStyle = (width?: number, padding?: number) => {
    return {
      diplay: 'flex',
      width: width ? `${width}px` : 'fit-content',
      backgroundColor: getCurrentTheme().base,
      color: getCurrentTheme().tertiary,
      fontSize: '12px',
      lineHeight: '16px',
      fontFamily: 'Roboto, sans-serif',
      padding: padding ? `${padding}px` : '16px',
    };
  };

  const clickTimer = (open: boolean) => {
    setIsClicked(true);
    navigator?.clipboard?.writeText(copyText);
    const timer = setTimeout(() => setIsClicked(false), 2000);
    return () => {
      clearTimeout(timer);
    };
  };

  return (
    <Wrapper className={className}>
      {trigger === 'click' ? (
        <AntdTooltip
          zIndex={zindex.tooltip}
          trigger="click"
          overlayInnerStyle={getTooltipStyle(width, 8)}
          color={getCurrentTheme().base}
          title={<TooltipWrapper>{content}</TooltipWrapper>}
          open={isClicked}
          onOpenChange={clickTimer}>
          <div className="tooltip-button cursor">{children}</div>
        </AntdTooltip>
      ) : (
        <AntdTooltip
          zIndex={zindex.tooltip}
          trigger="hover"
          overlayInnerStyle={getTooltipStyle(width, 16)}
          color={getCurrentTheme().base}
          title={<TooltipWrapper>{content}</TooltipWrapper>}>
          <div className="tooltip-button">{children}</div>
        </AntdTooltip>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: top;
  .tooltip-button {
    ${mixins.flexbox('row', 'center', 'center')};

    & button {
      cursor: default;
    }

    &.cursor,
    &.cursor button {
      cursor: pointer;
    }
  }
`;

const TooltipWrapper = styled.div`
  word-break: keep-all;
  text-align: center;
`;

export default Tooltip;
