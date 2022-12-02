import Text from '@/components/ui/text';
import {RealmDatatable} from '@/components/view/datatable/realm';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

interface Realms {
  name: string;
  path: string;
  functions: number;
  block: number;
  publisher: string;
  username: string;
  total_calls: number;
  total_gas_used: number;
}
const Realms = () => {
  const [realms, setRealms] = useState<Array<Realms>>([]);

  useEffect(() => {
    fetchRealms();
  }, []);

  const fetchRealms = () => {
    try {
      fetch('http://3.218.133.250:7677/v3/list/realms')
        .then(res => res.json())
        .then(res => setRealms(res.realms));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <div className="inner-layout">
        <Wrapper>
          <Text type="h2" margin={'0 0 24px 0'} color="primary">
            {'Realms'}
          </Text>
          <RealmDatatable datas={realms} />
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

export default Realms;
