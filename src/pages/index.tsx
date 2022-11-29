import React from 'react';
import styled from 'styled-components';
import MainCard from '@/components/view/main-card/main-card';
import MainRealm from '@/components/view/main-realm/main-realm';
import MainTransactionNews from '@/components/view/main-transaction-news/main-transaction-news';

const Home: React.FC = () => {
  return (
    <Wrapper>
      <div className="inner-layout">
        <MainCard />
        <MainRealm />
        <MainTransactionNews />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  width: 100%;
  flex: 1;
`;

export default Home;
