import {useNetworkProvider} from '@/common/hooks/provider/use-network-provider';
import useLoading from '@/common/hooks/use-loading';
import Text from '@/components/ui/text';
import {TransactionDatatable} from '@/components/view/datatable';
import {TransactionApiDatatable} from '@/components/view/datatable/transaction/transaction-api';
import LoadingPage from '@/components/view/loading/page';
import TransactionSearch from '@/components/view/transaction-search/transaction-search';
import React, {useEffect} from 'react';
import styled from 'styled-components';

const Transactions = () => {
  const {isCustomNetwork, indexerQueryClient} = useNetworkProvider();
  const {loading} = useLoading();

  useEffect(() => {
    window?.dispatchEvent(new Event('resize'));
  }, [loading]);

  return (
    <Container>
      <div className="inner-layout">
        {indexerQueryClient ? (
          <React.Fragment>
            <LoadingPage visible={loading} />
            <Wrapper visible={!loading}>
              <Text type="h2" margin={'0 0 24px 0'} color="primary">
                {'Transactions'}
              </Text>
              {isCustomNetwork ? <TransactionDatatable /> : <TransactionApiDatatable />}
            </Wrapper>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Wrapper visible={true}>
              <Text type="h2" margin={'0 0 24px 0'} color="primary">
                {'Transactions'}
              </Text>

              <TransactionSearch />
            </Wrapper>
          </React.Fragment>
        )}
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
