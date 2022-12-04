import React, {CSSProperties} from 'react';
import styled from 'styled-components';

export enum BadgeType {
  Default = 'Default',
  Primary = 'Primary',
  Secondary = 'Secondary',
  Tertiary = 'Tertiary',
}

type BadgeProps = {
  type?: BadgeType;
  children: React.ReactNode;
  padding?: CSSProperties['padding'];
  className?: string;
};

const Badge = (props: BadgeProps) => {
  return <BadgeWrapper {...props}>{props.children}</BadgeWrapper>;
};

const BadgeWrapper = styled.div<BadgeProps>`
  ${({theme}) => theme.mixins.flexbox('row', 'center', 'center')};
  background-color: ${({type, theme}) => {
    if (type === BadgeType.Primary) return theme.colors.blue;
    if (type === BadgeType.Secondary) return theme.colors.green;
    if (type === BadgeType.Tertiary) return theme.colors.red[0];
    return theme.colors.surface;
  }};
  padding: ${({padding}) => (padding ? padding : '0px 16px')};
  border-radius: 4px;
`;

export default Badge;
