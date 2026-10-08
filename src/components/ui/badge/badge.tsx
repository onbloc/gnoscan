import { media } from "@/common/values/ui.constant";
import { PaletteKeyType } from "@/styles";
import mixins from "@/styles/mixins";
import React, { CSSProperties } from "react";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";

type BadgeProps = {
  type?: PaletteKeyType;
  children: React.ReactNode;
  padding?: CSSProperties["padding"];
  margin?: CSSProperties["margin"];
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
};

interface ExtendedCSSProps {
  cssExtend?: ReturnType<typeof css>;
}

const Badge = (props: BadgeProps & ExtendedCSSProps) => {
  const { cssExtend, ...restProps } = props;
  return (
    <BadgeWrapper
      {...restProps}
      className={props.className ? `badge ${props.className}` : "badge"}
      onClick={props.onClick}
      $cssExtend={cssExtend}
    >
      {props.children}
    </BadgeWrapper>
  );
};

interface StyledBadgeProps extends Omit<BadgeProps, "style"> {
  $cssExtend?: ReturnType<typeof css>;
}

const BadgeWrapper = styled.div<StyledBadgeProps>`
  ${mixins.flexbox("row", "center", "center", false)};
  width: 100%;
  max-width: fit-content;
  min-height: 28px;
  background-color: ${({ type, theme }) => (type ? theme.colors[type] : theme.colors.surface)};
  padding: ${({ padding }) => (padding ? padding : "4px 16px")};
  margin-right: 10px;
  border-radius: 4px;
  ${({ margin }) =>
    margin
      ? `margin: ${margin};`
      : css`
          margin-top: 12px;
          ${media.DESKTOP} {
            margin-top: 0;
            margin-right: 15px;
          }
        `};

  ${({ $cssExtend }) => $cssExtend};
`;

export default Badge;
