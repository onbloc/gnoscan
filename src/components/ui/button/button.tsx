import styled from 'styled-components';
import React, {CSSProperties} from 'react';
import mixins from '@/styles/mixins';
import {PaletteKeyType} from '@/styles/theme';
import {XOR} from '@/types';

type ButtonProps = XOR<
  {
    fullWidth?: boolean;
    height?: CSSProperties['height'];
    bgColor?: PaletteKeyType;
    children: React.ReactNode;
    margin?: CSSProperties['margin'];
    radius?: string;
    className?: string;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => unknown;
    as?: React.ElementType;
  },
  {
    width?: CSSProperties['width'];
    height?: CSSProperties['height'];
    bgColor?: PaletteKeyType;
    children: React.ReactNode;
    margin?: CSSProperties['margin'];
    radius?: string;
    className?: string;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => unknown;
    as?: React.ElementType;
  }
>;

export const Button = (props: ButtonProps) => {
  return <ButtonWrapper {...props}>{props.children}</ButtonWrapper>;
};

const ButtonWrapper = styled.button<ButtonProps>`
  ${mixins.flexbox('row', 'center', 'center')};
  width: ${({width, fullWidth}) => {
    if (width) return typeof width === 'number' ? width + 'px' : width;
    if (fullWidth) return '100%';
    return 'auto';
  }};
  height: ${({height}) => {
    if (height) return typeof height === 'number' ? height + 'px' : height;
    return 'auto';
  }};
  margin: ${props => props.margin};
  background-color: ${({theme, bgColor}) => theme.colors[bgColor ?? 'base']};
  outline: none;
  border-radius: ${({radius}) => (radius ? radius : '4px')};
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
`;
