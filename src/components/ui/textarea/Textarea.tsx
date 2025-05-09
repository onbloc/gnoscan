import styled, { css } from "styled-components";
import React, { CSSProperties, PropsWithChildren } from "react";
import { FontsType } from "@/styles/theme";

export interface TextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  className?: string;
  type: FontsType;
  display?: CSSProperties["display"];
  textAlign?: CSSProperties["textAlign"];
  color?: string;
  margin?: CSSProperties["margin"];
}

const Textarea = ({
  type,
  children,
  display = "block",
  textAlign = "left",
  color,
  margin,
  className = "",
  ...restProps
}: PropsWithChildren<TextareaProps>) => {
  return (
    <Wrapper
      type={type}
      display={display}
      textAlign={textAlign}
      color={color}
      margin={margin}
      className={className}
      {...restProps}
    >
      {children}
    </Wrapper>
  );
};

const Wrapper = styled.textarea<TextareaProps>`
  width: 100%;
  height: 100%;

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

  &.ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
  }
`;

export default Textarea;
