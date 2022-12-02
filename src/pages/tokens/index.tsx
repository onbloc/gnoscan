import Text from '@/components/ui/text';
import {AccountDetailDatatable} from '@/components/view/datatable';
import {TokenDatatable} from '@/components/view/datatable/token';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

interface TokenData {
  token: string;
  holder: number;
  function: string;
  decimal: number;
  total_supply: string;
  pkg_path: string;
}

const Tokens = () => {
  const [tokens, setTokens] = useState<Array<TokenData>>([]);

  const fetchTokens = () => {};

  return (
    <Container>
      <div className="inner-layout">
        <Wrapper>
          <Text type="h2" margin={'0 0 24px 0'} color="primary">
            {'Tokens'}
          </Text>
          <TokenDatatable datas={tokens} />
        </Wrapper>

        <Wrapper>
          <AccountDetailDatatable />
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
