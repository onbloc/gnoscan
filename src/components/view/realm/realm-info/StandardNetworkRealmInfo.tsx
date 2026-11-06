import React from "react";

import {
  useGetRealmEventsByPath,
  useGetRealmDirectTransactionsByPath,
  useGetRealmNativeTransfersByPath,
  useGetRealmTokenTransfersByPath,
  useGetRealmInternalTransactionsByPath,
} from "@/common/react-query/realm/api";
import { useActivityEvents } from "@/common/hooks/common/use-activity-events";
import { useFunctionFilteredPagedList } from "@/common/hooks/common/use-function-filtered-paged-list";
import { usePagedList } from "@/common/hooks/common/use-paged-list";

import DataListSection from "../../details-data-section/data-list-section";
import { ListPagination } from "../../common/list-pagination/ListPagination";
import { FunctionFilter } from "../../common/function-filter/FunctionFilter";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";
import { StandardNetworkEventDatatable } from "../../datatable/event/StandardNetworkEventDatatable";
import { ActivityEventsFilterBar } from "../../datatable/event/ActivityEventsFilterBar";
import { ActivityDatatable } from "../../datatable/activity";
import { REALM_DETAIL_TABS, ACTIVITY_TAB } from "@/common/values/activity-tab.constant";

interface RealmInfoProps {
  path: string;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const StandardNetworkRealmInfo = ({ path, currentTab, setCurrentTab }: RealmInfoProps) => {
  const direct = useFunctionFilteredPagedList("realm-direct", path, useGetRealmDirectTransactionsByPath, {
    path,
  });
  const native = usePagedList("realm-native", path, useGetRealmNativeTransfersByPath, { path });
  const token = usePagedList("realm-token", path, useGetRealmTokenTransfersByPath, { path });
  const internal = usePagedList("realm-internal", path, useGetRealmInternalTransactionsByPath, { path });

  const events = useActivityEvents("realm", path, useGetRealmEventsByPath);

  const detailTabs = React.useMemo(
    () => [
      { tabName: REALM_DETAIL_TABS[0], size: direct.pagination.totalCount },
      { tabName: REALM_DETAIL_TABS[1], size: native.pagination.totalCount },
      { tabName: REALM_DETAIL_TABS[2], size: token.pagination.totalCount },
      { tabName: REALM_DETAIL_TABS[3], size: internal.pagination.totalCount },
      { tabName: REALM_DETAIL_TABS[4], size: events.allCount },
    ],
    [
      direct.pagination.totalCount,
      native.pagination.totalCount,
      token.pagination.totalCount,
      internal.pagination.totalCount,
      events.allCount,
    ],
  );

  if (!direct.isFetched) return <TableSkeleton />;

  return (
    <DataListSection
      tabs={detailTabs}
      tabActions={
        currentTab === ACTIVITY_TAB.TRANSACTIONS && (
          <FunctionFilter filter={direct.filter} onChange={direct.setFilter} />
        )
      }
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
    >
      {currentTab === ACTIVITY_TAB.TRANSACTIONS && (
        <ActivityDatatable
          variant="direct"
          data={direct.items}
          isFetched={direct.isFetched}
          footer={<ListPagination {...direct.pagination} />}
        />
      )}
      {currentTab === ACTIVITY_TAB.NATIVE_TRANSFERS && (
        <ActivityDatatable
          variant="transfers"
          data={native.items}
          isFetched={native.isFetched}
          footer={<ListPagination {...native.pagination} />}
        />
      )}
      {currentTab === ACTIVITY_TAB.TOKEN_TRANSFERS && (
        <ActivityDatatable
          variant="transfers"
          data={token.items}
          isFetched={token.isFetched}
          footer={<ListPagination {...token.pagination} />}
        />
      )}
      {currentTab === ACTIVITY_TAB.INTERNAL_TRANSACTIONS && (
        <ActivityDatatable
          variant="internal"
          data={internal.items}
          isFetched={internal.isFetched}
          footer={<ListPagination {...internal.pagination} />}
        />
      )}
      {currentTab === ACTIVITY_TAB.EVENTS && (
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
    </DataListSection>
  );
};

export default StandardNetworkRealmInfo;
