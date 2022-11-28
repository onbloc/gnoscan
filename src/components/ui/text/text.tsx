import styled, {css} from 'styled-components';
import React, {CSSProperties, PropsWithChildren} from 'react';
import theme, {FontsType} from '@/styles/theme';

interface TextProps extends React.ComponentPropsWithoutRef<'div'> {
  className?: string;
  type: FontsType;
  display?: CSSProperties['display'];
  textAlign?: CSSProperties['textAlign'];
  color?: string;
  margin?: CSSProperties['margin'];
}

const Text = ({
  type,
  children,
  display = 'block',
  textAlign = 'left',
  color,
  ...restProps
}: PropsWithChildren<TextProps>) => {
  return (
    <Wrapper type={type} display={display} textAlign={textAlign} color={color} {...restProps}>
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.div<TextProps>`
  ${props => {
    return css`
      ${props.theme.fonts[props.type]};
      text-align: ${props.textAlign};
      display: ${props.display};
      color: ${props.theme.colors[props.color ?? props.theme.colors.black]};
      white-space: pre-wrap;
      margin: ${props.margin};
    `;
  }}
`;

export default Text;
