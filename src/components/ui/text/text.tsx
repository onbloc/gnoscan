import styled, { css } from "styled-components";
import React, { CSSProperties, PropsWithChildren } from "react";
import { FontsType } from "@/styles/theme";

export interface TextProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  type: FontsType;
  display?: CSSProperties["display"];
  textAlign?: CSSProperties["textAlign"];
  fontWeight?: CSSProperties["fontWeight"];
  color?: string;
  margin?: CSSProperties["margin"];
}

const Text = ({
  type,
  children,
  display = "block",
  textAlign = "left",
  color,
  margin,
  className = "",
  fontWeight,
  ...restProps
}: PropsWithChildren<TextProps>) => {
  return (
    <Wrapper
      type={type}
      display={display}
      textAlign={textAlign}
      fontWeight={fontWeight}
      color={color}
      margin={margin}
      className={className}
      {...restProps}
    >
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
      font-weight: ${props.fontWeight};
      color: ${props.theme.colors[props.color ?? props.theme.colors.black]};
      white-space: pre-wrap;
      margin: ${props.margin};
    `;
  }}
  &.ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
  }
`;

export default Text;
