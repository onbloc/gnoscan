import React from 'react';
import styled from 'styled-components';
import MainCard from '@/components/view/main-card/main-card';
import MainRealm from '@/components/view/main-realm/main-realm';
import MainTransactionNews from '@/components/view/main-transaction-news/main-transaction-news';
import MainActiveList from '@/components/view/main-active-list';
import {eachMedia} from '@/common/hooks/use-media';

const Home = () => {
  const media = eachMedia();
  return (
    <>
      {media && (
        <Wrapper media={media}>
          <div className="inner-layout">
            <MainCard />
            <MainActiveList />
            <MainRealm />
            <MainTransactionNews />
          </div>
        </Wrapper>
      )}
    </>
  );
};

const Wrapper = styled.main<{media: string}>`
  width: 100%;
  flex: 1;
  padding: ${({media}) => (media === 'desktop' ? '48px 0px' : '24px 0px')};
`;

export default Home;
