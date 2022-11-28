import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

const Block = () => {
  return (
    <Wrapper>
      <div className="inner-layout">
        <h1>home</h1>
        <br />
        <Link href="/">Go to Home</Link>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  width: 100%;
  flex: 1;
`;

export default Block;
