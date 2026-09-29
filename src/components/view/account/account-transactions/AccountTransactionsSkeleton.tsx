import React from "react";
import styled from "styled-components";

import { Transaction } from "@/types/data-type";
import { ACCOUNT_DETAIL_TABS, ActivityTabName } from "@/common/values/activity-tab.constant";

import Datatable, { DatatableOption } from "@/components/ui/datatable";
import DataListSection from "../../details-data-section/data-list-section";

const HEADERS = [DatatableOption.Builder.builder<Transaction>().key("hash").name("Tx Hash").width(215).build()];

interface Props {
  tabNames?: ActivityTabName[];
}

// Loading frame of the transactions panel (tabs, table header, table loading area) without its queries.
const AccountTransactionsSkeleton = ({ tabNames = ACCOUNT_DETAIL_TABS }: Props) => {
  return (
    <DataListSection
      tabs={tabNames.map(tabName => ({ tabName }))}
      currentTab={tabNames[0]}
      setCurrentTab={() => undefined}
    >
      <TableWrapper>
        <Datatable headers={HEADERS} datas={null} loading />
      </TableWrapper>
    </DataListSection>
  );
};

// Matches the padding reset of the account transaction datatables.
const TableWrapper = styled.div`
  width: 100%;

  & > div {
    padding: 0;
  }
`;

export default AccountTransactionsSkeleton;
