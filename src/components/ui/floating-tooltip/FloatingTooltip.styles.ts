import styled from "styled-components";

export const BaseTooltipWrapper = styled.div`
  cursor: default;
  display: flex;
`;

export const TooltipLayer = styled.div`
  color: ${({ theme }) => theme.colors.surface};
`;

export const Content = styled.div`
  ${({ theme }) => theme.fonts.body1};
  color: ${({ theme }) => theme.colors.tertiary};
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 16px;
  border-radius: 8px;
  box-sizing: border-box;
  width: max-content;
  max-width: calc(100vw - 10px);
  box-shadow: ${({ theme }) =>
    theme.themeKey === "dark" ? "10px 14px 60px 0px rgba(0, 0, 0, 0.4)" : "10px 14px 48px 0px rgba(0, 0, 0, 0.12)"};
  word-break: keep-all;
  white-space: pre-line;
  text-align: center;
`;
