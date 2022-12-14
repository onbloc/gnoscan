import React from 'react';
import Text from '@/components/ui/text';
import axios from 'axios';
import {useQuery, UseQueryResult} from 'react-query';
import {numberWithCommas, numberWithFixedCommas} from '@/common/utils';
import {API_URI} from '@/common/values/constant-value';
import {BundleDl, DataBoxContainer, FetchedComp} from '../main-card';

interface HeightResultType {
  height: string;
  avg_tx: string;
  avg_time: string;
}

export const BlockCard = () => {
  const {
    data: card02,
    isSuccess: card02Success,
    isFetched: card02Fetched,
  }: UseQueryResult<HeightResultType> = useQuery(
    ['info/card02'],
    async () => await axios.get(API_URI + '/latest/info/card02'),
    {
      select: (res: any) => {
        const block = res.data.block;
        console.log(block);
        return {
          height: numberWithCommas(block.height),
          avg_tx: numberWithFixedCommas(block.avg_tx, 2),
          avg_time: numberWithFixedCommas(block.avg_time, 2),
        };
      },
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
              Avg.&nbsp;Tx/Block
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
