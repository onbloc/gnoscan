import Text from '@/components/ui/text';
import {
  AccountDetailDatatable,
  BlockDetailDatatable,
  RealmDetailDatatable,
} from '@/components/view/datatable';
import {TokenDatatable} from '@/components/view/datatable/token';
import React, {useEffect, useState} from 'react';
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

        <Wrapper>
          <RealmDetailDatatable pkgPath="gno.land/r/demo/boards" />
        </Wrapper>

        <Wrapper>
          {/* <AccountDetailDatatable address='g1ffzxha57dh0qgv9ma5v393ur0zexfvp6lsjpae' /> */}
        </Wrapper>

        <Wrapper>{/* <BlockDetailDatatable height='863' /> */}</Wrapper>
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
