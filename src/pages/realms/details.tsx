import React, {useCallback, useEffect} from 'react';
import {useQuery, UseQueryResult} from 'react-query';
import {isDesktop} from '@/common/hooks/use-media';
import {DetailsPageLayout} from '@/components/core/layout';
import Badge from '@/components/ui/badge';
import {DLWrap, FitContentA, LinkWrapper} from '@/components/ui/detail-page-common-styles';
import DataSection from '@/components/view/details-data-section';
import Text from '@/components/ui/text';
import Link from 'next/link';
import {AmountText} from '@/components/ui/text/amount-text';
import ShowLog from '@/components/ui/show-log';
import {RealmDetailDatatable} from '@/components/view/datatable';
import {RealmDetailsModel} from '@/models/realm-details-model';
import {getRealmDetails} from '@/repositories/api/fetchers/api-realm-details';
import {realmDetailSelector} from '@/repositories/api/selector/select-realm-details';
import Tooltip from '@/components/ui/tooltip';
import IconTooltip from '@/assets/svgs/icon-tooltip.svg';
import IconCopy from '@/assets/svgs/icon-copy.svg';
import {searchKeyword} from '@/repositories/api/fetchers/api-search-keyword';
import {useNetwork} from '@/common/hooks/use-network';
import {
  GNOSTUDIO_REALM_FUNCTION_TEMPLATE,
  GNOSTUDIO_REALM_TEMPLATE,
} from '@/common/values/url.constant';
import {makeTemplate} from '@/common/utils/template.utils';
import IconLink from '@/assets/svgs/icon-link.svg';
import {useRealm} from '@/common/hooks/realms/use-realm';
import {makeDisplayTokenAmount} from '@/common/utils/string-util';

const TOOLTIP_PACKAGE_PATH = (
  <>
    A unique identifier that serves as
    <br />a contract address on Gnoland.
  </>
);

const TOOLTIP_BALANCE = (
  <>
    Balances available to be spent
    <br />
    by this realm.
  </>
);

interface RealmsDetailsPageProps {
  path: string;
  redirectUrl: string | null;
}

const RealmsDetails = ({path}: RealmsDetailsPageProps) => {
  const desktop = isDesktop();
  const {currentNetwork} = useNetwork();

  const {summary, isFetched} = useRealm(path);

  const moveGnoStudioViewRealm = useCallback(() => {
    const url = makeTemplate(GNOSTUDIO_REALM_TEMPLATE, {
      PACKAGE_PATH: path,
      NETWORK: currentNetwork,
    });
    window.open(url, '_blank');
  }, [path, currentNetwork]);

  const moveGnoStudioViewRealmFunction = useCallback(
    (functionName: string) => {
      const url = makeTemplate(GNOSTUDIO_REALM_FUNCTION_TEMPLATE, {
        PACKAGE_PATH: path,
        NETWORK: currentNetwork,
        FUNCTION_NAME: functionName,
      });
      window.open(url, '_blank');
    },
    [path, currentNetwork],
  );

  return (
    <DetailsPageLayout
      title={'Realm Details'}
      visible={!isFetched}
      keyword={`${path}`}
      error={!isFetched}>
      {isFetched && (
        <>
          <DataSection title="Summary">
            <DLWrap desktop={desktop}>
              <dt>Name</dt>
              <dd>
                <Badge>{summary?.name}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>
                Path
                <div className="tooltip-wrapper">
                  <Tooltip content={TOOLTIP_PACKAGE_PATH}>
                    <IconTooltip />
                  </Tooltip>
                </div>
              </dt>
              <dd className="path-wrapper">
                <Badge>
                  {summary?.path}
                  <Tooltip
                    className="path-copy-tooltip"
                    content="Copied!"
                    trigger="click"
                    copyText={summary?.path}
                    width={85}>
                    <IconCopy className="svg-icon" />
                  </Tooltip>
                </Badge>

                <LinkWrapper onClick={moveGnoStudioViewRealm}>
                  <Text type="p4" className="ellipsis">
                    Try in GnoStudio
                  </Text>
                  <IconLink className="icon-link" />
                </LinkWrapper>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Realm Address</dt>
              <dd>
                <Badge>
                  {summary?.realmAddress || ''}
                  <Tooltip
                    className="path-copy-tooltip"
                    content="Copied!"
                    trigger="click"
                    copyText={summary?.realmAddress || ''}
                    width={85}>
                    <IconCopy className="svg-icon" />
                  </Tooltip>
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Function Type(s)</dt>
              <dd className="function-wrapper">
                {summary?.funcs?.map((v: string, index: number) => (
                  <Badge
                    className="link"
                    key={index}
                    type="blue"
                    onClick={() => moveGnoStudioViewRealmFunction(v)}>
                    <Tooltip className="tooltip" content="Click to try in GnoStudio">
                      <Text type="p4" color="white">
                        {v}
                      </Text>
                    </Tooltip>
                  </Badge>
                ))}
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Publisher</dt>
              <dd>
                <Badge>
                  {summary?.publisherAddress === 'genesis' ? (
                    <FitContentA>
                      <Text type="p4" color="blue" className="ellipsis">
                        {summary?.publisherAddress}
                      </Text>
                    </FitContentA>
                  ) : (
                    <Link href={`/accounts/${summary?.publisherAddress}`} passHref>
                      <FitContentA>
                        <Text type="p4" color="blue" className="ellipsis">
                          {summary?.publisherAddress}
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
                  {summary?.blockPublished === 0 ? (
                    <FitContentA>
                      <Text type="p4" color="blue" className="ellipsis">
                        {'-'}
                      </Text>
                    </FitContentA>
                  ) : (
                    <Link href={`/blocks/${summary?.blockPublished}`} passHref>
                      <FitContentA>
                        <Text type="p4" color="blue">
                          {summary?.blockPublished}
                        </Text>
                      </FitContentA>
                    </Link>
                  )}
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>
                Balance
                <div className="tooltip-wrapper">
                  <Tooltip content={TOOLTIP_BALANCE}>
                    <IconTooltip />
                  </Tooltip>
                </div>
              </dt>
              <dd>
                <Badge>
                  {summary?.balance ? `${makeDisplayTokenAmount(summary.balance.value)} GNOT` : '-'}
                </Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Contract Calls</dt>
              <dd>
                <Badge>{summary?.contractCalls || '0'}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Total Used Fees</dt>
              <dd>
                <Badge>
                  <AmountText
                    minSize="body1"
                    maxSize="p4"
                    value={summary?.totalUsedFees?.value || 0}
                    denom={summary?.totalUsedFees?.denom || 'GNOT'}
                  />
                </Badge>
              </dd>
            </DLWrap>
            {summary?.files && (
              <ShowLog isTabLog={true} files={summary?.files} btnTextType="Contract" />
            )}
          </DataSection>

          <DataSection title="Transactions">
            {path && <RealmDetailDatatable pkgPath={`${path}`} />}
          </DataSection>
        </>
      )}
    </DetailsPageLayout>
  );
};

export async function getServerSideProps({query}: any) {
  const keyword = query?.path;
  try {
    const result = await searchKeyword(keyword);
    const data = result.data;
    if (data?.type === 'pkg_path') {
      return {
        props: {
          path: data.value,
          redirectUrl: null,
        },
      };
    }
  } catch {}
  return {
    props: {
      path: keyword,
      redirectUrl: null,
    },
  };
}

export default RealmsDetails;
