import React from "react";

import { useMappedApiBlockEvents } from "@/common/services/block/use-mapped-api-block-events";

import DataListSection from "../../details-data-section/data-list-section";
import { BlockDetailDatatable } from "../../datatable";
import { EventDatatable } from "../../datatable/event";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";

interface BlockInfoProps {
  blockHeight: number;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const StandardNetworkBlockInfo = ({ blockHeight, currentTab, setCurrentTab }: BlockInfoProps) => {
  const { data: events, isFetched: isFetchedEvents } = useMappedApiBlockEvents(String(blockHeight));
  const detailTabs = React.useMemo(() => {
    return [
      {
        tabName: "Transactions",
      },
      {
        tabName: "Events",
        size: events.length,
      },
    ];
  }, []);

  if (!isFetchedEvents) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Transactions" && <BlockDetailDatatable height={`${blockHeight}`} />}
      {currentTab === "Events" && <EventDatatable isFetched={isFetchedEvents} events={events} />}
    </DataListSection>
  );
};

export default StandardNetworkBlockInfo;
