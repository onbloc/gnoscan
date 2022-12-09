import React from 'react';
import axios from 'axios';
import Text from '@/components/ui/text';
import {eachMedia} from '@/common/hooks/use-media';
import {useQuery, UseQueryResult} from 'react-query';
import {decimalPointWithCommas, formatAddress, formatEllipsis} from '@/common/utils';
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

type AccountsValueType = {
  no: number;
  address: string;
  account: string;
  totalTxs: number;
  nonTxs: number;
  balance: number;
};

interface AccountsResultType {
  last_update: string;
  data: AccountsValueType[];
}

const onSuccess = () => console.log('11111');

const ActiveAccount = () => {
  const media = eachMedia();
  const {data: accounts, isSuccess: accountsSuccess}: UseQueryResult<AccountsResultType> = useQuery(
    'info/most_active_account',
    async () => await axios.get('http://3.218.133.250:7677/latest/info/most_active_account'),
    {
      select: (res: any) => {
        const accounts = res.data.accounts.map((v: any, i: number) => {
          return {
            no: v.idx,
            address: v.account_address,
            account: Boolean(v.account_name)
              ? formatEllipsis(v.account_name)
              : formatAddress(v.account_address),
            totalTxs: v.total_txs,
            nonTxs: v.non_transfer_txs,
            balance: v.balance.denom === 'ugnot' ? v.balance.value / 1000000 : v.balance.value,
          };
        });
        return {
          last_update: res.data.last_update,
          data: accounts,
        };
      },
      // onSuccess: res => console.log('Accounts Data : ', res),
    },
  );

  return (
    <StyledCard>
      {accountsSuccess && (
        <>
          <Text className="active-list-title" type="h6" color="primary">
            Monthly Active Accounts
            {media !== 'mobile' && (
              <Text type="body1" color="tertiary">
                {`Last Updated: ${accounts?.last_update}`}
              </Text>
            )}
          </Text>
          <ActiveList title={listTitle.accounts} colWidth={colWidth.accounts}>
            <>
              {accounts.data.map((v: AccountsValueType) => (
                <List key={v1()}>
                  <StyledText type="p4" width={colWidth.accounts[0]} color="reverse">
                    {v.no}
                  </StyledText>
                  <Link href={`/accounts/${v.address}`} passHref>
                    <a>
                      <StyledText type="p4" width={colWidth.accounts[1]} color="blue">
                        {v.account}
                      </StyledText>
                    </a>
                  </Link>
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
            </>
          </ActiveList>
          {media === 'mobile' && (
            <Text type="body1" color="tertiary" margin="16px 0px 0px" textAlign="right">
              {`Last Updated: ${accounts?.last_update}`}
            </Text>
          )}
        </>
      )}
    </StyledCard>
  );
};

export default ActiveAccount;
