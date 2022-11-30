'use client';

import React from 'react';
import styled from 'styled-components';
import Card from '@/components/ui/card';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';
import {MainRealmTotalGasShare} from '.';

const MainRealm = () => {
  const media = eachMedia();
  return (
    <Wrapper className={media}>
      <Card height="368px" className="card-1">
        <Text type="body1">{'Total Gas Share By Realms'}</Text>
        <MainRealmTotalGasShare />
      </Card>
      <Card height="368px" className="card-2">
        <Text type="body1">Card 2</Text>
      </Card>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 32px;
  grid-template-columns: repeat(2, 1fr);
  &.tablet {
    grid-template-columns: 1fr 1fr;
  }
  &.mobile {
    grid-template-columns: 1fr;
  }

  & > div {
    overflow: hidden;
  }
`;

export default MainRealm;
