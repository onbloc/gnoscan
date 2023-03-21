import React from 'react';
import Text from '@/components/ui/text';
import {useQuery, UseQueryResult} from 'react-query';
import {BundleDl, DataBoxContainer, FetchedComp} from '../main-card';
import {getTxsCard} from '@/repositories/api/fetchers/api-info-card';
import {txsCardSelector} from '@/repositories/api/selector/select-info-card';
import {TxsCardModel} from '@/models';

export const TxsCard = () => {
  const {data: card03, isFetched: card03Fetched}: UseQueryResult<TxsCardModel> = useQuery(
    ['info/card03'],
    async () => await getTxsCard(),
    {
      select: (res: any) => txsCardSelector(res.data.tx),
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
