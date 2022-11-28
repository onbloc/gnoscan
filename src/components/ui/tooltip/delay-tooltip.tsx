import React, {useCallback, useEffect, useState} from 'react';
import styled, {css, CSSProperties} from 'styled-components';
import Text from '@/components/ui/text';
import {FontsType} from '@/styles';
import mixins from '@/styles/mixins';

interface StyleProps {
  padding?: CSSProperties['padding'];
  active?: boolean;
  type?: FontsType;
}

interface DelayTooltipProps extends StyleProps {
  children: React.ReactNode;
  copyText: string;
  className?: string;
}

export const DelayTooltip = ({
  children,
  copyText,
  className,
  type = 'body1',
  padding = '16px',
}: DelayTooltipProps) => {
  const [active, setActive] = useState<boolean>(false);

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      setActive(true);
      navigator.clipboard.writeText(copyText);
    },
    [active],
  );

  useEffect(() => {
    const timer = setTimeout(() => setActive(false), 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [active]);

  return (
    <Wrapper className={active ? `${className} isClicked` : className} onClick={onClick}>
      {children}
      <TooltipContent active={active} className="tooltip">
        <TooltipText type={type} padding={padding}>
          {active ? 'Copied!' : 'Copy'}
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
  ${mixins.flexbox('row', 'center', 'center')};
  position: relative;
  cursor: pointer;
  &:hover .tooltip,
  &.isClicked .tooltip {
    transition: all 0.3s ease-in-out;
    visibility: visible;
    opacity: 1;
    bottom: 100%;
  }
`;

const TooltipContent = styled.div<StyleProps>`
  ${mixins.flexbox('row', 'center', 'center')};
  ${container};
  visibility: hidden;
  transition: all 0.3s ease;
  position: absolute;
  left: 50%;
  bottom: 60%;
  transform: translateX(-50%);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  cursor: default;
  :after {
    content: '';
    position: absolute;
    bottom: -4px;
    transform: rotate(-45deg);
    z-index: -1;
    width: 8px;
    height: 8px;
    pointer-events: none;
    background-color: ${({theme}) => theme.colors.base};
    margin-left: calc(4px * -1);
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

const TooltipText = styled(Text)<StyleProps>`
  ${container};
  padding: ${({padding}) => padding};
  color: ${({theme}) => theme.colors.tertiary};
`;
