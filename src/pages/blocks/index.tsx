import Text from '@/components/ui/text';
import {BlockDatatable} from '@/components/view/datatable';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

interface BlockData {
  block_hash: string;
  height: number;
  time: string;
  tx_count: number;
  proposer: string;
  total_fees: number;
}

const Block = () => {
  const [blocks, setBlocks] = useState<Array<BlockData>>([]);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = () => {
    try {
      fetch('http://3.218.133.250:7677/v3/list/blocks')
        .then(res => res.json())
        .then(res => setBlocks(res));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container>
      <div className="inner-layout">
        <Wrapper>
          <Text type="h2" margin={'0 0 24px 0'} color="primary">
            {'Blocks'}
          </Text>
          <BlockDatatable datas={blocks} />
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

export default Block;
