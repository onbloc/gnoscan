"use client";

import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "@/components/view/datatable";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";
import { themeState } from "@/states";
import { useGetAccounts } from "@/common/react-query/account/api/use-get-accounts";
import { AccountListItemModel } from "@/models/api/account/account-list-item-model";
import { formatTokenDecimal } from "@/common/utils/token.utility";
import { ACCOUNTS_LIST_PAGE_SIZE, MAX_ACCOUNTS_LIST_SIZE } from "@/common/values/query.constant";
import { AccountListItem } from "@/types/data-type";
import { Pagination } from "@/components/ui/pagination";

const GNOT_DECIMALS = 6;
const GNOT_SYMBOL = "GNOT";
const MAX_PAGE = Math.ceil(MAX_ACCOUNTS_LIST_SIZE / ACCOUNTS_LIST_PAGE_SIZE);

interface AccountListDatatableProps {
  isCustomNetwork: boolean;
}

export const AccountListDatatable = ({ isCustomNetwork }: AccountListDatatableProps) => {
  const themeMode = useRecoilValue(themeState);
  const [page, setPage] = React.useState(1);

  const { data, isFetched } = useGetAccounts({ page, limit: ACCOUNTS_LIST_PAGE_SIZE }, { enabled: !isCustomNetwork });

  const accounts: AccountListItem[] = React.useMemo(() => {
    if (!data?.items) return [];

    return data.items.map((item: AccountListItemModel, index: number): AccountListItem => {
      return {
        rank: (page - 1) * ACCOUNTS_LIST_PAGE_SIZE + index + 1,
        address: item.address,
        nameTag: item.nameTag,
        balance: {
          value: formatTokenDecimal(item.balance, GNOT_DECIMALS),
          denom: GNOT_SYMBOL,
        },
        percentage: item.percentage,
        txCount: item.txCount,
      };
    });
  }, [data?.items, page]);

  // The accounts list is a full rich-list ranking; only the top MAX_ACCOUNTS_LIST_SIZE
  // entries are ever meant to be browsable, so totalPages is capped here regardless of
  // what the backend reports.
  const totalPages = Math.min(data?.page?.totalPages ?? 1, MAX_PAGE);

  React.useEffect(() => {
    setPage(current => Math.max(1, Math.min(current, totalPages)));
  }, [totalPages]);

  if (isCustomNetwork) {
    return <Datatable headers={createHeaders().map(item => ({ ...item, themeMode }))} datas={[]} supported={false} />;
  }

  if (!isFetched) return <TableSkeleton />;

  return (
    <Container>
      <Datatable
        loading={!isFetched}
        headers={createHeaders().map(item => ({ ...item, themeMode }))}
        datas={accounts}
      />
      <Pagination page={page} totalPages={totalPages} onChangePage={setPage} />
    </Container>
  );
};

const createHeaders = () => {
  return [
    createHeaderRank(),
    createHeaderAddress(),
    createHeaderNameTag(),
    createHeaderBalance(),
    createHeaderPercentage(),
    createHeaderTxCount(),
  ];
};

const createHeaderRank = () => {
  return DatatableOption.Builder.builder<AccountListItem>()
    .key("rank")
    .name("#")
    .width(80)
    .renderOption(rank => <span>{rank}</span>)
    .build();
};

const createHeaderAddress = () => {
  return DatatableOption.Builder.builder<AccountListItem>()
    .key("address")
    .name("Address")
    .width(245)
    .colorName("blue")
    .renderOption((_, data) => <DatatableItem.CallerCopy caller={data.address} />)
    .build();
};

const createHeaderNameTag = () => {
  return DatatableOption.Builder.builder<AccountListItem>()
    .key("nameTag")
    .name("Name Tag")
    .width(270)
    .renderOption(nameTag => <span>{nameTag || ""}</span>)
    .build();
};

const createHeaderBalance = () => {
  return DatatableOption.Builder.builder<AccountListItem>()
    .key("balance")
    .name("Balance")
    .width(220)
    .renderOption((balance: { value: string; denom: string }) => (
      <DatatableItem.Amount value={balance.value} denom={balance.denom} />
    ))
    .build();
};

const createHeaderPercentage = () => {
  return DatatableOption.Builder.builder<AccountListItem>()
    .key("percentage")
    .name("Percentage")
    .width(165)
    .renderOption(percentage => <span>{percentage.toFixed(4)}%</span>)
    .build();
};

const createHeaderTxCount = () => {
  return DatatableOption.Builder.builder<AccountListItem>()
    .key("txCount")
    .name("Tx Count")
    .width(166)
    .renderOption(txCount => <span>{txCount.toLocaleString()}</span>)
    .build();
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  align-items: center;

  & > div {
    padding: 0;
  }
`;
