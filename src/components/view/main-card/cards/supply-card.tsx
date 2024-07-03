import React from 'react';
import Text from '@/components/ui/text';
import IconInfo from '@/assets/svgs/icon-info.svg';
import {Button} from '@/components/ui/button';
import Tooltip from '@/components/ui/tooltip';
import {useGNOTSupply} from '@/common/hooks/main/use-gnot-supply-info';
import {BundleDl, DataBoxContainer, FetchedComp} from '../main-card';

export const SupplyCard = () => {
  const {isFetched, supplyInfo} = useGNOTSupply();

  return (
    <>
      <FetchedComp
        skeletonWidth={130}
        skeletonheight={28}
        skeletonMargin="10px 0px 24px"
        isFetched={isFetched}
        renderComp={
          <Text type="h3" color="primary" margin="10px 0px 24px">
            {supplyInfo.totalSupplyAmount}
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
              isFetched={isFetched}
              renderComp={
                <Text type="p4" color="primary">
                  {supplyInfo.airdropSupplyAmount}
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
              isFetched={isFetched}
              renderComp={
                <Text type="p4" color="primary">
                  {supplyInfo.airdropHolder}
                </Text>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </>
  );
};
