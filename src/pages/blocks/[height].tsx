'use client';

import {DetailsPageLayout} from '@/components/core/layout';
import {ButtonProps} from '@/components/ui/button';
import mixins from '@/styles/mixins';
import React from 'react';
import styled from 'styled-components';
import IconArrow from '@/assets/svgs/icon-arrow.svg';
import {eachMedia, isDesktop} from '@/common/hooks/use-media';
import {useRouter} from 'next/router';
import {useQuery, UseQueryResult} from 'react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import {numberWithCommas} from '@/common/utils';
import {getDateDiff} from '@/common/utils/date-util';
import Text from '@/components/ui/text';
import {DateDiffText, DLWrap, FitContentA} from '@/components/ui/detail-page-common-styles';
import DataSection from '@/components/view/details-data-section';
import Badge from '@/components/ui/badge';
import Link from 'next/link';

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

interface SummaryResultType {
  timestamp: string;
  dateDiff: string;
  network: string;
  height: number;
  txs: number;
  gas: string;
  proposer: string;
  address: string;
  prev: boolean;
  next: boolean;
}

const TitleOption = ({prevProps, nextProps}: TitleOptionProps) => {
  return (
    <TitleWrap>
      <Link href={prevProps.path}>
        <ArrowButton disabled={prevProps.disabled}>
          <IconArrow className="icon-arrow-right" />
        </ArrowButton>
      </Link>
      <Link href={nextProps.path}>
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
  const {data: summary, isSuccess: summarySuccess}: UseQueryResult<SummaryResultType> = useQuery(
    ['summary/height', height],
    async ({queryKey}) =>
      await axios.get(`http://3.218.133.250:7677/latest/block/summary/${queryKey[1]}`),
    {
      enabled: !!height,
      select: (res: any) => {
        const data = res.data;
        const gasPercent = Number.isNaN(data.gas.used / data.gas.wanted)
          ? 0
          : data.gas.used / data.gas.wanted;
        return {
          ...data,
          timestamp: `${dayjs(data.timestamp).format('YYYY-MM-DD HH:mm:ss')} (UTC)`,
          dateDiff: getDateDiff(data.timestamp),
          network: data.network,
          height: data.height,
          txs: data.num_txs,
          gas: `${numberWithCommas(data.gas.used)}/${numberWithCommas(
            data.gas.wanted,
          )} (${gasPercent}%)`,
          proposer: Boolean(data.username) ? data.username : data.proposer,
          address: data.proposer,
          prev: data.height === 1,
          next: !data.next,
        };
      },
      // onSuccess: (res: any) => console.log('Summary Data : ', res),
    },
  );

  return (
    <>
      {summarySuccess && (
        <DetailsPageLayout
          title={`Block #${summary?.height}`}
          titleOption={
            <TitleOption
              prevProps={{disabled: summary?.prev, path: `/blocks/${Number(summary?.height - 1)}`}}
              nextProps={{disabled: summary?.next, path: `/blocks/${Number(summary?.height + 1)}`}}
            />
          }
          titleAlign={desktop ? 'flex-start' : 'space-between'}>
          <DataSection title="Summary">
            <DLWrap desktop={desktop}>
              <dt>Timestamp</dt>
              <dd>
                <Badge>
                  <Text type="p4" color="inherit" className="ellipsis">
                    {summary?.timestamp}
                  </Text>
                  <DateDiffText>{summary?.dateDiff}</DateDiffText>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Network</dt>
              <dd>
                <Badge>{summary?.network}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Height</dt>
              <dd>
                <Badge>{summary?.height}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Transactions</dt>
              <dd>
                <Badge>{summary?.txs}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Gas&nbsp;(Used/Wanted)</dt>
              <dd>
                <Badge>{summary?.gas}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop} multipleBadgeGap="24px">
              <dt>Proposer</dt>
              <dd>
                <Badge>
                  <Link href={`/accounts/${summary.address}`} passHref>
                    <FitContentA>
                      <Text type="p4" color="blue" className="ellipsis">
                        {summary?.proposer}
                      </Text>
                    </FitContentA>
                  </Link>
                </Badge>
              </dd>
            </DLWrap>
          </DataSection>
        </DetailsPageLayout>
      )}
    </>
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

export default BlockDetails;
