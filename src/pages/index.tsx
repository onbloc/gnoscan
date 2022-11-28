import React from 'react';
import styled from 'styled-components';
import MainCard from '@/components/view/main-card/main-card';

const Home: React.FC = () => {
  return (
    <Wrapper>
      <div className="inner-layout">
        <MainCard />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  width: 100%;
  flex: 1;
`;

export default Home;
