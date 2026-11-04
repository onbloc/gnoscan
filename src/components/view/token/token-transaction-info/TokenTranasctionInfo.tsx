import React from "react";
import Link from "next/link";

import DataListSection from "../../details-data-section/data-list-section";
import { TokenDetailDatatable } from "../../datatable";
import { TokenHoldersDatatablePage } from "../../datatable/token-detail/token-holders-page";
import { ActivityDatatable } from "../../datatable/activity";
import { StandardNetworkEventDatatable } from "../../datatable/event/StandardNetworkEventDatatable";
import { ActivityEventsFilterBar } from "../../datatable/event/ActivityEventsFilterBar";
import { ListPagination } from "../../common/list-pagination/ListPagination";
import {
  useGetTokenHoldersByid,
  useGetTokenMetaByPath,
  useGetTokenMetaTransactionsById,
  useGetTokenMetaInternalTransactionsById,
  useGetTokenTransfersById,
  useGetTokenEventsById,
  useGetTokens,
} from "@/common/react-query/token/api";
import { useGetRealmNativeTransfersByPath } from "@/common/react-query/realm/api";
import { useNetwork } from "@/common/hooks/use-network";
import { useActivityEvents } from "@/common/hooks/common/use-activity-events";
import { usePagedList } from "@/common/hooks/common/use-paged-list";
import { TOKEN_DETAIL_TABS, ACTIVITY_TAB } from "@/common/values/activity-tab.constant";
import Text from "@/components/ui/text";
import styled from "styled-components";

interface TokenTransactionInfoProps {
  tokenPath: string;
  isCustomNetwork: boolean;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const TokenTransactionInfo = ({ tokenPath, isCustomNetwork, currentTab, setCurrentTab }: TokenTransactionInfoProps) => {
  const { getUrlWithNetwork } = useNetwork();
  const { data: tokenMeta, isFetched: isFetchedTokenMeta } = useGetTokenMetaByPath(tokenPath);
  const realmPath = tokenMeta?.data?.path ?? "";
  const hostedTokenCount = tokenMeta?.data?.hostedTokenCount ?? 0;
  const isFactoryRealm = hostedTokenCount >= 2;
  // Token meta settled without a realm path (404 or error): the native query never runs, so show it as empty.
  const isNativeUnavailable = isFetchedTokenMeta && !realmPath;

  const enabled = !isCustomNetwork && !!tokenPath;
  const direct = usePagedList(
    "token-direct",
    tokenPath,
    useGetTokenMetaTransactionsById,
    { path: tokenPath },
    { enabled },
  );
  const native = usePagedList(
    "token-native",
    realmPath,
    useGetRealmNativeTransfersByPath,
    { path: realmPath },
    { enabled: !isCustomNetwork && !!realmPath },
  );
  const transfers = usePagedList(
    "token-transfers",
    tokenPath,
    useGetTokenTransfersById,
    { path: tokenPath },
    { enabled },
  );
  const internal = usePagedList(
    "token-internal",
    tokenPath,
    useGetTokenMetaInternalTransactionsById,
    { path: tokenPath },
    { enabled },
  );
  const { data: holdersData } = useGetTokenHoldersByid(
    { path: tokenPath, page: 1 },
    { enabled: !isCustomNetwork && !!tokenPath },
  );
  // Hosted tokens are paged per realm; a different realm starts again from page 1.
  const hosted = usePagedList(
    "hosted-tokens",
    realmPath,
    useGetTokens,
    { packagePath: realmPath },
    {
      enabled: !isCustomNetwork && isFactoryRealm && !!realmPath && currentTab === ACTIVITY_TAB.NATIVE_TRANSFERS,
    },
  );

  const events = useActivityEvents("token", tokenPath, useGetTokenEventsById, {
    enabled: !isCustomNetwork && !!tokenPath,
  });

  // Guard against an API without the packagePath filter, which returns the global token list.
  const hostedTokens = React.useMemo(
    () => hosted.items.filter(token => token.path === realmPath),
    [hosted.items, realmPath],
  );

  const transactionsCount = direct.pagination.totalCount;
  const holdersCount = holdersData?.page.totalCount;

  const detailTabs = React.useMemo(() => {
    if (isCustomNetwork) {
      return [{ tabName: TOKEN_DETAIL_TABS[0], size: transactionsCount }];
    }

    return [
      { tabName: TOKEN_DETAIL_TABS[0], size: direct.pagination.totalCount },
      { tabName: TOKEN_DETAIL_TABS[1], size: isNativeUnavailable ? 0 : native.pagination.totalCount },
      { tabName: TOKEN_DETAIL_TABS[2], size: transfers.pagination.totalCount },
      { tabName: TOKEN_DETAIL_TABS[3], size: internal.pagination.totalCount },
      { tabName: TOKEN_DETAIL_TABS[4], size: events.allCount },
      { tabName: TOKEN_DETAIL_TABS[5], size: holdersCount },
    ];
  }, [
    isCustomNetwork,
    transactionsCount,
    direct.pagination.totalCount,
    isNativeUnavailable,
    native.pagination.totalCount,
    transfers.pagination.totalCount,
    internal.pagination.totalCount,
    events.allCount,
    holdersCount,
  ]);

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {tokenPath && isCustomNetwork && currentTab === ACTIVITY_TAB.TRANSACTIONS && (
        <TokenDetailDatatable path={tokenPath} />
      )}
      {tokenPath && !isCustomNetwork && currentTab === ACTIVITY_TAB.TRANSACTIONS && (
        <ActivityDatatable
          variant="direct"
          data={direct.items}
          isFetched={direct.isFetched}
          footer={<ListPagination {...direct.pagination} />}
        />
      )}
      {tokenPath && !isCustomNetwork && currentTab === ACTIVITY_TAB.NATIVE_TRANSFERS && (
        <>
          {isFactoryRealm && (
            <FactoryNotice>
              <FactorySummary>
                <Text type="p4" color="tertiary">{`This factory token hosts ${hostedTokenCount} tokens:`}</Text>
                {hostedTokens.length > 0 && (
                  <HostedTokenList aria-label="Hosted tokens">
                    {hostedTokens.map(token => {
                      const tokenKey = token.path && token.symbol ? `${token.path}.${token.symbol}` : token.path;

                      return (
                        <Link key={token.tokenId} href={getUrlWithNetwork(`/tokens/${tokenKey}`)}>
                          {token.symbol}
                        </Link>
                      );
                    })}
                  </HostedTokenList>
                )}
              </FactorySummary>
              <ListPagination {...hosted.pagination} />
            </FactoryNotice>
          )}
          <ActivityDatatable
            variant="transfers"
            data={native.items}
            isFetched={native.isFetched || isNativeUnavailable}
            footer={<ListPagination {...native.pagination} />}
          />
        </>
      )}
      {tokenPath && !isCustomNetwork && currentTab === ACTIVITY_TAB.TOKEN_TRANSFERS && (
        <ActivityDatatable
          variant="token-volume"
          data={transfers.items}
          isFetched={transfers.isFetched}
          footer={<ListPagination {...transfers.pagination} />}
        />
      )}
      {tokenPath && !isCustomNetwork && currentTab === ACTIVITY_TAB.INTERNAL_TRANSACTIONS && (
        <ActivityDatatable
          variant="internal"
          data={internal.items}
          isFetched={internal.isFetched}
          footer={<ListPagination {...internal.pagination} />}
        />
      )}
      {tokenPath && !isCustomNetwork && currentTab === ACTIVITY_TAB.EVENTS && (
        <>
          <ActivityEventsFilterBar {...events.filterBar} />
          <StandardNetworkEventDatatable
            variant="activity"
            isFetched={events.isFetched}
            events={events.events}
            footer={<ListPagination {...events.pagination} />}
          />
        </>
      )}
      {tokenPath && !isCustomNetwork && currentTab === ACTIVITY_TAB.HOLDERS && (
        <TokenHoldersDatatablePage path={tokenPath} />
      )}
    </DataListSection>
  );
};

export default TokenTransactionInfo;

const FactoryNotice = styled.div`
  & {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    margin-bottom: 12px;
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
  }
`;

const HostedTokenList = styled.div`
  ${({ theme }) => theme.fonts.p4};
  display: flex;
  flex-wrap: wrap;
  min-width: 0;

  a {
    ${({ theme }) => theme.fonts.p4};
    color: ${({ theme }) => theme.colors.blue};
    overflow-wrap: anywhere;

    &:not(:last-child)::after {
      color: ${({ theme }) => theme.colors.tertiary};
      content: ",";
      margin-right: 4px;
    }
  }
`;

const FactorySummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 4px;
  min-width: 0;
`;
