import styled from "styled-components";

// Table on its own card with the view more button inside the card
export const CardTableContainer = styled.div`
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
    }
  }
`;

// Table without its own padding, placed inside a section that already provides the card
export const FlushTableContainer = styled.div`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    align-items: center;

    & > div {
      padding: 0;
    }

    .view-more-button {
      margin-top: 24px;
    }
  }
`;
