'use client';

import React, {useEffect} from 'react';
import styled from 'styled-components';
import {eachMedia, isDesktop} from '@/common/hooks/use-media';
import {useRouter} from 'next/router';
import {useQuery, UseQueryResult} from 'react-query';
import {DetailsPageLayout} from '@/components/core/layout';
import Text from '@/components/ui/text';
import mixins from '@/styles/mixins';
import UnknownToken from '@/assets/svgs/icon-unknown-token.svg';
import IconCopy from '@/assets/svgs/icon-copy.svg';
import {AmountText} from '@/components/ui/text/amount-text';
import Tooltip from '@/components/ui/tooltip';
import IconLink from '@/assets/svgs/icon-link.svg';
import {v1} from 'uuid';
import DataSection from '@/components/view/details-data-section';
import {AccountDetailDatatable} from '@/components/view/datatable';
import {getAccountDetails} from '@/repositories/api/fetchers/api-account-details';
import {accountDetailSelector} from '@/repositories/api/selector/select-account-details';
import {AccountDetailsModel, AssetsDataType} from '@/models/account-details-model';
import {useRecoilValue} from 'recoil';
import {tokenState} from '@/states';
// import {saveAllTokens, tokensMapper} from '@/repositories/api/selector/select-meta-token';

interface StyleProps {
  media?: string;
  padding?: string;
  isDesktop?: boolean;
}

const AccountDetails = () => {
  const media = eachMedia();
  const desktop = isDesktop();
  const router = useRouter();
  const tokens = useRecoilValue(tokenState);
  const {address} = router.query;
  const {
    data: detail,
    isSuccess: detailSuccess,
    isFetched,
  }: UseQueryResult<AccountDetailsModel> = useQuery(
    ['detail/address', address],
    async () => await getAccountDetails(address),
    {
      enabled: !!address && tokens.length > 0,
      retry: 0,
      select: (res: any) => accountDetailSelector(res.data, tokens),
    },
  );

  return (
    <DetailsPageLayout
      title="Account Details"
      visible={!isFetched}
      keyword={`${address}`}
      error={!detailSuccess}>
      <DataSection title="Address">
        {detailSuccess && (
          <GrayBox padding={desktop ? '22px 24px' : '12px 16px'}>
            <AddressTextBox type={desktop ? 'p4' : 'p4'} color="primary" media={media}>
              {detail.address}
              <Tooltip
                className="address-copy-tooltip"
                content="Copied!"
                trigger="click"
                copyText={detail?.address}
                width={85}>
                <IconCopy className="svg-icon" />
              </Tooltip>
              {detail.username && (
                <Text type="p4" color="blue" className="username-text">
                  <StyledA
                    href={`https://test3.gno.land/r/demo/users:${detail.username}`}
                    target="_blank"
                    rel="noreferrer">
                    {detail.username}
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
            {detail.assets.map((v: AssetsDataType) => (
              <GrayBox key={v1()} padding={desktop ? '16px 24px' : '12px 16px'}>
                <LogoImg>
                  {v.image ? (
                    <img src={v.image} alt="token-image" />
                  ) : (
                    <UnknownToken className="unknown-token" width="40" height="40" />
                  )}
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

      <DataSection title="Transactions">
        {address && <AccountDetailDatatable address={`${address}`} />}
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
    margin-left: 10px;
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

  .address-copy-tooltip {
    display: inline-flex;
    height: 20px;
    justify-content: center;
    align-items: center;
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
  border-radius: 50%;
  background-color: ${({theme}) => theme.colors.base};
  .logo-icon {
    fill: ${({theme}) => theme.colors.primary};
  }
  img {
    width: 40px;
    height: 40px;
  }
`;

export default AccountDetails;
