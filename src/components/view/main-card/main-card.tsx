'use client';

import React from 'react';
import styled from 'styled-components';
import Card from '@/components/ui/card';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';

const MainCard = () => {
  const media = eachMedia();
  return (
    <Wrapper className={media}>
      <Card height="223px" className="card-1">
        <Text type="body1">Card 1</Text>
      </Card>
      <Card height="223px" className="card-2">
        <Text type="body1">Card 2</Text>
      </Card>
      <Card height="223px" className="card-3">
        <Text type="body1">Card 3</Text>
      </Card>
      <Card height="223px" className="card-4">
        <Text type="body1">Card 4</Text>
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
  grid-template-columns: repeat(4, 1fr);
  &.tablet {
    grid-template-columns: 1fr 1fr;
  }
  &.mobile {
    grid-template-columns: 1fr;
  }
`;

export default MainCard;
