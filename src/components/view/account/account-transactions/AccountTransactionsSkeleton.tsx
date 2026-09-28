import React from "react";
import styled from "styled-components";

import { Transaction } from "@/types/data-type";

import Datatable, { DatatableOption } from "@/components/ui/datatable";
import DataListSection from "../../details-data-section/data-list-section";

const TABS = [{ tabName: "Transactions" }, { tabName: "Events" }];
const HEADERS = [DatatableOption.Builder.builder<Transaction>().key("hash").name("Tx Hash").width(215).build()];

// Loading frame of the transactions panel (tabs, table header, table loading area) without its queries.
const AccountTransactionsSkeleton = () => {
  return (
    <DataListSection tabs={TABS} currentTab="Transactions" setCurrentTab={() => undefined}>
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
