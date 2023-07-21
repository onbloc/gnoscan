'use client';

import {DetailsPageLayout} from '@/components/core/layout';
import {ButtonProps} from '@/components/ui/button';
import mixins from '@/styles/mixins';
import React from 'react';
import styled from 'styled-components';
import IconArrow from '@/assets/svgs/icon-arrow.svg';
import {isDesktop} from '@/common/hooks/use-media';
import {useRouter} from 'next/router';
import {useQuery, UseQueryResult} from 'react-query';
import Text from '@/components/ui/text';
import {DateDiffText, DLWrap, FitContentA} from '@/components/ui/detail-page-common-styles';
import DataSection from '@/components/view/details-data-section';
import Badge from '@/components/ui/badge';
import Link from 'next/link';
import {BlockDetailDatatable} from '@/components/view/datatable';
import {BlockDetailsModel} from '@/models/block-details-model';
import {getBlockDetails} from '@/repositories/api/fetchers/api-block-details';
import {blockDetailSelector} from '@/repositories/api/selector/select-block-details';
import IconCopy from '@/assets/svgs/icon-copy.svg';

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
  const {
    data: block,
    isSuccess: blockSuccess,
    isFetched,
  }: UseQueryResult<BlockDetailsModel> = useQuery(
    ['block/height', height],
    async () => await getBlockDetails(height),
    {
      enabled: !!height,
      retry: 0,
      select: (res: any) => blockDetailSelector(res.data),
    },
  );

  return (
    <DetailsPageLayout
      title={`Block #${block?.height}`}
      titleOption={
        blockSuccess && (
          <TitleOption
            prevProps={{disabled: block?.prev, path: `/blocks/${Number(block?.height - 1)}`}}
            nextProps={{disabled: block?.next, path: `/blocks/${Number(block?.height + 1)}`}}
          />
        )
      }
      titleAlign={desktop ? 'flex-start' : 'space-between'}
      visible={!isFetched}
      keyword={`Block #${height}`}
      error={!blockSuccess}>
      <DataSection title="Summary">
        <DLWrap desktop={desktop}>
          <dt>Timestamp</dt>
          <dd>
            <Badge>
              <Text type="p4" color="inherit" className="ellipsis">
                {block?.timestamp}
              </Text>
              <DateDiffText>{block?.dateDiff}</DateDiffText>
            </Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={desktop}>
          <dt>Network</dt>
          <dd>
            <Badge>{block?.network}</Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={desktop}>
          <dt>Height</dt>
          <dd>
            <Badge>{block?.height}</Badge>
          </dd>
        </DLWrap>
        <DLWrap desktop={desktop}>
          <dt>Transactions</dt>
          <dd>
            <Badge>{block?.txs}</Badge>
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
              <Link href={`/accounts/${block?.address}`} passHref>
                <FitContentA>
                  <Text type="p4" color="blue" className="ellipsis">
                    {block?.proposer}
                  </Text>
                </FitContentA>
              </Link>
            </Badge>
          </dd>
        </DLWrap>
      </DataSection>

      <DataSection title="Transactions">
        {height && <BlockDetailDatatable height={`${height}`} />}
      </DataSection>
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
