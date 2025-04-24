import mixins from "@/styles/mixins";
import styled from "styled-components";

interface StyleProps {
  media?: string;
  desktop?: boolean;
  multipleBadgeGap?: string;
}

export const DetailsContainer = styled.div<StyleProps>`
  ${mixins.flexbox("column", "flex-start", "space-between")};
  background-color: ${({ theme }) => theme.colors.base};
  padding: ${({ desktop }) => (desktop ? "24px" : "16px")};
  border-radius: 10px;
  width: 100%;

  .tab-area {
    display: flex;
    flex-direction: row;
    gap: 32px;

    .tab-item {
      display: flex;
      flex-direction: row;
      gap: 10px;
      justify-content: center;
      cursor: pointer;

      .badge {
        width: fit-content;
        min-width: 28px;
        height: 28px;
        padding: 0 8px;
        border-radius: 14px;
        background-color: ${({ theme }) => theme.colors.surface};

        &.small {
          width: fit-content;
          min-width: 24px;
          height: 24px;
          padding: 0 8px;
        }
      }
    }
  }
`;

export const DLWrap = styled.dl<StyleProps>`
  ${({ desktop }) =>
    desktop ? mixins.flexbox("row", "center", "flex-start") : mixins.flexbox("column", "flex-start", "center")};
  padding: ${({ desktop }) => (desktop ? "18px 0px" : "12px 0px")};
  width: 100%;
  color: ${({ theme }) => theme.colors.primary};
  &:not(:first-of-type) {
    border-top: 1px solid ${({ theme }) => theme.colors.dimmed100};
  }
  &:first-of-type {
    padding-top: 0px;
  }
  &:last-of-type {
    padding-bottom: 0px;
  }
  &.multiple-badges {
    padding-top: ${({ desktop }) => (desktop ? "0px" : "12px")};
    .badge {
      margin-top: ${({ desktop }) => (desktop ? "18px" : "12px")};
    }
  }
  dt {
    color: ${({ theme }) => theme.colors.tertiary};
    width: ${({ desktop }) => (desktop ? "200px" : "100%")};
    ${({ desktop, theme }) => (desktop ? theme.fonts.p3 : theme.fonts.p4)};
  }
  dd {
    ${({ theme }) => theme.fonts.p4};
    width: 100%;
    display: block;

    &.function-wrapper {
      line-height: 40px;

      .link {
        padding: 0;
        transition: 0.2s;
        cursor: pointer;

        &:hover {
          opacity: 0.6;
        }
      }

      .tooltip {
        display: block;
        width: 100%;
        height: 100%;

        .tooltip-button {
          padding: 4px 16px;
        }
      }
    }

    &.path-wrapper {
      display: flex;
      flex-direction: row;
      gap: 8px;
    }
  }

  .badge {
    height: auto;

    .multi-line {
      word-break: break-all;
      white-space: pre-line;
    }
  }
`;

export const DateDiffText = styled.span`
  color: ${({ theme }) => theme.colors.tertiary};
  position: relative;
  padding-left: 20px;
  white-space: nowrap;
  &:after {
    content: "";
    width: 1px;
    height: 10px;
    background-color: ${({ theme }) => theme.colors.dimmed100};
    ${mixins.posTopCenterLeft(0)};
    margin: 0px 10px;
  }
`;

export const FitContentA = styled.a`
  width: 100%;
  max-width: fit-content;
`;

export const LinkWrapper = styled.a`
  display: flex;
  flex-direction: row;
  gap: 4px;
  width: 100%;
  max-width: fit-content;
  height: 28px;
  align-self: flex-end;
  align-items: center;
  transition: 0.2s;
  color: ${({ theme }) => theme.colors.gray300};
  cursor: pointer;

  :hover {
    opacity: 0.6;
  }

  .icon-link {
    display: flex;
    width: 18px;
    height: 18px;
    * {
      stroke: ${({ theme }) => theme.colors.gray300};
    }
  }
`;
