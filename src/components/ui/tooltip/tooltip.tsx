import React, {useState, useCallback, useEffect} from 'react';
import styled, {css} from 'styled-components';
import Text from '@/components/ui/text';
import mixins from '@/styles/mixins';
import {Tooltip as AntdTooltip} from 'antd';
import useTheme from '@/common/hooks/use-theme';
import {default as themeStyle} from '@/styles/theme';

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
  const [theme] = useTheme();

  const buttonClickHandler = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (trigger !== 'click') return;
      setIsClicked(true);
      navigator.clipboard.writeText(copyText);
    },
    [isClicked, copyText],
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsClicked(false), 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [isClicked]);

  const getCurrentTheme = () => {
    return theme === 'light' ? themeStyle.lightTheme : themeStyle.darkTheme;
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

  return (
    <Wrapper className={className} trigger={trigger} isClicked={isClicked}>
      <AntdTooltip
        overlayInnerStyle={getTooltipStyle(width, trigger === 'click' ? 8 : 16)}
        color={getCurrentTheme().base}
        title={<TooltipWrapper>{content}</TooltipWrapper>}>
        <div onClick={buttonClickHandler} className="tooltip-button">
          {children}
        </div>
      </AntdTooltip>
    </Wrapper>
  );
};

const activeTooltip = css`
  transition: none;
  visibility: visible;
  transform: translate(-50%, 0);
`;

const Wrapper = styled.div<{trigger: TriggerType; isClicked: boolean}>`
  position: relative;
  display: inline-block;
  z-index: 11;
  .tooltip-button {
    ${mixins.flexbox('row', 'center', 'center')};
  }
  ${({trigger}) =>
    trigger !== 'click'
      ? css`
          &:hover .tooltip {
            ${activeTooltip};
          }
        `
      : css`
          & {
            cursor: pointer;
          }
        `}

  ${({isClicked}) =>
    isClicked &&
    css`
      .tooltip {
        ${activeTooltip};
      }
    `}
`;

const TooltipWrapper = styled.div`
  word-break: keep-all;
  text-align: center;
`;

export default Tooltip;
