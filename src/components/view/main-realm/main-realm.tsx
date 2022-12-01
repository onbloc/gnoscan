'use client';

import React from 'react';
import styled from 'styled-components';
import Card from '@/components/ui/card';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';
import {MainRealmTotalGasShare} from '.';
import ActiveNewest from '../main-active-list/active-newest';

const MainRealm = () => {
  const media = eachMedia();
  return (
    <Wrapper className={media}>
      <Card height="368px" className="card-1">
        <Text className="title" type="h6" color="primary">
          {'Total Gas Share By Realms'}
        </Text>
        <MainRealmTotalGasShare />
      </Card>
      <ActiveNewest />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 16px;
  margin: 16px 0px;
  &.desktop {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 32px;
    margin: 32px 0px;
  }

  & .title {
    width: 100%;
    margin-bottom: 16px;
  }

  & > div {
    overflow: hidden;
  }
`;

export default MainRealm;
