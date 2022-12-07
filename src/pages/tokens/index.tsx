import Text from '@/components/ui/text';
import {TokenDatatable} from '@/components/view/datatable/token';
import React from 'react';
import styled from 'styled-components';

const Tokens = () => {
  return (
    <Container>
      <div className="inner-layout">
        <Wrapper>
          <Text type="h2" margin={'0 0 24px 0'} color="primary">
            {'Tokens'}
          </Text>
          <TokenDatatable />
        </Wrapper>
      </div>
    </Container>
  );
};

const Container = styled.main`
  width: 100%;
  flex: 1;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 40px 0;
  padding: 24px;
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: 10px;
`;

export default Tokens;
