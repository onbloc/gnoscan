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
  &.top-aligned {
    align-items: flex-start;

    dt {
      padding-top: 4px;
    }
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

    &.path-wrapper {
      display: flex;
      flex-direction: row;
      gap: 15px;

      @media (max-width: 767px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;

        > .badge:first-child {
          margin: 0;
          max-width: 100%;
          min-width: 0;
        }

        > .badge:not(:first-child),
        > a,
        > button {
          margin: 0;
          width: fit-content;
          max-width: 100%;
        }
      }
    }

    &.files-wrapper {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      min-width: 0;
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

// Same box as FitContentA, but for use inside next/link's <Link> — which already
// renders its own <a> — so we don't end up with an invalid <a> nested in <a>.
export const FitContentSpan = styled.span`
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
