import React from "react";
import styled from "styled-components";

import Error404Layout from "@/layouts/error/error-404/Error404Layout";

/**
 * Replaces the Next.js default 500 page, whose text color follows the OS color scheme instead of the app theme.
 * It is generated at build time, so it renders even when the request that failed cannot be rendered again.
 */
const InternalServerErrorPage = () => {
  return (
    <Error404Layout
      notFound={
        <Wrapper>
          <h1>500</h1>
          <h2>Internal Server Error.</h2>
        </Wrapper>
      }
    />
  );
};

export default InternalServerErrorPage;

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
