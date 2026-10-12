import React from "react";
import { NextPageContext } from "next";
import styled from "styled-components";

import Error404Layout from "@/layouts/error/error-404/Error404Layout";

interface ErrorPageProps {
  statusCode?: number;
}

/**
 * Replaces the Next.js default error page, whose text color follows the OS color scheme instead of the app theme.
 */
const ErrorPage = ({ statusCode }: ErrorPageProps) => {
  return (
    <Error404Layout
      notFound={
        <Wrapper>
          {statusCode && <h1>{statusCode}</h1>}
          <h2>{statusCode === 500 ? "Internal Server Error." : "An unexpected error has occurred."}</h2>
        </Wrapper>
      }
    />
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorPageProps => ({
  statusCode: res?.statusCode ?? err?.statusCode ?? 404,
});

export default ErrorPage;

/**
 * Matches the layout of the Next.js default error page.
 */
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 80px - 80px);
  min-height: 300px;
  color: ${({ theme }) => theme.colors.reverse};

  h1 {
    margin-right: 20px;
    padding-right: 23px;
    border-right: 1px solid ${({ theme }) => theme.colors.gray200};
    font-size: 24px;
    font-weight: 500;
    line-height: 49px;
  }

  h2 {
    font-size: 14px;
    line-height: 28px;
  }
`;
