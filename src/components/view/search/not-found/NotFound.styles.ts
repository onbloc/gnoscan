import styled from "styled-components";

export const Wrapper = styled.div`
  & {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: calc(100vh - 136px - 200px);
    min-height: 500px;
    overflow: hidden;

    .info-area {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: ${({ theme }) => theme.colors.reverse};

      .title {
        ${({ theme }) => theme.fonts.h3}
        margin-bottom: 20px;
      }

      .description {
        display: flex;
        flex-direction: column;
        margin-bottom: 44px;

        span {
          ${({ theme }) => theme.fonts.p4}
          margin: 4px 0;
        }

        b {
          font-weight: 600;
        }
      }

      .home-button {
        color: ${({ theme }) => theme.colors.white};
        background-color: ${({ theme }) => theme.colors.blue};
        padding: 10px 24px;
        border-radius: 4px;
        ${({ theme }) => theme.fonts.p3}
      }
    }

    .asset-area {
      display: none;
    }
  }

  &.desktop {
    height: calc(100vh - 80px - 80px);

    .info-area {
      .title {
        ${({ theme }) => theme.fonts.h1}
        margin-bottom: 12px;
      }

      .description {
        span {
          ${({ theme }) => theme.fonts.p3}
        }
      }

      .home-button {
        ${({ theme }) => theme.fonts.p3}
      }
    }

    .asset-area {
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
    }
  }
`;
