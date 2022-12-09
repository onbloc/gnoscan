import React from 'react';
import {useQuery, UseQueryResult} from 'react-query';
import {useRouter} from 'next/router';
import {isDesktop} from '@/common/hooks/use-media';
import {numberWithCommas} from '@/common/utils';
import {DetailsPageLayout} from '@/components/core/layout';
import Badge from '@/components/ui/badge';
import {DLWrap, FitContentA} from '@/components/ui/detail-page-common-styles';
import DataSection from '@/components/view/details-data-section';
import axios from 'axios';
import Text from '@/components/ui/text';
import Link from 'next/link';
import ShowLog from '@/components/ui/show-log';
import {LogDataType} from '@/components/view/tabs/tabs';
import {v1} from 'uuid';
import {TokenDetailDatatable} from '@/components/view/datatable';
import {API_URI} from '@/common/values/constant-value';

type TokenResultType = {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  tokenPath: string;
  funcs: string[];
  owner: string;
  address: string;
  holders: string;
  log: LogDataType;
};

const TokenDetails = () => {
  const desktop = isDesktop();
  const router = useRouter();
  const {denom} = router.query;
  const {
    data: token,
    isSuccess: tokenSuccess,
    isFetched,
  }: UseQueryResult<TokenResultType> = useQuery(
    ['token/denom', denom],
    async ({queryKey}) => await axios.get(API_URI + `/latest/token/summary/${queryKey[1]}`),
    {
      enabled: !!denom,
      select: (res: any) => {
        const tokenData = res.data;
        return {
          name: tokenData.name,
          symbol: tokenData.symbol,
          totalSupply: numberWithCommas(tokenData.total_supply),
          decimals: tokenData.decimals,
          tokenPath: tokenData.token_path,
          funcs: tokenData.funcs,
          owner: Boolean(tokenData.owner_name) ? tokenData.owner_name : tokenData.owner_address,
          address: tokenData.owner_adress,
          holders: numberWithCommas(tokenData.holders),
          log: {
            list: tokenData.contract_list,
            content: tokenData.contract_content,
          },
        };
      },
      // onSuccess: (res: any) => console.log('Token Data : ', res),
    },
  );

  return (
    <DetailsPageLayout title={'Token Details'} visible={!isFetched}>
      {tokenSuccess && (
        <>
          <DataSection title="Summary">
            <DLWrap desktop={desktop}>
              <dt>Name</dt>
              <dd>
                <Badge>{token.name}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Symbol</dt>
              <dd>
                <Badge>{token.symbol}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Total Supply</dt>
              <dd>
                <Badge>{token.totalSupply}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Decimals</dt>
              <dd>
                <Badge>{token.decimals}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Path</dt>
              <dd>
                <Badge>{token.tokenPath}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Function Type(s)</dt>
              <dd>
                {token.funcs.map((v: string) => (
                  <Badge type="blue" key={v1()}>
                    <Text type="p4" color="white">
                      {v}
                    </Text>
                  </Badge>
                ))}
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Owner</dt>
              <dd>
                <Badge>
                  <Link href={`/accounts/${token.address}`} passHref>
                    <FitContentA>
                      <Text type="p4" color="blue">
                        {token.owner}
                      </Text>
                    </FitContentA>
                  </Link>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Holders</dt>
              <dd>
                <Badge>{token.holders}</Badge>
              </dd>
            </DLWrap>
            {token.log && <ShowLog isTabLog={true} tabData={token.log} btnTextType="Logs" />}
          </DataSection>

          <DataSection title="Transactions">
            {denom && <TokenDetailDatatable denom={`${denom}`} />}
          </DataSection>
        </>
      )}
    </DetailsPageLayout>
  );
};

export default TokenDetails;
