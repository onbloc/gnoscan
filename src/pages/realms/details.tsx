import React, {useCallback, useMemo, useState} from 'react';
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
import Tooltip from '@/components/ui/tooltip';
import IconTooltip from '@/assets/svgs/icon-tooltip.svg';
import IconCopy from '@/assets/svgs/icon-copy.svg';
import {useNetwork} from '@/common/hooks/use-network';
import {
  GNOSTUDIO_REALM_FUNCTION_TEMPLATE,
  GNOSTUDIO_REALM_TEMPLATE,
} from '@/common/values/url.constant';
import {makeTemplate} from '@/common/utils/template.utils';
import IconLink from '@/assets/svgs/icon-link.svg';
import {useRealm} from '@/common/hooks/realms/use-realm';
import {GNOTToken, useTokenMeta} from '@/common/hooks/common/use-token-meta';
import {EventDatatable} from '@/components/view/datatable/event';
import DataListSection from '@/components/view/details-data-section/data-list-section';
import {useUsername} from '@/common/hooks/account/use-username';
import {useGetRealmTransactionsQuery} from '@/common/react-query/realm';
import {SkeletonBar} from '@/components/ui/loading/skeleton-bar';
import BigNumber from 'bignumber.js';

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
  const {isFetched: isFetchedUsername, getName} = useUsername();
  const {currentNetwork, getUrlWithNetwork} = useNetwork();
  const {summary, transactionEvents, isFetched: isFetchedRealm} = useRealm(path);
  const {getTokenAmount} = useTokenMeta();
  const [currentTab, setCurrentTab] = useState('Transactions');

  const isFetched = useMemo(() => {
    return isFetchedRealm && isFetchedUsername;
  }, [isFetchedRealm, isFetchedUsername]);

  const detailTabs = useMemo(() => {
    return [
      {
        tabName: 'Transactions',
      },
      {
        tabName: 'Events',
        size: transactionEvents.length,
      },
    ];
  }, [transactionEvents]);

  const balanceStr = useMemo(() => {
    if (!summary?.balance) {
      return '-';
    }
    const amount = getTokenAmount(GNOTToken.denom, summary.balance.value);
    return `${amount.value} ${amount.denom}`;
  }, [getTokenAmount, summary?.balance]);

  const moveGnoStudioViewRealm = useCallback(() => {
    if (!currentNetwork) {
      return;
    }

    const url = makeTemplate(GNOSTUDIO_REALM_TEMPLATE, {
      PACKAGE_PATH: path,
      NETWORK: currentNetwork?.chainId || '',
    });
    window.open(url, '_blank');
  }, [path, currentNetwork]);

  const moveGnoStudioViewRealmFunction = useCallback(
    (functionName: string) => {
      if (!currentNetwork) {
        return;
      }

      const url = makeTemplate(GNOSTUDIO_REALM_FUNCTION_TEMPLATE, {
        PACKAGE_PATH: path,
        NETWORK: currentNetwork?.chainId || '',
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
                    <Link
                      href={getUrlWithNetwork(`/accounts/${summary?.publisherAddress}`)}
                      passHref>
                      <FitContentA>
                        <Text type="p4" color="blue" className="ellipsis">
                          {getName(summary?.publisherAddress || '') || summary?.publisherAddress}
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
                    <Link href={getUrlWithNetwork(`/blocks/${summary?.blockPublished}`)} passHref>
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
                <Badge>{balanceStr}</Badge>
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Contract Calls</dt>
              <dd>
                <LazyTotalContractCalls packagePath={path} />
              </dd>
            </DLWrap>
            <DLWrap desktop={desktop}>
              <dt>Total Used Fees</dt>
              <dd>
                <LazyTotalUsedFeeAmount packagePath={path} />
              </dd>
            </DLWrap>
            {summary?.files && (
              <ShowLog isTabLog={true} files={summary?.files} btnTextType="Contract" />
            )}
          </DataSection>

          <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
            {currentTab === 'Transactions' && <RealmDetailDatatable pkgPath={`${path}`} />}
            {currentTab === 'Events' && (
              <EventDatatable isFetched={isFetched} events={transactionEvents} />
            )}
          </DataListSection>
        </>
      )}
    </DetailsPageLayout>
  );
};

const LazyTotalContractCalls: React.FC<{packagePath: string}> = ({packagePath}) => {
  const {data: realmTransactions, isFetched: isFetchedRealmTransactions} =
    useGetRealmTransactionsQuery(packagePath);

  const totalContractCalls = useMemo(() => {
    if (!realmTransactions || !isFetchedRealmTransactions) {
      return null;
    }

    if (!realmTransactions) {
      return '0';
    }

    const totalCount = realmTransactions.filter(tx => tx.type === '/vm.m_call').length;

    return BigNumber(totalCount).toFormat();
  }, [realmTransactions]);

  if (!totalContractCalls) {
    return <SkeletonBar />;
  }

  return <Badge>{totalContractCalls}</Badge>;
};

const LazyTotalUsedFeeAmount: React.FC<{packagePath: string}> = ({packagePath}) => {
  const {data: realmTransactions, isFetched: isFetchedRealmTransactions} =
    useGetRealmTransactionsQuery(packagePath);
  const {getTokenAmount} = useTokenMeta();

  const totalUsedFee = useMemo(() => {
    if (!isFetchedRealmTransactions) {
      return null;
    }

    if (!realmTransactions) {
      return {
        value: 0,
        denom: GNOTToken.denom,
      };
    }

    const totalUsedFeeAmount = realmTransactions
      .filter(tx => tx.type === '/vm.m_call')
      .map(tx => Number(tx.fee?.value || 0))
      .reduce((accum, current) => accum + current, 0);

    return {
      value: totalUsedFeeAmount,
      denom: GNOTToken.denom,
    };
  }, [realmTransactions]);

  if (!totalUsedFee) {
    return <SkeletonBar />;
  }

  return (
    <Badge>
      <AmountText
        minSize="body1"
        maxSize="p4"
        {...getTokenAmount(totalUsedFee.denom, totalUsedFee.value)}
      />
    </Badge>
  );
};

export async function getServerSideProps({query}: any) {
  const keyword = query?.path;
  return {
    props: {
      path: keyword,
      redirectUrl: null,
    },
  };
}

export default RealmsDetails;
