import React, {useState, useCallback, useEffect} from 'react';
import styled, {css} from 'styled-components';
import Text from '@/components/ui/text';
import mixins from '@/styles/mixins';

type TriggerType = 'click' | 'hover';
interface TooltipProps {
  className?: string;
  children: React.ReactNode;
  content: React.ReactNode | string;
  trigger?: TriggerType;
  copyText?: string;
}

const Tooltip = ({
  className,
  children,
  content,
  trigger = 'hover',
  copyText = '',
}: TooltipProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const buttonClickHandler = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
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

  return (
    <Wrapper className={className} trigger={trigger} isClicked={isClicked}>
      <div onClick={buttonClickHandler}>{children}</div>
      <TooltipContent className="tooltip">
        <TooltipText type="body1">{content}</TooltipText>
      </TooltipContent>
    </Wrapper>
  );
};

const container = css`
  border-radius: 8px;
  background-color: ${({theme}) => theme.colors.base};
`;

const activeTooltip = css`
  transition: all 0.5s ease-in;
  visibility: visible;
  transform: translate(-50%, 0);
`;

const Wrapper = styled.div<{trigger: TriggerType; isClicked: boolean}>`
  position: relative;
  display: inline-block;
  z-index: 11;
  ${({trigger}) =>
    trigger !== 'click' &&
    css`
      &:hover .tooltip {
        ${activeTooltip};
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

const TooltipText = styled(Text)`
  ${container};
  width: 100%;
  height: 100%;
  color: ${({theme}) => theme.colors.tertiary};
  word-break: keep-all;
  text-align: center;
  padding: 16px;
`;

const TooltipContent = styled.div`
  ${mixins.flexbox('row', 'center', 'center')};
  ${container};
  width: 163px;
  height: auto;
  transition: all 0.5s ease-in;
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  transform: translate(-50%, 7%);
  z-index: 10;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  visibility: hidden;
  &:after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 50%;
    transform: rotate(45deg);
    width: 6px;
    height: 6px;
    z-index: -1;
    pointer-events: none;
    background-color: ${({theme}) => theme.colors.base};
    margin-left: calc(3px * -1);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

export default Tooltip;
