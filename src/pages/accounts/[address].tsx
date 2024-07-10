'use client';

import React, {useMemo, useState} from 'react';
import styled from 'styled-components';
import {eachMedia, isDesktop} from '@/common/hooks/use-media';
import {DetailsPageLayout} from '@/components/core/layout';
import Text from '@/components/ui/text';
import mixins from '@/styles/mixins';
import UnknownToken from '@/assets/svgs/icon-unknown-token.svg';
import IconCopy from '@/assets/svgs/icon-copy.svg';
import {AmountText} from '@/components/ui/text/amount-text';
import Tooltip from '@/components/ui/tooltip';
import DataSection from '@/components/view/details-data-section';
import {AccountDetailDatatable} from '@/components/view/datatable';
import {searchKeyword} from '@/repositories/api/fetchers/api-search-keyword';
import {useAccount} from '@/common/hooks/account/use-account';
import {useTokenMeta} from '@/common/hooks/common/use-token-meta';
import {Amount} from '@/types/data-type';
import DataListSection from '@/components/view/details-data-section/data-list-section';
import {EventDatatable} from '@/components/view/datatable/event';

interface AccountDetailsPageProps {
  address: string;
  redirectUrl: string | null;
}

interface StyleProps {
  media?: string;
  padding?: string;
  isDesktop?: boolean;
}

const AccountDetails = ({address}: AccountDetailsPageProps) => {
  const media = eachMedia();
  const desktop = isDesktop();
  const {getTokenImage, getTokenAmount, getTokenInfo} = useTokenMeta();
  const bech32Address = useMemo(() => {
    return address;
  }, [address]);

  const {isFetched, tokenBalances, username, transactionEvents} = useAccount(bech32Address);
  const [currentTab, setCurrentTab] = useState('Transactions');

  const detailTabs = useMemo(() => {
    return [
      {
        tabName: 'Transactions',
      },
      {
        tabName: 'Events',
        size: transactionEvents.length,
      },
    ];
  }, [transactionEvents]);

  return (
    <DetailsPageLayout title="Account Details" visible={!isFetched} keyword={`${address}`}>
      <DataSection title="Address">
        <GrayBox padding={desktop ? '22px 24px' : '12px 16px'}>
          <AddressTextBox type={desktop ? 'p4' : 'p4'} color="primary" media={media}>
            {bech32Address}
            <Tooltip
              className="address-copy-tooltip"
              content="Copied!"
              trigger="click"
              copyText={bech32Address}
              width={85}>
              <IconCopy className={`svg-icon ${username ? '' : 'tidy'}`} />
            </Tooltip>
            {/* {username && (
              <Text type="p4" color="blue" className="username-text">
                <StyledA
                  href={`https://test3.gno.land/r/demo/users:${username}`}
                  target="_blank"
                  rel="noreferrer">
                  {username}
                  <IconLink className="svg-icon" />
                </StyledA>
              </Text>
            )} */}
          </AddressTextBox>
        </GrayBox>
      </DataSection>
      <DataSection title="Assets">
        <Content className={media}>
          {tokenBalances.map((amount: Amount, index: number) => (
            <GrayBox key={index} padding={desktop ? '16px 24px' : '12px 16px'}>
              <LogoImg>
                {getTokenImage(amount.denom) ? (
                  <img src={getTokenImage(amount.denom)} alt="token-image" />
                ) : (
                  <UnknownToken className="unknown-token" width="40" height="40" />
                )}
              </LogoImg>

              <Text type={desktop ? 'p3' : 'p4'} color="primary" margin="0px auto 0px 16px">
                {getTokenInfo(amount.denom)?.name || ''}
              </Text>
              <AmountText
                minSize="p4"
                maxSize="p3"
                {...getTokenAmount(amount.denom, amount.value)}
              />
            </GrayBox>
          ))}
        </Content>
      </DataSection>

      <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
        {currentTab === 'Transactions' && <AccountDetailDatatable address={`${address}`} />}
        {currentTab === 'Events' && (
          <EventDatatable isFetched={isFetched} events={transactionEvents} />
        )}
      </DataListSection>
    </DetailsPageLayout>
  );
};

export async function getServerSideProps({params}: any) {
  const keyword = params.address;
  try {
    const result = await searchKeyword(keyword);
    const data = result.data;
    if (data?.type === 'pkg_path') {
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/realms/details?path=${data?.value}`,
        },
      };
    }
  } catch {}
  return {
    props: {
      address: keyword,
      redirectUrl: null,
    },
  };
}

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
