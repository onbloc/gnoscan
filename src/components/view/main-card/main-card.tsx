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
import {denomConvert} from '@/common/utils/gnot-util';
interface SupplyResultType {
  supply: string;
  exit: string;
  holders: string;
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
  denom: string;
}

interface AccountsResultType {
  num: string;
  registered: string;
  validators: string;
}

const MainCard = () => {
  const media = eachMedia();
  const {data: card01, isSuccess: card01Success}: UseQueryResult<SupplyResultType> = useQuery(
    ['info/card01'],
    async () => await axios.get(API_URI + '/latest/info/card01'),
    {
      select: (res: any) => {
        const supply = res.data.gnot_supply;
        return {
          supply: numberWithCommas(supply.supply),
          exit: numberWithCommas(supply.exit),
          holders: numberWithCommas(supply.holders),
        };
      },
    },
  );

  const {data: card02, isSuccess: card02Success}: UseQueryResult<HeightResultType> = useQuery(
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

  const {data: card03, isSuccess: card03Success}: UseQueryResult<TxResultType> = useQuery(
    ['info/card03'],
    async () => await axios.get(API_URI + '/latest/info/card03'),
    {
      select: (res: any) => {
        const tx = res.data.tx;
        return {
          avg_24hr: numberWithFixedCommas(tx.avg_24hr / 1000000, 6),
          total_fee: numberWithFixedCommas(tx.total_fee / 1000000, 2),
          total_txs: numberWithCommas(tx.total_txs),
          denom: denomConvert('GNOT'),
        };
      },
    },
  );

  const {data: card04, isSuccess: card04Success}: UseQueryResult<AccountsResultType> = useQuery(
    ['info/card04'],
    async () => await axios.get(API_URI + '/latest/info/card04'),
    {
      select: (res: any) => {
        const account = res.data.account;
        return {
          num: numberWithCommas(account.num),
          registered: numberWithCommas(account.registered),
          validators: numberWithCommas(account.validators),
        };
      },
    },
  );

  return (
    <Wrapper className={media}>
      <StyledCard>
        {card01Success && (
          <>
            <Text type="h5" color="primary">
              GNOT&nbsp;Supply
              <Tooltip
                width={229}
                content="This number represents the total supply at Genesis in Testnet 3, which is subject to change in mainnet.">
                <Button width="16px" height="16px" radius="50%" bgColor="base" margin="5px">
                  <IconInfo className="svg-info" />
                </Button>
              </Tooltip>
            </Text>
            <Text type="h3" color="primary" margin="10px 0px 24px">
              {card01?.supply}
              <Text type="p4" display="inline-block" color="primary">
                &nbsp;GNOT
              </Text>
            </Text>
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
                  <Text type="p4" color="primary">
                    {card01?.exit}
                  </Text>
                </dd>
              </BundleDl>
              <hr />
              <BundleDl>
                <dt>
                  <Text type="p4" color="tertiary">
                    Holders
                  </Text>
                  <Tooltip width={164} content="Number of accounts with a positive GNOT Balance.">
                    <Button width="16px" height="16px" radius="50%" bgColor="surface">
                      <IconInfo className="svg-info" />
                    </Button>
                  </Tooltip>
                </dt>
                <dd>
                  <Text type="p4" color="primary">
                    {card01?.holders}
                  </Text>
                </dd>
              </BundleDl>
            </DataBox>
          </>
        )}
      </StyledCard>
      <StyledCard>
        {card02Success && (
          <>
            <Text type="h5" color="primary">
              Block&nbsp;Height
            </Text>
            <Text type="h3" color="primary" margin="10px 0px 24px">
              {card02.height}
            </Text>
            <DataBox>
              <BundleDl>
                <dt>
                  <Text type="p4" color="tertiary">
                    Avg.&nbsp;Block Time
                  </Text>
                </dt>
                <dd>
                  <Text type="p4" color="primary">
                    {`${card02?.avg_time} seconds`}
                  </Text>
                </dd>
              </BundleDl>
              <hr />
              <BundleDl>
                <dt>
                  <Text type="p4" color="tertiary">
                    Avg.&nbsp;Tx/Block
                  </Text>
                </dt>
                <dd>
                  <Text type="p4" color="primary">
                    {card02?.avg_tx}
                  </Text>
                </dd>
              </BundleDl>
            </DataBox>
          </>
        )}
      </StyledCard>
      <StyledCard>
        {card03Success && (
          <>
            <Text type="h5" color="primary">
              Total&nbsp;Transactions
            </Text>
            <Text type="h3" color="primary" margin="10px 0px 24px">
              {card03?.total_txs}
            </Text>
            <DataBox>
              <BundleDl>
                <dt>
                  <Text type="p4" color="tertiary">
                    24h&nbsp;Avg.&nbsp;Fee
                  </Text>
                </dt>
                <dd>
                  <Text type="p4" color="primary">
                    {`${card03?.avg_24hr} ${card03?.denom}`}
                  </Text>
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
                  <Text type="p4" color="primary">
                    {`${card03?.total_fee} ${card03?.denom}`}
                  </Text>
                </dd>
              </BundleDl>
            </DataBox>
          </>
        )}
      </StyledCard>
      <StyledCard>
        {card04Success && (
          <>
            <Text type="h5" color="primary" className="title-info">
              Total&nbsp;Accounts
              <Tooltip width={164} content="Number of accounts included in at least 1 transaction.">
                <Button width="16px" height="16px" radius="50%" bgColor="base">
                  <IconInfo className="svg-info" />
                </Button>
              </Tooltip>
            </Text>
            <Text type="h3" color="primary" margin="10px 0px 24px">
              {card04?.num}
            </Text>
            <DataBox>
              <BundleDl>
                <dt>
                  <Text type="p4" color="tertiary">
                    Validators
                  </Text>
                </dt>
                <dd>
                  <Text type="p4" color="primary">
                    {card04?.validators}
                  </Text>
                </dd>
              </BundleDl>
              <hr />
              <BundleDl>
                <dt>
                  <Text type="p4" color="tertiary">
                    Total&nbsp;Users
                  </Text>
                  <Tooltip
                    width={164}
                    content="Number of accounts registered as a user on /r/demo/users.">
                    <Button width="16px" height="16px" radius="50%" bgColor="surface">
                      <IconInfo className="svg-info" />
                    </Button>
                  </Tooltip>
                </dt>
                <dd>
                  <Text type="p4" color="primary">
                    {card04?.registered}
                  </Text>
                </dd>
              </BundleDl>
            </DataBox>
          </>
        )}
      </StyledCard>
    </Wrapper>
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
