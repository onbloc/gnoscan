import React from 'react';
import Text from '@/components/ui/text';
import axios from 'axios';
import {useQuery, UseQueryResult} from 'react-query';
import {numberWithCommas} from '@/common/utils';
import IconInfo from '@/assets/svgs/icon-info.svg';
import {Button} from '@/components/ui/button';
import Tooltip from '@/components/ui/tooltip';
import {API_URI, API_VERSION} from '@/common/values/constant-value';
import {BundleDl, DataBoxContainer, FetchedComp} from '../main-card';

interface SupplyResultType {
  supply: string;
  exit: string;
  airdrop_recipients: string;
}

export const SupplyCard = () => {
  const {
    data: card01,
    isSuccess: card01Success,
    isFetched: card01Fetched,
  }: UseQueryResult<SupplyResultType> = useQuery(
    ['info/card01'],
    async () => await axios.get(API_URI + API_VERSION + '/info/card01'),
    {
      select: (res: any) => {
        const supply = res.data.gnot_supply;
        return {
          supply: numberWithCommas(supply.supply),
          exit: numberWithCommas(supply.exit),
          airdrop_recipients: numberWithCommas(supply.airdrop_recipients),
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
        isFetched={card01Fetched}
        renderComp={
          <Text type="h3" color="primary" margin="10px 0px 24px">
            {card01?.supply}
            <Text type="p4" display="inline-block" color="primary">
              &nbsp;GNOT
            </Text>
          </Text>
        }
      />
      <DataBoxContainer>
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Airdrop Supply
            </Text>
            <Tooltip
              width={215}
              content="Estimated supply of GNOTs to be airdropped. This number is not final, and is subject to change.">
              <Button width="16px" height="16px" radius="50%" bgColor="surface">
                <IconInfo className="svg-info" />
              </Button>
            </Tooltip>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={card01Fetched}
              renderComp={
                <Text type="p4" color="primary">
                  {card01?.exit}
                </Text>
              }
            />
          </dd>
        </BundleDl>
        <hr />
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Airdrop&nbsp;Holders
            </Text>
            <Tooltip content="Total number of holders eligible for the GNOT airdrop. This number is not final and is subject to change.">
              <Button width="16px" height="16px" radius="50%" bgColor="surface">
                <IconInfo className="svg-info" />
              </Button>
            </Tooltip>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={card01Fetched}
              renderComp={
                <Text type="p4" color="primary">
                  {card01?.airdrop_recipients}
                </Text>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </>
  );
};
