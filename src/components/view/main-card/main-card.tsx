'use client';

import React, {useEffect, useMemo} from 'react';
import styled from 'styled-components';
import Card from '@/components/ui/card';
import {eachMedia} from '@/common/hooks/use-media';
import mixins from '@/styles/mixins';
import {SkeletonBar} from '@/components/ui/loading/skeleton-bar';
import dynamic from 'next/dynamic';
import Text from '@/components/ui/text';
import IconInfo from '@/assets/svgs/icon-info.svg';
import {Button} from '@/components/ui/button';
import Tooltip from '@/components/ui/tooltip';
import {SupplyCard, BlockCard, TxsCard, AccountCard} from './cards';
import {dehydrate, QueryClient} from 'react-query';

// export async function getStaticProps() {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery('posts', useInfoCard);

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }

const MainCard = () => {
  const media = eachMedia();

  return (
    <Wrapper className={media}>
      <StyledCard>
        <Text type="h5" color="primary" className="title-info">
          GNOT&nbsp;Supply
          <Tooltip
            width={229}
            content="This number represents the total supply at Genesis in Testnet 3, which is subject to change in mainnet.">
            <Button width="16px" height="16px" radius="50%" bgColor="base">
              <IconInfo className="svg-info" />
            </Button>
          </Tooltip>
        </Text>
        <SupplyCard />
      </StyledCard>

      <StyledCard>
        <Text type="h5" color="primary">
          Block&nbsp;Height
        </Text>
        <BlockCard />
      </StyledCard>

      <StyledCard>
        <Text type="h5" color="primary">
          Total&nbsp;Transactions
        </Text>
        <TxsCard />
      </StyledCard>
      <StyledCard>
        <Text type="h5" color="primary" className="title-info">
          Total&nbsp;Accounts
          <Tooltip content="Total number of accounts included in at least 1 transaction.">
            <Button width="16px" height="16px" radius="50%" bgColor="base">
              <IconInfo className="svg-info" />
            </Button>
          </Tooltip>
        </Text>
        <AccountCard />
      </StyledCard>
    </Wrapper>
  );
};

export const FetchedComp = ({
  skeletonWidth,
  skeletonheight = 16,
  skeletonMargin = '',
  isFetched,
  renderComp,
}: {
  skeletonWidth: number;
  skeletonheight?: number;
  skeletonMargin?: string;
  isFetched: boolean;
  renderComp: React.ReactNode;
}) => {
  return (
    <>
      {isFetched ? (
        renderComp
      ) : (
        <SkeletonBar width={skeletonWidth} height={skeletonheight} margin={skeletonMargin} />
      )}
    </>
  );
};

export const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 32px;
  grid-template-columns: repeat(4, 1fr);
  &.tablet {
    grid-template-columns: 1fr 1fr;
    grid-gap: 16px;
  }
  &.mobile {
    grid-template-columns: 1fr;
    grid-gap: 16px;
  }
  .title-info {
    ${mixins.flexbox('row', 'center', 'flex-start')};
    gap: 6px;
  }
  .svg-info {
    fill: ${({theme}) => theme.colors.reverse};
  }
`;

export const DataBoxContainer = styled.div`
  background-color: ${({theme}) => theme.colors.base};
  border: 1px solid ${({theme}) => theme.colors.dimmed50};
  border-radius: 10px;
  width: 100%;
  padding: 16px;
  hr {
    width: 100%;
    border-top: 1px solid ${({theme}) => theme.colors.dimmed50};
    margin: 10px 0px;
  }
`;

export const BundleDl = styled.dl`
  ${mixins.flexbox('row', 'center', 'space-between')};
  dt {
    ${mixins.flexbox('row', 'center', 'flex-start')};
    gap: 6px;
  }
`;

const StyledCard = styled(Card)`
  width: 100%;
  min-height: 223px;
`;

export default MainCard;
