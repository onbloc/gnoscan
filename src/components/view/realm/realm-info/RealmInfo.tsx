import React from "react";

import { GnoEvent } from "@/types/data-type";

import DataListSection from "../../details-data-section/data-list-section";
import { RealmDetailDatatable } from "../../datatable";
import { EventDatatable } from "../../datatable/event";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";

interface RealmInfoProps {
  path: string;
  currentTab: string;
  transactionEvents: GnoEvent[];
  isFetched: boolean;
  setCurrentTab: (tab: string) => void;
}

const RealmInfo = ({ path, currentTab, setCurrentTab, isFetched, transactionEvents }: RealmInfoProps) => {
  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: "Transactions",
      },
      {
        tabName: "Events",
        size: transactionEvents.length,
      },
    ];
  }, [transactionEvents]);

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Transactions" && <RealmDetailDatatable pkgPath={`${path}`} />}
      {currentTab === "Events" && <EventDatatable isFetched={isFetched} events={transactionEvents} />}
    </DataListSection>
  );
};

export default RealmInfo;
