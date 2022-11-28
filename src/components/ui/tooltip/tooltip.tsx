import {FontsType} from '@/styles';
import React, {useState} from 'react';
import styled, {css, CSSProperties} from 'styled-components';
import Text from '@/components/ui/text';
import mixins from '@/styles/mixins';

type Direction = 'top' | 'bottom' | 'left' | 'right';

interface StyleProps {
  pos?: Direction;
  padding?: CSSProperties['padding'];
  active?: boolean;
}

interface TooltipProps extends StyleProps {
  children: React.ReactNode;
  content: React.ReactNode | string;
  type?: FontsType;
  direction?: Direction;
}

export const Tooltip = ({
  children,
  direction = 'top',
  content,
  type = 'body1',
  padding = '16px',
}: TooltipProps) => {
  const [active, setActive] = useState(false);

  const showTip = () => setActive(true);
  const hideTip = () => setActive(false);

  return (
    <Wrapper onMouseEnter={showTip} onMouseLeave={hideTip}>
      {children}
      <TooltipContent pos={direction} active={active}>
        <TooltipText type={type} padding={padding}>
          {content}
        </TooltipText>
      </TooltipContent>
    </Wrapper>
  );
};

const container = css`
  white-space: nowrap;
  border-radius: 8px;
  background-color: ${({theme}) => theme.colors.base};
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipText = styled(Text)<StyleProps>`
  ${container};
  padding: ${({padding}) => padding};
  color: ${({theme}) => theme.colors.tertiary};
`;

const TooltipContent = styled.div<StyleProps>`
  ${mixins.flexbox('row', 'center', 'center')};
  ${container};
  visibility: ${({active}) => (active ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  position: absolute;
  z-index: 10;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  opacity: ${({active}) => (active ? 1 : 0)};
  :after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: -1;
    pointer-events: none;
    background-color: ${({theme}) => theme.colors.base};
    margin-left: calc(4px * -1);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  ${({pos, active}) => {
    if (pos === 'top')
      return css`
        left: 50%;
        bottom: ${active ? '100%' : '70%'};
        transform: translateX(-50%);
        :after {
          bottom: -4px;
          transform: rotate(-45deg);
        }
      `;
    if (pos === 'bottom')
      return css`
        /* left: 50%;
        top: 100%;
        transform: translateX(-50%);
        :after {
          top: -4px;
          transform: rotate(-45deg);
          z-index: -1;
        } */
      `;
  }}
`;
