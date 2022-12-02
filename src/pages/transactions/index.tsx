import Text from '@/components/ui/text';
import {TransactionDatatable} from '@/components/view/transaction-datatable';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

interface TransactionData {
  tx_hash: string;
  success: boolean;
  type: string;
  func: string;
  block: number;
  from_address: string;
  amount: {
    value: number;
    denom: string;
  };
  time: string;
  gas_used: number;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Array<TransactionData>>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    try {
      fetch('http://3.218.133.250:7677/v3/list/txs')
        .then(res => res.json())
        .then(res => setTransactions(res));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <div className="inner-layout">
        <Wrapper>
          <Text type="h2" margin={'0 0 24px 0'} color="primary">
            {'Transactions'}
          </Text>
          <TransactionDatatable datas={transactions} />
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

export default Transactions;
