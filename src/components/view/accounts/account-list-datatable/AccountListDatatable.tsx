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
import { toGNOTAmount } from "@/common/utils/native-token-utility";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { ACCOUNTS_LIST_PAGE_SIZE, MAX_ACCOUNTS_LIST_SIZE } from "@/common/values/query.constant";
import { AccountListItem } from "@/types/data-type";
import { Pagination } from "@/components/ui/pagination";
import { getAddressNameTag } from "@/common/utils/address-label.utility";

interface AccountListDatatableProps {
  isCustomNetwork: boolean;
}

export const AccountListDatatable = ({ isCustomNetwork }: AccountListDatatableProps) => {
  const themeMode = useRecoilValue(themeState);
  const [page, setPage] = React.useState(1);

  const { data, isFetched, isPreviousData } = useGetAccounts(
    { denom: "ugnot", page, limit: ACCOUNTS_LIST_PAGE_SIZE },
    { enabled: !isCustomNetwork },
  );

  // Page of the rows currently shown (lags behind `page` while the next page loads)
  const [dataPage, setDataPage] = React.useState(page);
  if (data && !isPreviousData && dataPage !== page) setDataPage(page);

  // Cap at top MAX_ACCOUNTS_LIST_SIZE accounts
  const totalCount = Math.min(data?.page.totalCount ?? 0, MAX_ACCOUNTS_LIST_SIZE);
  const totalPages = Math.max(1, Math.ceil(totalCount / ACCOUNTS_LIST_PAGE_SIZE));

  const accounts: AccountListItem[] = React.useMemo(() => {
    if (!data?.items) return [];

    return data.items.map((item: AccountListItemModel, index: number): AccountListItem => {
      return {
        rank: (dataPage - 1) * ACCOUNTS_LIST_PAGE_SIZE + index + 1,
        address: item.address,
        nameTag: getAddressNameTag(item),
        label: item.label,
        labelType: item.labelType,
        balance: toGNOTAmount(item.balance, GNOTToken.denom),
        percentage: item.percentage,
        txCount: item.txCount,
      };
    });
  }, [data?.items, dataPage]);

  const handleChangePage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  if (isCustomNetwork) {
    return <Datatable headers={createHeaders().map(item => ({ ...item, themeMode }))} datas={[]} supported={false} />;
  }

  // Show skeleton only on initial load; keep previous rows while paging
  if (!isFetched && !isPreviousData) return <TableSkeleton />;

  return (
    <Container>
      <Datatable headers={createHeaders().map(item => ({ ...item, themeMode }))} datas={accounts} />
      <Pagination
        page={page}
        totalPages={totalPages}
        hasNext={data?.page.hasNext}
        hideFirstPageButtonWhenDisabled
        hideLastPageButtonWhenCurrent
        onChangePage={handleChangePage}
      />
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
    .renderOption((_, data) => (
      <DatatableItem.AddressCopy address={data.address} label={data.label} labelType={data.labelType} />
    ))
    .build();
};

const createHeaderNameTag = () => {
  return DatatableOption.Builder.builder<AccountListItem>()
    .key("nameTag")
    .name("Name Tag")
    .width(270)
    .renderOption(nameTag => <span>{nameTag || "-"}</span>)
    .build();
};

const createHeaderBalance = () => {
  return DatatableOption.Builder.builder<AccountListItem>()
    .key("balance")
    .name("Balance")
    .width(220)
    .renderOption(balance => <DatatableItem.StandardNetworkAmount data={balance} />)
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
  overflow: hidden;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.base};

  & > div:first-child {
    padding: 24px 24px 0;

    .scroll-wrapper > div:first-child > div {
      padding-top: 12px;
      padding-bottom: 12px;
      line-height: 16px;
    }
  }
`;
