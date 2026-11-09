import React from "react";

import { usePagedList } from "@/common/hooks/common/use-paged-list";
import { useGetAccountNativeBalanceChanges } from "@/common/react-query/account/api/use-get-account-native-balance-changes";
import { CHART_FULL_DATE_FORMAT, formatChartDate } from "@/components/ui/chart/chart-common";
import Text from "@/components/ui/text";
import { ListPagination } from "../../common/list-pagination/ListPagination";
import { AccountBalanceChangeDatatable } from "../../datatable/account-balance-change";
import * as S from "./AccountBalanceChart.styles";

interface AccountBalanceDayTransactionsProps {
  address: string;
  // UTC day, YYYY-MM-DD
  date: string;
}

/** The transactions that changed the balance on one UTC day. */
export const AccountBalanceDayTransactions = ({ address, date }: AccountBalanceDayTransactionsProps) => {
  // The rows of another day are not kept on screen while this one loads, as they would sit under the wrong date.
  const list = usePagedList(
    "account-balance-day",
    `${address}:${date}`,
    useGetAccountNativeBalanceChanges,
    { address, from: date, to: date },
    { keepPreviousData: false },
  );

  return (
    <S.TransactionSection>
      <Text type="h7" color="primary">
        {`${formatChartDate(date, CHART_FULL_DATE_FORMAT)} Transactions`}
      </Text>
      <AccountBalanceChangeDatatable
        data={list.items}
        isFetched={list.isFetched}
        footer={<ListPagination {...list.pagination} />}
      />
    </S.TransactionSection>
  );
};
