'use client';

import React from 'react';
import styled from 'styled-components';
import {eachMedia, isDesktop} from '@/common/hooks/use-media';
import axios from 'axios';
import {useRouter} from 'next/router';
import {useQuery, UseQueryResult} from 'react-query';
import {DetailsPageLayout} from '@/components/core/layout';
import Text from '@/components/ui/text';
import mixins from '@/styles/mixins';
import GnoscanSymbol from '@/assets/svgs/icon-gnoscan-symbol.svg';
import IconCopy from '@/assets/svgs/icon-copy.svg';
import {AmountText} from '@/components/ui/text/amount-text';
import Tooltip from '@/components/ui/tooltip';
import IconLink from '@/assets/svgs/icon-link.svg';
import {v1} from 'uuid';
import DataSection from '@/components/view/details-data-section';
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
            return {
              ...v,
              value: v.denom === 'ugnot' ? v.value / 1000000 : v.value,
            };
          }),
        };
      },
      // onSuccess: (res: any) => console.log('Detail Data : ', res.data),
    },
  );

  return (
    <DetailsPageLayout title="Account Details">
      <DataSection title="Address">
        {detailSuccess && (
          <GrayBox padding={desktop ? '22px 24px' : '12px 16px'}>
            <AddressTextBox type={desktop ? 'p3' : 'p4'} color="primary" media={media}>
              {detail.address}
              <Tooltip
                content="Copied!"
                trigger="click"
                copyText={detail?.address}
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
      </DataSection>
      <DataSection title="Assets">
        {detailSuccess && (
          <Content className={media}>
            {detail.assets.map((v: AssetsType) => (
              <GrayBox key={v1()} padding={desktop ? '16px 24px' : '12px 16px'}>
                <LogoImg>
                  <GnoscanSymbol className="logo-icon" width="21" height="21" />
                </LogoImg>
                <Text type={desktop ? 'p3' : 'p4'} color="primary" margin="0px auto 0px 16px">
                  {v.name}
                </Text>
                <AmountText minSize="p4" maxSize="p3" value={v.value} />
              </GrayBox>
            ))}
          </Content>
        )}
      </DataSection>
    </DetailsPageLayout>
  );
};

const AddressTextBox = styled(Text)<StyleProps>`
  display: block;
  word-break: break-all;
  .address-tooltip {
    vertical-align: text-bottom;
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
  .logo-icon {
    fill: ${({theme}) => theme.colors.primary};
  }
`;

export default AccountDetails;
