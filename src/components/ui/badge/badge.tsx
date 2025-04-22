import { isDesktop } from "@/common/hooks/use-media";
import { PaletteKeyType } from "@/styles";
import mixins from "@/styles/mixins";
import React, { CSSProperties } from "react";
import styled from "styled-components";

type BadgeProps = {
  type?: PaletteKeyType;
  children: React.ReactNode;
  padding?: CSSProperties["padding"];
  margin?: CSSProperties["margin"];
  className?: string;
  desktop?: boolean;
  onClick?: () => void;
};

const Badge = (props: BadgeProps) => {
  const desktop = isDesktop();
  return (
    <BadgeWrapper
      {...props}
      className={props.className ? `badge ${props.className}` : "badge"}
      desktop={desktop}
      onClick={props.onClick}
    >
      {props.children}
    </BadgeWrapper>
  );
};

const BadgeWrapper = styled.div<BadgeProps>`
  ${mixins.flexbox("row", "center", "center", false)};
  width: 100%;
  max-width: fit-content;
  height: 28px;
  background-color: ${({ type, theme }) => (type ? theme.colors[type] : theme.colors.surface)};
  padding: ${({ padding }) => (padding ? padding : "4px 16px")};
  margin-right: ${({ desktop, margin }) => (desktop && !margin ? "15px" : "10px")};
  border-radius: 4px;
  margin-top: ${({ desktop, margin }) => !desktop && !margin && "12px"};
  ${({ margin }) => margin && `margin: ${margin};`};
`;

export default Badge;
