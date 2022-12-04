'use client';

import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {eachMedia, isDesktop} from '@/common/hooks/use-media';
import axios from 'axios';
import {useRouter} from 'next/router';
import {useQuery, UseQueryOptions, UseQueryResult} from 'react-query';
import {Button, ViewMoreButton} from '@/components/ui/button';
import {DetailsPageLayout} from '@/components/core/layout';
import Text from '@/components/ui/text';
import mixins from '@/styles/mixins';
import GnoscanSymbol from '@/assets/svgs/icon-gnoscan-symbol.svg';
import IconCopy from '@/assets/svgs/icon-copy.svg';
import {decimalPointWithCommas, numberWithCommas, numberWithFixedCommas} from '@/common/utils';
import {AmountText} from '@/components/ui/text/amount-text';
import Tooltip from '@/components/ui/tooltip';
import IconLink from '@/assets/svgs/icon-link.svg';
import {v1} from 'uuid';
interface StyleProps {
  media?: string;
  padding?: string;
  isDesktop?: boolean;
}

interface AssetsType {
  denom: string;
  value: number | string;
  name: string;
}
interface DetailResultType {
  address: string;
  username: string;
  assets: AssetsType[];
}

const AccountDetails = () => {
  // const [page, setPage] = useState(0);
  // const [assets, setAssets] = useState<any[]>([]);
  const media = eachMedia();
  const desktop = isDesktop();
  const router = useRouter();
  const {address} = router.query;
  const {data: detail, isSuccess: detailSuccess}: UseQueryResult<DetailResultType> = useQuery(
    ['detail/address', address],
    async ({queryKey}) =>
      await axios.get(`http://3.218.133.250:7677/latest/account/detail/${queryKey[1]}`),
    {
      enabled: !!address,
      select: (res: any) => {
        return {
          ...res.data,
          username: res.data.username,
          assets: res.data.assets.map((v: any) => {
            const value =
              v.denom === 'ugnot'
                ? [numberWithCommas(v.value / 1000000)]
                : decimalPointWithCommas(v.value);
            return {
              ...v,
              value,
            };
          }),
        };
      },
      onSuccess: (res: any) => console.log('Detail Data : ', res.data),
    },
  );

  const {data: txs, isSuccess: txsSuccess} = useQuery(
    ['txs/address', address],
    async ({queryKey}) =>
      await axios.get(`http://3.218.133.250:7677/latest/account/txs/${queryKey[1]}`),
    {
      enabled: !!address,
      // select: (res: any) => {
      //   console.log('Txs Data : ', res.data);
      // },
      onSuccess: (res: any) => console.log('Txs Data : ', res.data),
    },
  );

  return (
    <DetailsPageLayout title="Account Details">
      <Container media={media}>
        <Text type={desktop ? 'p1' : 'p4'} color="primary">
          Address
        </Text>
        {detailSuccess && (
          <GrayBox padding={desktop ? '22px 24px' : '12px 16px'}>
            <AddressTextBox type={desktop ? 'p3' : 'p4'} color="primary" media={media}>
              {detail.address}
              <Tooltip
                content="Copied!"
                trigger="click"
                copyText={detail.address}
                className="address-tooltip">
                <IconCopy className="svg-icon" />
              </Tooltip>
              {detail.username && (
                <Text type="p4" color="blue" className="username-text">
                  {detail.username}
                  <StyledA
                    href={`https://test3.gno.land/r/demo/users:${detail.username}`}
                    target="_blank"
                    rel="noreferrer">
                    <IconLink className="svg-icon" />
                  </StyledA>
                </Text>
              )}
            </AddressTextBox>
          </GrayBox>
        )}
      </Container>
      <Container media={media}>
        <Text type={desktop ? 'p1' : 'p4'} color="primary">
          Assets
        </Text>
        {detailSuccess && (
          <Content className={media}>
            {detail.assets.map((v: AssetsType) => (
              <GrayBox key={v1()} padding={desktop ? '16px 24px' : '12px 16px'}>
                <LogoImg>
                  <GnoscanSymbol className="logo-icon" width="21" height="21" />
                </LogoImg>
                <AmountText minSize="p4" maxSize="p3" value={v.value} />
              </GrayBox>
            ))}
          </Content>
        )}
      </Container>
    </DetailsPageLayout>
  );
};

const AddressTextBox = styled(Text)<StyleProps>`
  display: block;
  overflow: hidden;
  word-break: break-all;
  .address-tooltip {
    vertical-align: text-bottom;
  }
  .logo-icon {
    fill: ${({theme}) => theme.colors.primary};
  }
  .svg-icon {
    stroke: ${({theme}) => theme.colors.primary};
    margin-left: 5px;
  }
  .username-text {
    ${mixins.flexbox('row', 'center', 'center', false)};
    position: relative;
    padding-left: ${({media}) => (media === 'mobile' ? '14px' : '40px')};
    word-break: keep-all;
    &:after {
      content: '';
      width: 1px;
      height: 18px;
      background-color: ${({theme}) => theme.colors.primary};
      ${mixins.posTopCenterLeft(0)};
      margin-left: ${({media}) => (media === 'mobile' ? '7px' : '20px')};
    }
  }
`;

const Container = styled.div<StyleProps>`
  ${mixins.flexbox('column', 'flex-start', 'space-between')};
  background-color: ${({theme}) => theme.colors.base};
  padding: ${({media}) => (media === 'desktop' ? '24px' : '16px')};
  border-radius: 10px;
  width: 100%;
  gap: 16px;
  & + & {
    margin-top: ${({media}) => (media === 'desktop' ? '24px' : '16px')};
  }
`;

const Content = styled.div<StyleProps>`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 16px;
  &.desktop {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const GrayBox = styled.div<StyleProps>`
  ${mixins.flexbox('row', 'center', 'flex-start')};
  width: 100%;
  padding: ${({padding}) => padding};
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: 4px;
`;

const StyledA = styled.a`
  ${mixins.flexbox('row', 'center', 'center')};
`;

const LogoImg = styled.div`
  ${mixins.flexbox('row', 'center', 'center')};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({theme}) => theme.colors.base};
  margin-right: auto;
`;

export default AccountDetails;
