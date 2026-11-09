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
  // The parent keys this by the day, so the rows of another day never sit under this date while it loads.
  const list = usePagedList("account-balance-day", `${address}:${date}`, useGetAccountNativeBalanceChanges, {
    address,
    from: date,
    to: date,
  });

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
