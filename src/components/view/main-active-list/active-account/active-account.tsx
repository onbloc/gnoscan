import React from 'react';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';
import {useQuery, UseQueryResult} from 'react-query';
import ActiveList from '@/components/ui/active-list';
import {v1} from 'uuid';
import {
  colWidth,
  List,
  listTitle,
  StyledAmountText,
  StyledCard,
  StyledText,
} from '../main-active-list';
import Link from 'next/link';
import {getLocalDateString} from '@/common/utils/date-util';
import Tooltip from '@/components/ui/tooltip';
import FetchedSkeleton from '../fetched-skeleton';
import {AccountDataType, AccountListModel} from '@/models/active-list-model';
import {getAccountList} from '@/repositories/api/fetchers/api-active-list';
import {accountListSelector} from '@/repositories/api/selector/select-active-list';
import BigNumber from 'bignumber.js';

const ActiveAccount = () => {
  const media = eachMedia();
  const {data: accounts, isFetched: accountsFetched}: UseQueryResult<AccountListModel> = useQuery(
    ['info/most_active_account'],
    async () => await getAccountList(),
    {
      select: (res: any) => accountListSelector(res.data),
    },
  );

  return (
    <StyledCard>
      <Text className="active-list-title" type="h6" color="primary">
        Monthly Active Accounts
        {media !== 'mobile' && accountsFetched && (
          <Text type="body1" color="tertiary">
            {`Last Updated: ${getLocalDateString(accounts?.last_update)}`}
          </Text>
        )}
      </Text>
      {accountsFetched ? (
        <ActiveList title={listTitle.accounts} colWidth={colWidth.accounts}>
          {accounts?.data.map((v: AccountDataType) => (
            <List key={v1()}>
              <StyledText type="p4" width={colWidth.accounts[0]} color="tertiary">
                {v.no}
              </StyledText>
              <StyledText className="with-link" type="p4" width={colWidth.accounts[1]} color="blue">
                <Link href={`/accounts/${v.address}`} passHref>
                  <a target="_blank">
                    <Tooltip content={v.address}>{v.account}</Tooltip>
                  </a>
                </Link>
              </StyledText>
              <StyledText type="p4" width={colWidth.accounts[2]} color="reverse">
                {v.totalTxs}
              </StyledText>
              <StyledText type="p4" width={colWidth.accounts[3]} color="reverse">
                {v.nonTxs}
              </StyledText>
              <StyledAmountText
                minSize="body2"
                maxSize="p4"
                color="reverse"
                value={v.balance}
                width={colWidth.accounts[4]}
              />
            </List>
          ))}
        </ActiveList>
      ) : (
        <FetchedSkeleton />
      )}
      {media === 'mobile' && accountsFetched && (
        <Text type="body1" color="tertiary" margin="16px 0px 0px" textAlign="right">
          {`Last Updated: ${getLocalDateString(accounts?.last_update)}`}
        </Text>
      )}
    </StyledCard>
  );
};

export default ActiveAccount;
