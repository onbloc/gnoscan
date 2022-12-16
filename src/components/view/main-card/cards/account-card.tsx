import React from 'react';
import Text from '@/components/ui/text';
import axios from 'axios';
import {useQuery, UseQueryResult} from 'react-query';
import {numberWithCommas} from '@/common/utils';
import IconInfo from '@/assets/svgs/icon-info.svg';
import {Button} from '@/components/ui/button';
import Tooltip from '@/components/ui/tooltip';
import {API_URI} from '@/common/values/constant-value';
import {BundleDl, DataBoxContainer, FetchedComp} from '../main-card';

interface AccountsResultType {
  total: string;
  registered: string;
  validators: string;
}

export const AccountCard = () => {
  const {
    data: card04,
    isSuccess: card04Success,
    isFetched: card04Fetched,
  }: UseQueryResult<AccountsResultType> = useQuery(
    ['info/card04'],
    async () => await axios.get(API_URI + '/latest/info/card04'),
    {
      select: (res: any) => {
        const account = res.data.account;
        return {
          total: numberWithCommas(account.total),
          registered: numberWithCommas(account.registered),
          validators: numberWithCommas(account.validators),
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
        isFetched={card04Fetched}
        renderComp={
          <Text type="h3" color="primary" margin="10px 0px 24px">
            {card04?.total}
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
                  {card04?.registered}
                </Text>
              }
            />
          </dd>
        </BundleDl>
      </DataBoxContainer>
    </>
  );
};
