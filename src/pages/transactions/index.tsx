import useLoading from '@/common/hooks/use-loading';
import Text from '@/components/ui/text';
import {TransactionDatatable} from '@/components/view/datatable';
import LoadingPage from '@/components/view/loading/page';
import React, {useEffect} from 'react';
import styled from 'styled-components';

const Transactions = () => {
  const {loading} = useLoading();

  useEffect(() => {
    window?.dispatchEvent(new Event('resize'));
  }, [loading]);

  return (
    <Container>
      <div className="inner-layout">
        <LoadingPage visible={loading} />
        <Wrapper visible={!loading}>
          <Text type="h2" margin={'0 0 24px 0'} color="primary">
            {'Transactions'}
          </Text>
          <TransactionDatatable />
        </Wrapper>
      </div>
    </Container>
  );
};

const Container = styled.main`
  width: 100%;
  flex: 1;
`;

const Wrapper = styled.div<{visible?: boolean}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 40px 0;
  padding: 24px;
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: 10px;
  ${({visible}) => !visible && 'display: none;'}
`;

export default Transactions;
