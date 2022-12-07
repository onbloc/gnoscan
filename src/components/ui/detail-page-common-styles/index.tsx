import mixins from '@/styles/mixins';
import styled, {css} from 'styled-components';

interface StyleProps {
  media?: string;
  desktop?: boolean;
  multipleBadgeGap?: string;
}

export const DetailsContainer = styled.div<StyleProps>`
  ${mixins.flexbox('column', 'flex-start', 'space-between')};
  background-color: ${({theme}) => theme.colors.base};
  padding: ${({desktop}) => (desktop ? '24px' : '16px')};
  border-radius: 10px;
  width: 100%;
  &:not(:first-of-type) {
    margin-top: ${({desktop}) => (desktop ? '24px' : '16px')};
  }
`;

export const DLWrap = styled.dl<StyleProps>`
  ${({desktop}) =>
    desktop
      ? mixins.flexbox('row', 'center', 'flex-start')
      : mixins.flexbox('column', 'flex-start', 'center')};
  padding: ${({desktop}) => (desktop ? '18px 0px' : '12px 0px')};
  width: 100%;
  color: ${({theme}) => theme.colors.primary};
  &:not(:first-of-type) {
    border-top: 1px solid ${({theme}) => theme.colors.dimmed100};
  }
  &:first-of-type {
    padding-top: 0px;
  }
  &:last-of-type {
    padding-bottom: 0px;
  }
  &.multiple-badges {
    padding-top: ${({desktop}) => (desktop ? '0px' : '12px')};
    .badge {
      margin-top: ${({desktop}) => (desktop ? '18px' : '12px')};
    }
  }
  dt {
    width: ${({desktop}) => (desktop ? '200px' : '100%')};
    ${({desktop, theme}) => (desktop ? theme.fonts.p3 : theme.fonts.p4)};
  }
  dd {
    ${({theme}) => theme.fonts.p4};
    width: 100%;
    display: block;
    /* overflow: hidden; */
  }
`;

export const DateDiffText = styled.span`
  color: ${({theme}) => theme.colors.tertiary};
  position: relative;
  padding-left: 20px;
  white-space: nowrap;
  &:after {
    content: '';
    width: 1px;
    height: 10px;
    background-color: ${({theme}) => theme.colors.dimmed100};
    ${mixins.posTopCenterLeft(0)};
    margin: 0px 10px;
  }
`;

export const FitContentA = styled.a`
  width: 100%;
  max-width: fit-content;
`;
