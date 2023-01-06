import React from 'react';
import Text from '@/components/ui/text';
import {useQuery, UseQueryResult} from 'react-query';
import {BundleDl, DataBoxContainer, FetchedComp} from '../main-card';
import {BlockCardModel} from '@/models';
import {getBlockCard} from '@/repositories/api/fetchers/api-info-card';
import {blockCardSelector} from '@/repositories/api/selector/select-info-card';

export const BlockCard = () => {
  const {data: card02, isFetched: card02Fetched}: UseQueryResult<BlockCardModel> = useQuery(
    ['info/card02'],
    async () => await getBlockCard(),
    {
      select: (res: any) => blockCardSelector(res.data.block),
    },
  );

  return (
    <>
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
      <DataBoxContainer>
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
      </DataBoxContainer>
    </>
  );
};
