import React from 'react';
import styled from 'styled-components';

const Home: React.FC = () => {
  return (
    <Wrapper>
      <div className="inner-layout"></div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  width: 100%;
  flex: 1;
`;

export default Home;
