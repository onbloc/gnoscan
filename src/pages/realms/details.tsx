import React from 'react';
import {useQuery, UseQueryResult} from 'react-query';
import {useRouter} from 'next/router';
import {isDesktop} from '@/common/hooks/use-media';
import {DetailsPageLayout} from '@/components/core/layout';
import Badge from '@/components/ui/badge';
import {DLWrap, FitContentA} from '@/components/ui/detail-page-common-styles';
import DataSection from '@/components/view/details-data-section';
import Text from '@/components/ui/text';
import Link from 'next/link';
import {AmountText} from '@/components/ui/text/amount-text';
import ShowLog from '@/components/ui/show-log';
import {v1} from 'uuid';
import {RealmDetailDatatable} from '@/components/view/datatable';
import {RealmDetailsModel} from '@/models/realm-details-model';
import {getRealmDetails} from '@/repositories/api/fetchers/api-realm-details';
import {realmDetailSelector} from '@/repositories/api/selector/select-realm-details';

const RealmsDetails = () => {
  const desktop = isDesktop();
  const router = useRouter();
  const {path} = router.query;
  const {
    data: realm,
    isSuccess: realmSuccess,
    isFetched,
  }: UseQueryResult<RealmDetailsModel> = useQuery(
    ['realm/path', path],
    async () => await getRealmDetails(path),
    {
      enabled: !!path,
      select: (res: any) => realmDetailSelector(res.data),
    },
  );

  return (
    <DetailsPageLayout
      title={'Realm Details'}
      visible={!isFetched}
      keyword={`${path}`}
      error={!realmSuccess}>
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
              <dd className="function-wrapper">
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
                  {realm.publisher === 'genesis' ? (
                    <FitContentA>
                      <Text type="p4" color="blue" className="ellipsis">
                        {realm.publisher}
                      </Text>
                    </FitContentA>
                  ) : (
                    <Link href={`/accounts/${realm.address}`} passHref>
                      <FitContentA>
                        <Text type="p4" color="blue" className="ellipsis">
                          {realm.publisher}
                        </Text>
                      </FitContentA>
                    </Link>
                  )}
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Block Published</dt>
              <dd>
                <Badge>
                  {realm.blockPublished === 0 ? (
                    <FitContentA>
                      <Text type="p4" color="blue" className="ellipsis">
                        {'-'}
                      </Text>
                    </FitContentA>
                  ) : (
                    <Link href={`/blocks/${realm.blockPublished}`} passHref>
                      <FitContentA>
                        <Text type="p4" color="blue">
                          {realm.blockPublished}
                        </Text>
                      </FitContentA>
                    </Link>
                  )}
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
