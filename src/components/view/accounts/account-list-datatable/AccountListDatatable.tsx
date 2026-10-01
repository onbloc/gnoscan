"use client";

import React from "react";
import BigNumber from "bignumber.js";
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

const MAX_PAGE = Math.ceil(MAX_ACCOUNTS_LIST_SIZE / ACCOUNTS_LIST_PAGE_SIZE);

interface AccountListDatatableProps {
  isCustomNetwork: boolean;
}

export const AccountListDatatable = ({ isCustomNetwork }: AccountListDatatableProps) => {
  const themeMode = useRecoilValue(themeState);
  const [page, setPage] = React.useState(1);
  const [cursors, setCursors] = React.useState<string[]>([""]);
  const cursor = cursors[page - 1] ?? "";

  const { data, isFetched } = useGetAccounts(
    { denom: "ugnot", cursor, limit: ACCOUNTS_LIST_PAGE_SIZE },
    { enabled: !isCustomNetwork },
  );

  const accounts: AccountListItem[] = React.useMemo(() => {
    if (!data?.items) return [];

    return data.items.map((item: AccountListItemModel, index: number): AccountListItem => {
      return {
        rank: (page - 1) * ACCOUNTS_LIST_PAGE_SIZE + index + 1,
        address: item.address,
        nameTag: item.nameTag,
        label: item.label,
        labelType: item.labelType,
        balance: toGNOTAmount(item.balance, GNOTToken.denom),
        percentage: item.percentage,
        txCount: item.txCount,
      };
    });
  }, [data?.items, page]);

  const handleChangePage = (nextPage: number) => {
    if (nextPage === 1 || nextPage < page) {
      setPage(Math.max(1, nextPage));
      return;
    }

    if (nextPage !== page + 1 || !data?.page.hasNext || !data.page.cursor) return;

    setCursors(current => {
      const next = [...current];
      next[page] = data.page.cursor || "";
      return next;
    });
    setPage(nextPage);
  };

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
      <Pagination
        page={page}
        totalPages={MAX_PAGE}
        hasNext={data?.page.hasNext}
        allowLastPage={false}
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
      <DatatableItem.CallerCopy caller={data.address} label={data.label} labelType={data.labelType} />
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
    .renderOption((balance: { value: string; denom: string }) => {
      const amount = new BigNumber(balance?.value);
      if (!amount.isFinite() || amount.isZero()) return <span>-</span>;

      return <DatatableItem.Amount value={balance.value} denom={balance.denom} />;
    })
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
  }
`;
