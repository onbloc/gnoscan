'use client';

import {DetailsPageLayout} from '@/components/core/layout';
import {ButtonProps} from '@/components/ui/button';
import mixins from '@/styles/mixins';
import React, {useMemo, useState} from 'react';
import styled from 'styled-components';
import IconArrow from '@/assets/svgs/icon-arrow.svg';
import {isDesktop} from '@/common/hooks/use-media';
import {useRouter} from '@/common/hooks/common/use-router';
import Text from '@/components/ui/text';
import {DateDiffText, DLWrap, FitContentA} from '@/components/ui/detail-page-common-styles';
import DataSection from '@/components/view/details-data-section';
import Badge from '@/components/ui/badge';
import Link from 'next/link';
import {BlockDetailDatatable} from '@/components/view/datatable';
import IconCopy from '@/assets/svgs/icon-copy.svg';
import {useBlock} from '@/common/hooks/blocks/use-block';
import DataListSection from '@/components/view/details-data-section/data-list-section';
import {useNetwork} from '@/common/hooks/use-network';
import {useGetValidatorNames} from '@/common/hooks/common/use-get-validator-names';
import {EventDatatable} from '@/components/view/datatable/event';

interface TitleOptionProps {
  prevProps: {
    disabled: boolean;
    path: string;
  };
  nextProps: {
    disabled: boolean;
    path: string;
  };
}

const TitleOption = ({prevProps, nextProps}: TitleOptionProps) => {
  const {getUrlWithNetwork} = useNetwork();

  return (
    <TitleWrap>
      <Link href={getUrlWithNetwork(prevProps.path)}>
        <ArrowButton disabled={prevProps.disabled}>
          <IconArrow className="icon-arrow-right" />
        </ArrowButton>
      </Link>
      <Link href={getUrlWithNetwork(nextProps.path)}>
        <ArrowButton disabled={nextProps.disabled}>
          <IconArrow className="icon-arrow-left" />
        </ArrowButton>
      </Link>
    </TitleWrap>
  );
};

const BlockDetails = () => {
  const desktop = isDesktop();
  const router = useRouter();
  const {height} = router.query;
  const {block, events, isFetched} = useBlock(Number(height));
  const [currentTab, setCurrentTab] = useState('Transactions');
  const {getUrlWithNetwork} = useNetwork();
  const {validatorInfos} = useGetValidatorNames();

  const detailTabs = useMemo(() => {
    return [
      {
        tabName: 'Transactions',
      },
      {
        tabName: 'Events',
        size: events.length,
      },
    ];
  }, [events]);

  const proposerDisplayName = useMemo(() => {
    const validatorInfo = validatorInfos?.find(info => info.address === block.proposerAddress);
    if (!validatorInfo) {
      return block.proposerAddress;
    }

    return `${block.proposerAddress} (${validatorInfo.name})`;
  }, [block.proposerAddress, validatorInfos]);

  return (
    <DetailsPageLayout
      title={`Block #${block.blockHeight}`}
      titleOption={
        isFetched && (
          <TitleOption
            prevProps={{
              disabled: !block?.hasPreviousBlock,
              path: `/blocks/${Number(block.blockHeight) - 1}`,
            }}
            nextProps={{
              disabled: !block?.hasNextBlock,
              path: `/blocks/${Number(block.blockHeight) + 1}`,
            }}
          />
        )
      }
      titleAlign={desktop ? 'flex-start' : 'space-between'}
      visible={!isFetched}
      keyword={`Block #${height}`}
      error={!isFetched}>
      <DataSection title="Summary">
        <DLWrap desktop={desktop}>
          <dt>Timestamp</dt>
          <dd>
            <Badge>
              <Text type="p4" color="inherit" className="ellipsis">
                {block.timeStamp.time}
              </Text>
              <DateDiffText>{block.timeStamp.passedTime}</DateDiffText>
            </Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={desktop}>
          <dt>Network</dt>
          <dd>
            <Badge>{block.network}</Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={desktop}>
          <dt>Height</dt>
          <dd>
            <Badge>{block.blockHeightStr}</Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={desktop}>
          <dt>Transactions</dt>
          <dd>
            <Badge>{block.numberOfTransactions}</Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={desktop}>
          <dt>Gas&nbsp;(Used/Wanted)</dt>
          <dd>
            <Badge>{block?.gas}</Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={desktop} multipleBadgeGap="24px">
          <dt>Proposer</dt>
          <dd>
            <Badge>
              <FitContentA>
                <Link href={getUrlWithNetwork(`/accounts/${block?.proposerAddress}`)} passHref>
                  <Text type="p4" color="blue" className="ellipsis">
                    {proposerDisplayName}
                  </Text>
                </Link>
              </FitContentA>
            </Badge>
          </dd>
        </DLWrap>
      </DataSection>

      <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
        {currentTab === 'Transactions' && <BlockDetailDatatable height={`${height}`} />}
        {currentTab === 'Events' && <EventDatatable isFetched={isFetched} events={events} />}
      </DataListSection>
    </DetailsPageLayout>
  );
};

const TitleWrap = styled.div`
  ${mixins.flexbox('row', 'center', 'center', false)};
  gap: 8px;
  margin-left: 16px;
`;

const ArrowButton = styled.a<ButtonProps>`
  ${mixins.flexbox('row', 'center', 'center')};
  width: 32px;
  height: 32px;
  background-color: ${({theme}) => theme.colors.surface};
  border: 1px solid
    ${({theme, disabled}) => (disabled ? theme.colors.gray100 : theme.colors.dimmed100)};
  pointer-events: ${({disabled}) => (disabled ? 'none' : '')};
  cursor: ${({disabled}) => (disabled ? 'default' : 'pointer')};
  svg {
    fill: ${({theme, disabled}) => (disabled ? theme.colors.gray200 : theme.colors.reverse)};
    &.icon-arrow-right {
      transform: rotate(180deg);
    }
  }
`;

const StyledIconCopy = styled(IconCopy)`
  stroke: ${({theme}) => theme.colors.primary};
  margin-left: 5px;
`;

export default BlockDetails;
