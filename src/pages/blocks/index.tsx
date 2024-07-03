import {useBlocks} from '@/common/hooks/blocks/use-blocks';
import useLoading from '@/common/hooks/use-loading';
import Text from '@/components/ui/text';
import {BlockDatatable} from '@/components/view/datatable';
import LoadingPage from '@/components/view/loading/page';
import React from 'react';
import styled from 'styled-components';

const Block = () => {
  const {loading} = useLoading();

  return (
    <Container>
      <div className="inner-layout">
        <LoadingPage visible={loading} />
        <Wrapper visible={!loading}>
          <Text type="h2" margin={'0 0 24px 0'} color="primary">
            {'Blocks'}
          </Text>
          <BlockDatatable />
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

export default Block;
