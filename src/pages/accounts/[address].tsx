'use client';

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {eachMedia, isDesktop} from '@/common/hooks/use-media';
import axios from 'axios';
import {useRouter} from 'next/router';
import {useQuery} from 'react-query';
import {ViewMoreButton} from '@/components/ui/button';
import {DetailsPageLayout} from '@/components/core/layout';
import Text from '@/components/ui/text';
import mixins from '@/styles/mixins';
import GnoscanSymbol from '@/assets/svgs/icon-gnoscan-symbol.svg';
import {decimalPointWithCommas, numberWithFixedCommas} from '@/common/utils';
import {AmountText} from '@/components/ui/text/amount-text';

interface StyleProps {
  media?: string;
  padding?: string;
  isDesktop?: boolean;
}

const Accounts = () => {
  // const [page, setPage] = useState(0);
  // const [assets, setAssets] = useState<any[]>([]);
  const media = eachMedia();
  const desktop = isDesktop();
  const router = useRouter();
  const {address} = router.query;
  const {data: detail, isSuccess: detailSuccess} = useQuery(
    ['detail/address', address],
    async ({queryKey}) =>
      await axios.get(`http://3.218.133.250:7677/v0/account/detail/${queryKey[1]}`),
    {
      enabled: !!address,
      select: (res: any) => {
        // console.log(res.data);
        return {
          ...res.data,
          assets: res.data.assets.map((v: any) => {
            const value = v.denom === 'ugnot' ? v.value / 1000000 : v.value;
            return {
              ...v,
              value,
            };
          }),
        };
      },
    },
  );

  const {data: txs, isSuccess: txsSuccess} = useQuery(
    ['txs/address', address],
    async ({queryKey}) =>
      await axios.get(`http://3.218.133.250:7677/v0/account/txs/${queryKey[1]}`),
    {
      enabled: !!address,
      select: (res: any) => {
        // console.log('Txs Data : ', res.data);
      },
    },
  );

  return (
    <DetailsPageLayout title="Account Details">
      <AddressContainer>
        <Text type={desktop ? 'p1' : 'p4'}>Address</Text>
        {detailSuccess && (
          <Content isDesktop={desktop}>
            <GrayBox padding={desktop ? '22px 24px' : '12px 16px'}>
              <Text type={desktop ? 'p3' : 'p4'} color="primary">
                {detail.address}
              </Text>
            </GrayBox>
          </Content>
        )}
      </AddressContainer>
    </DetailsPageLayout>
  );
};

const Wrapper = styled.div``;

const AddressContainer = styled.div`
  .aaa {
    fill: white;
  }
`;

const Content = styled.div<StyleProps>`
  width: 100%;
  padding: ${({isDesktop}) => (isDesktop ? '24px' : '16px')};
  ${mixins.flexbox('column', 'center', 'flex-start')}
`;

const GrayBox = styled.div<StyleProps>`
  ${mixins.flexbox('row', 'center', 'flex-start')};
  width: 100%;
  padding: ${({padding}) => padding};
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: 4px;
`;

const GrayHalfBox = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 16px;
  margin: 16px 0px;
  &.desktop {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 32px;
    margin: 32px 0px;
  }
`;

export default Accounts;
