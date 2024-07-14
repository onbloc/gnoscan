'use client';

import React from 'react';
import styled from 'styled-components';
import Card from '@/components/ui/card';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';
import {MainTotalTransaction} from '.';
import {MainTotalDailyFee} from '.';

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

  & .title {
    width: 100%;
    margin-bottom: 16px;
  }

  &.desktop {
    grid-template-columns: 1fr;
    .card-1 {
      grid-column: 1;
      grid-row: 1;
    }

    .card-2 {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
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
