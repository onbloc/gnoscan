'use client';

import React from 'react';
import styled from 'styled-components';
import Card from '@/components/ui/card';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';
import {MainTotalTransaction} from '.';
import {MainTotalDailyFee} from '.';
import {MainNewsTwitter} from './news-twitter';

const MainTransactionNews = () => {
  const media = eachMedia();
  return (
    <Wrapper className={media}>
      <Card height="274px" className="card-1">
        <Text className="title" type="h6" color="primary">
          {'Total Daily Transactions'}
        </Text>
        <MainTotalTransaction />
      </Card>

      <Card height="274px" className="card-2">
        <Text className="title" type="h6" color="primary">
          {'Total Daily Fees (in GNOTs)'}
        </Text>
        <MainTotalDailyFee />
      </Card>

      <Card height="580px" className="card-3">
        <Text className="title" type="h6" color="primary">
          {'News'}
        </Text>
        <MainNewsTwitter />
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  margin: 32px 0;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 32px;
  grid-template-columns: repeat(2, 1fr);

  & .title {
    width: 100%;
    margin-bottom: 16px;
  }

  &.desktop {
    grid-template-columns: 1.43fr 1fr;
    .card-1 {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }

    .card-2 {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }

    .card-3 {
      grid-column: 2 / 3;
      grid-row: 1 / 3;
    }
  }

  &.tablet {
    grid-template-columns: 1fr;
  }
  &.mobile {
    grid-template-columns: 1fr;
  }

  & > div {
    overflow: hidden;
  }
`;

export default MainTransactionNews;
