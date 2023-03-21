import React from 'react';
import Text from '@/components/ui/text';
import {useQuery, UseQueryResult} from 'react-query';
import IconInfo from '@/assets/svgs/icon-info.svg';
import {Button} from '@/components/ui/button';
import Tooltip from '@/components/ui/tooltip';
import {BundleDl, DataBoxContainer, FetchedComp} from '../main-card';
import {getAccountCard} from '@/repositories/api/fetchers/api-info-card';
import {accountCardSelector} from '@/repositories/api/selector/select-info-card';
import {AccountCardModel} from '@/models';

export const AccountCard = () => {
  const {data: card04, isFetched: card04Fetched}: UseQueryResult<AccountCardModel> = useQuery(
    ['info/card04'],
    async () => await getAccountCard(),
    {
      select: (res: any) => accountCardSelector(res.data.account),
    },
  );

  return (
    <>
      <FetchedComp
        skeletonWidth={130}
        skeletonheight={28}
        skeletonMargin="10px 0px 24px"
        isFetched={card04Fetched}
        renderComp={
          <Text type="h3" color="primary" margin="10px 0px 24px">
            {card04?.totalAccounts}
          </Text>
        }
      />
      <DataBoxContainer>
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Validators
            </Text>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={card04Fetched}
              renderComp={
                <Text type="p4" color="primary">
                  {card04?.validators}
                </Text>
              }
            />
          </dd>
        </BundleDl>
        <hr />
        <BundleDl>
          <dt>
            <Text type="p4" color="tertiary">
              Total&nbsp;Users
            </Text>
            <Tooltip content="Number of accounts registered as a user on /r/demo/users.">
              <Button width="16px" height="16px" radius="50%" bgColor="surface">
                <IconInfo className="svg-info" />
              </Button>
            </Tooltip>
          </dt>
          <dd>
            <FetchedComp
              skeletonWidth={60}
              isFetched={card04Fetched}
              renderComp={
                <Text type="p4" color="primary">
                  {card04?.totalUsers}
                </Text>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </>
  );
};
