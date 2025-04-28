import React from "react";

import { GnoEvent } from "@/types/data-type";

import DataListSection from "../../details-data-section/data-list-section";
import { BlockDetailDatatable } from "../../datatable";
import { EventDatatable } from "../../datatable/event";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";

interface BlockInfoProps {
  blockHeight: number;
  currentTab: string;
  events: GnoEvent[];
  isFetched: boolean;
  setCurrentTab: (tab: string) => void;
}

const BlockInfo = ({ blockHeight, currentTab, setCurrentTab, events, isFetched }: BlockInfoProps) => {
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
  }, [events]);

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Transactions" && <BlockDetailDatatable height={`${blockHeight}`} />}
      {currentTab === "Events" && <EventDatatable isFetched={isFetched} events={events} />}
    </DataListSection>
  );
};

export default BlockInfo;
