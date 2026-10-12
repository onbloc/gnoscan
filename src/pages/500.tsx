import React from "react";
import styled from "styled-components";

/**
 * Replaces the Next.js default 500 page, whose text color follows the OS color scheme instead of the app theme.
 * It is generated at build time, so it renders even when the request that failed cannot be rendered again.
 */
const InternalServerErrorPage = () => {
  return (
    <Wrapper>
      <h1>500</h1>
      <h2>Internal Server Error.</h2>
    </Wrapper>
  );
};

export default InternalServerErrorPage;

/**
 * Matches the layout of the Next.js default error page.
 * It grows to fill the space between the header and the footer, so the page never needs a fixed height.
 */
const Wrapper = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
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
