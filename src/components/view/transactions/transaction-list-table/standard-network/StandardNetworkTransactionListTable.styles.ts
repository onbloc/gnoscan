import styled from "styled-components";

export const Container = styled.div<{ maxWidth?: number }>`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.base};
    padding-bottom: 24px;
    border-radius: 10px;

    .button-wrapper {
      display: flex;
      width: 100%;
      height: auto;
      margin-top: 4px;
      padding: 0 20px;
      justify-content: center;

      .more-button {
        width: 100%;
        padding: 16px;
        color: ${({ theme }) => theme.colors.primary};
        background-color: ${({ theme }) => theme.colors.surface};
        ${({ theme }) => theme.fonts.p4};
        font-weight: 600;

        &.desktop {
          width: 344px;
        }
      }
    }
  }
`;

export const TooltipContainer = styled.div`
  min-width: 132px;
`;
