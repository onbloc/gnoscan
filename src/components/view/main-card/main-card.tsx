'use client';

import React from 'react';
import styled from 'styled-components';
import Card from '@/components/ui/card';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';
import axios from 'axios';
import {useQuery, UseQueryResult} from 'react-query';
import {numberWithCommas, numberWithFixedCommas} from '@/common/utils';
import mixins from '@/styles/mixins';
import IconInfo from '@/assets/svgs/icon-info.svg';
import {Button} from '@/components/ui/button';
import Tooltip from '@/components/ui/tooltip';
import {API_URI} from '@/common/values/constant-value';
import {SkeletonBoxStyle} from '@/components/ui/loading';
import {SkeletonBar} from '@/components/ui/loading/skeleton-bar';
interface SupplyResultType {
  supply: string;
  exit: string;
  airdrop_holders: string;
}

interface HeightResultType {
  height: string;
  avg_tx: string;
  avg_time: string;
}

interface TxResultType {
  avg_24hr: string;
  total_fee: string;
  total_txs: string;
}

interface AccountsResultType {
  total: string;
  registered: string;
  validators: string;
}

const MainCard = () => {
  const media = eachMedia();
  const {
    data: card01,
    isSuccess: card01Success,
    isFetched: card01Fetched,
  }: UseQueryResult<SupplyResultType> = useQuery(
    ['info/card01'],
    async () => await axios.get(API_URI + '/latest/info/card01'),
    {
      select: (res: any) => {
        const supply = res.data.gnot_supply;
        return {
          supply: numberWithCommas(supply.supply),
          exit: numberWithCommas(supply.exit),
          airdrop_holders: numberWithCommas(supply.airdrop_holders),
        };
      },
    },
  );

  const {
    data: card02,
    isSuccess: card02Success,
    isFetched: card02Fetched,
  }: UseQueryResult<HeightResultType> = useQuery(
    ['info/card02'],
    async () => await axios.get(API_URI + '/latest/info/card02'),
    {
      select: (res: any) => {
        const block = res.data.block;
        return {
          height: numberWithCommas(block.height),
          avg_tx: numberWithFixedCommas(block.avg_tx, 2),
          avg_time: numberWithFixedCommas(block.avg_time, 2),
        };
      },
    },
  );

  const {
    data: card03,
    isSuccess: card03Success,
    isFetched: card03Fetched,
  }: UseQueryResult<TxResultType> = useQuery(
    ['info/card03'],
    async () => await axios.get(API_URI + '/latest/info/card03'),
    {
      select: (res: any) => {
        const tx = res.data.tx;
        return {
          avg_24hr: numberWithFixedCommas(tx.avg_24hr / 1000000, 6),
          total_fee: numberWithFixedCommas(tx.total_fee / 1000000, 2),
          total_txs: numberWithCommas(tx.total_txs),
        };
      },
    },
  );

  const {
    data: card04,
    isSuccess: card04Success,
    isFetched: card04Fetched,
  }: UseQueryResult<AccountsResultType> = useQuery(
    ['info/card04'],
    async () => await axios.get(API_URI + '/latest/info/card04'),
    {
      select: (res: any) => {
        const account = res.data.account;
        return {
          total: numberWithCommas(account.total),
          registered: numberWithCommas(account.registered),
          validators: numberWithCommas(account.validators),
        };
      },
    },
  );

  return (
    <Wrapper className={media}>
      <StyledCard>
        <SkeletonBoxStyle />
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
        <FetchedComp
          skeletonWidth={130}
          skeletonheight={28}
          skeletonMargin="10px 0px 24px"
          isFetched={card01Fetched}
          renderComp={
            <Text type="h3" color="primary" margin="10px 0px 24px">
              {card01?.supply}
              <Text type="p4" display="inline-block" color="primary">
                &nbsp;GNOT
              </Text>
            </Text>
          }
        />
        <DataBox>
          <BundleDl>
            <dt>
              <Text type="p4" color="tertiary">
                Airdrop Supply
              </Text>
              <Tooltip
                width={215}
                content="Estimated supply of GNOTs to be airdropped. This number is not final, and is subject to change.">
                <Button width="16px" height="16px" radius="50%" bgColor="surface">
                  <IconInfo className="svg-info" />
                </Button>
              </Tooltip>
            </dt>
            <dd>
              <FetchedComp
                skeletonWidth={60}
                isFetched={card01Fetched}
                renderComp={
                  <Text type="p4" color="primary">
                    {card01?.exit}
                  </Text>
                }
              />
            </dd>
          </BundleDl>
          <hr />
          <BundleDl>
            <dt>
              <Text type="p4" color="tertiary">
                Airdrop&nbsp;Holders
              </Text>
              <Tooltip content="Total number of holders eligible for the GNOT airdrop. This number is not final and is subject to change.">
                <Button width="16px" height="16px" radius="50%" bgColor="surface">
                  <IconInfo className="svg-info" />
                </Button>
              </Tooltip>
            </dt>
            <dd>
              <FetchedComp
                skeletonWidth={60}
                isFetched={card01Fetched}
                renderComp={
                  <Text type="p4" color="primary">
                    {card01?.airdrop_holders}
                  </Text>
                }
              />
            </dd>
          </BundleDl>
        </DataBox>
      </StyledCard>
      <StyledCard>
        <Text type="h5" color="primary">
          Block&nbsp;Height
        </Text>
        <FetchedComp
          skeletonWidth={130}
          skeletonheight={28}
          skeletonMargin="10px 0px 24px"
          isFetched={card02Fetched}
          renderComp={
            <Text type="h3" color="primary" margin="10px 0px 24px">
              {card02?.height}
            </Text>
          }
        />
        <DataBox>
          <BundleDl>
            <dt>
              <Text type="p4" color="tertiary">
                Avg.&nbsp;Block Time
              </Text>
            </dt>
            <dd>
              <FetchedComp
                skeletonWidth={60}
                isFetched={card02Fetched}
                renderComp={
                  <Text type="p4" color="primary">
                    {`${card02?.avg_time} seconds`}
                  </Text>
                }
              />
            </dd>
          </BundleDl>
          <hr />
          <BundleDl>
            <dt>
              <Text type="p4" color="tertiary">
                Avg.&nbsp;Tx per Block
              </Text>
            </dt>
            <dd>
              <FetchedComp
                skeletonWidth={60}
                isFetched={card02Fetched}
                renderComp={
                  <Text type="p4" color="primary">
                    {card02?.avg_tx}
                  </Text>
                }
              />
            </dd>
          </BundleDl>
        </DataBox>
      </StyledCard>
      <StyledCard>
        <Text type="h5" color="primary">
          Total&nbsp;Transactions
        </Text>
        <FetchedComp
          skeletonWidth={130}
          skeletonheight={28}
          skeletonMargin="10px 0px 24px"
          isFetched={card03Fetched}
          renderComp={
            <Text type="h3" color="primary" margin="10px 0px 24px">
              {card03?.total_txs}
            </Text>
          }
        />
        <DataBox>
          <BundleDl>
            <dt>
              <Text type="p4" color="tertiary">
                24h&nbsp;Avg.&nbsp;Fee
              </Text>
            </dt>
            <dd>
              <FetchedComp
                skeletonWidth={60}
                isFetched={card03Fetched}
                renderComp={
                  <Text type="p4" color="primary">
                    {card03?.avg_24hr}
                  </Text>
                }
              />
            </dd>
          </BundleDl>
          <hr />
          <BundleDl>
            <dt>
              <Text type="p4" color="tertiary">
                Total&nbsp;Fees
              </Text>
            </dt>
            <dd>
              <FetchedComp
                skeletonWidth={60}
                isFetched={card03Fetched}
                renderComp={
                  <Text type="p4" color="primary">
                    {card03?.total_fee}
                  </Text>
                }
              />
            </dd>
          </BundleDl>
        </DataBox>
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
        <FetchedComp
          skeletonWidth={130}
          skeletonheight={28}
          skeletonMargin="10px 0px 24px"
          isFetched={card04Fetched}
          renderComp={
            <Text type="h3" color="primary" margin="10px 0px 24px">
              {card04?.total}
            </Text>
          }
        />
        <DataBox>
          <BundleDl>
            <dt>
              <Text type="p4" color="tertiary">
                Validators
              </Text>
            </dt>
            <dd>
              <FetchedComp
                skeletonWidth={60}
                isFetched={card04Fetched}
                renderComp={
                  <Text type="p4" color="primary">
                    {card04?.validators}
                  </Text>
                }
              />
            </dd>
          </BundleDl>
          <hr />
          <BundleDl>
            <dt>
              <Text type="p4" color="tertiary">
                Total&nbsp;Users
              </Text>
              <Tooltip content="Number of accounts registered as a user on /r/demo/users.">
                <Button width="16px" height="16px" radius="50%" bgColor="surface">
                  <IconInfo className="svg-info" />
                </Button>
              </Tooltip>
            </dt>
            <dd>
              <FetchedComp
                skeletonWidth={60}
                isFetched={card04Fetched}
                renderComp={
                  <Text type="p4" color="primary">
                    {card04?.registered}
                  </Text>
                }
              />
            </dd>
          </BundleDl>
        </DataBox>
      </StyledCard>
    </Wrapper>
  );
};

const FetchedComp = ({
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

const DataBox = ({children}: {children: React.ReactNode}) => {
  return <DataBoxContainer>{children}</DataBoxContainer>;
};

const Wrapper = styled.div`
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
  .u-gnot {
  }
`;

const DataBoxContainer = styled.div`
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

const StyledCard = styled(Card)`
  width: 100%;
  min-height: 223px;
`;

const BundleDl = styled.dl`
  ${mixins.flexbox('row', 'center', 'space-between')};
  dt {
    ${mixins.flexbox('row', 'center', 'flex-start')};
    gap: 6px;
  }
`;

export default MainCard;
