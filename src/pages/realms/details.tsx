import React from 'react';
import {useQuery, UseQueryResult} from 'react-query';
import {useRouter} from 'next/router';
import {isDesktop} from '@/common/hooks/use-media';
import {DetailsPageLayout} from '@/components/core/layout';
import Badge from '@/components/ui/badge';
import {DLWrap, FitContentA} from '@/components/ui/detail-page-common-styles';
import DataSection from '@/components/view/details-data-section';
import axios from 'axios';
import Text from '@/components/ui/text';
import Link from 'next/link';
import {AmountText} from '@/components/ui/text/amount-text';
import ShowLog from '@/components/ui/show-log';
import {LogDataType} from '@/components/view/tabs/tabs';
import {v1} from 'uuid';
import {RealmDetailDatatable} from '@/components/view/datatable';
import useLoading from '@/common/hooks/use-loading';
import {API_URI} from '@/common/values/constant-value';

type RealmResultType = {
  name: string;
  funcs: string[];
  publisher: string;
  address: string;
  blockPublished: number;
  path: string;
  ContractCalls: number;
  gasUsed: string;
  log: LogDataType;
};

const RealmsDetails = () => {
  const {loading} = useLoading();
  const desktop = isDesktop();
  const router = useRouter();
  const {path} = router.query;
  const {
    data: realm,
    isSuccess: realmSuccess,
    isFetched,
  }: UseQueryResult<RealmResultType> = useQuery(
    ['realm/path', path],
    async ({queryKey}) => await axios.get(API_URI + `/latest/realm/summary/${queryKey[1]}`),
    {
      enabled: !!path,
      select: (res: any) => {
        const realmData = res.data;
        return {
          name: realmData.name,
          funcs: realmData.function_types,
          publisher: Boolean(realmData.username) ? realmData.username : realmData.publisher,
          address: realmData.address,
          blockPublished: realmData.block_published,
          path: realmData.path,
          ContractCalls: realmData.contract_calls,
          gasUsed: realmData.gas_used,
          log: {
            list: realmData.extra.files,
            content: realmData.extra.contents,
          },
        };
      },
      // onSuccess: (res: any) => console.log('Realms Data : ', res),
    },
  );

  return (
    <DetailsPageLayout title={'Realm Details'} isFetched={isFetched}>
      {realmSuccess && (
        <>
          <DataSection title="Summary">
            <DLWrap desktop={desktop}>
              <dt>Name</dt>
              <dd>
                <Badge>{realm.name}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Function Type(s)</dt>
              <dd>
                {realm.funcs.map((v: string) => (
                  <Badge type="blue" key={v1()}>
                    <Text type="p4" color="white">
                      {v}
                    </Text>
                  </Badge>
                ))}
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Publisher</dt>
              <dd>
                <Badge>
                  <Link href={`/accounts/${realm.address}`} passHref>
                    <FitContentA>
                      <Text type="p4" color="blue" className="ellipsis">
                        {realm.publisher}
                      </Text>
                    </FitContentA>
                  </Link>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Block Published</dt>
              <dd>
                <Badge>
                  <Link href={`/blocks/${realm.blockPublished}`} passHref>
                    <FitContentA>
                      <Text type="p4" color="blue">
                        {realm.blockPublished}
                      </Text>
                    </FitContentA>
                  </Link>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Path</dt>
              <dd>
                <Badge>{realm.path}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Contract Calls</dt>
              <dd>
                <Badge>{realm.ContractCalls}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Gas Used</dt>
              <dd>
                <Badge>
                  <AmountText minSize="body1" maxSize="p4" value={realm.gasUsed} denom="GNOT" />
                </Badge>
              </dd>
            </DLWrap>
            {realm.log && <ShowLog isTabLog={true} tabData={realm.log} btnTextType="Contract" />}
          </DataSection>

          <DataSection title="Transactions">
            {path && <RealmDetailDatatable pkgPath={`${path}`} />}
          </DataSection>
        </>
      )}
    </DetailsPageLayout>
  );
};

export default RealmsDetails;
