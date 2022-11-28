import mixins from '@/styles/mixins';
import React from 'react';
import styled, {CSSProperties} from 'styled-components';

interface CardStyleProps {
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  padding?: CSSProperties['padding'];
  radius?: string;
}

interface CardPros extends CardStyleProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({
  children,
  width,
  height,
  padding = '24px',
  radius = '10px',
  className,
}: CardPros) => {
  return (
    <Wrapper width={width} height={height} padding={padding} radius={radius} className={className}>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div<CardStyleProps>`
  ${mixins.flexbox('column', 'center', 'flex-start')};
  width: ${({width}) => {
    if (width) return typeof width === 'number' ? `${width}px` : width;
    return 'auto';
  }};
  height: ${({height}) => {
    if (height) return typeof height === 'number' ? `${height}px` : height;
    return 'auto';
  }};
  padding: ${({padding}) => padding};
  background-color: ${({theme}) => theme.colors.surface};
  outline: none;
  border-radius: ${({radius}) => (typeof radius === 'number' ? `${radius}px` : radius)};
`;
