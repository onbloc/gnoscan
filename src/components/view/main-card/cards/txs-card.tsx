import React from 'react';
import Text from '@/components/ui/text';
import axios from 'axios';
import {useQuery, UseQueryResult} from 'react-query';
import {numberWithCommas, numberWithFixedCommas} from '@/common/utils';
import {API_URI} from '@/common/values/constant-value';
import {BundleDl, DataBoxContainer, FetchedComp} from '../main-card';

interface TxResultType {
  avg_24hr: string;
  total_fee: string;
  total_txs: string;
}

export const TxsCard = () => {
  const {
    data: card03,
    isSuccess: card03Success,
    isFetched: card03Fetched,
  }: UseQueryResult<TxResultType> = useQuery(
    ['info/card03'],
    async () => await axios.get(API_URI + '/latest/info/card03'),
    {
      select: (res: any) => {
        const tx = res.data.tx;
        return {
          avg_24hr: numberWithFixedCommas(tx.avg_24hr / 1000000, 6),
          total_fee: numberWithFixedCommas(tx.total_fee / 1000000, 2),
          total_txs: numberWithCommas(tx.total_txs),
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
        isFetched={card03Fetched}
        renderComp={
          <Text type="h3" color="primary" margin="10px 0px 24px">
            {card03?.total_txs}
          </Text>
        }
      />
      <DataBoxContainer>
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              24h&nbsp;Avg.&nbsp;Fee
            </Text>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={card03Fetched}
              renderComp={
                <Text type="p4" color="primary">
                  {card03?.avg_24hr}
                </Text>
              }
            />
          </dd>
        </BundleDl>
        <hr />
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Total&nbsp;Fees
            </Text>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={card03Fetched}
              renderComp={
                <Text type="p4" color="primary">
                  {card03?.total_fee}
                </Text>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </>
  );
};
