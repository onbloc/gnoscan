import React from 'react';
import styled from 'styled-components';
import MainCard from '@/components/view/main-card/main-card';
import MainActiveList from '@/components/view/main-active-list/main-active-list';

const Home: React.FC = () => {
  return (
    <Wrapper>
      <div className="inner-layout">
        <MainCard />
        <MainActiveList />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  width: 100%;
  flex: 1;
  padding: 48px 0px;
`;

const SecondLine = styled.div`
  width: 100%;
`;

export default Home;
