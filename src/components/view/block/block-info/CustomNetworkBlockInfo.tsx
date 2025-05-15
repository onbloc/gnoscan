import React from "react";

import { useBlock } from "@/common/hooks/blocks/use-block";

import DataListSection from "../../details-data-section/data-list-section";
import { BlockDetailDatatable } from "../../datatable";
import { EventDatatable } from "../../datatable/event";
import TableSkeleton from "../../common/table-skeleton/TableSkeleton";

interface BlockInfoProps {
  blockHeight: number;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const CustomNetworkBlockInfo = ({ blockHeight, currentTab, setCurrentTab }: BlockInfoProps) => {
  const { events, transactionItems, isFetched, isFetchedBlockResult } = useBlock(blockHeight);

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

  if (!isFetched) return <TableSkeleton />;

  return (
    <DataListSection tabs={detailTabs} currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {currentTab === "Transactions" && (
        <BlockDetailDatatable
          transactions={transactionItems}
          isFetched={isFetched && isFetchedBlockResult}
          nextPage={() => {}}
        />
      )}
      {currentTab === "Events" && <EventDatatable isFetched={isFetched} events={events} />}
    </DataListSection>
  );
};

export default CustomNetworkBlockInfo;
