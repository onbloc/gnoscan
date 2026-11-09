import React from "react";
import BigNumber from "bignumber.js";
import dynamic from "next/dynamic";

import { useGetAccountNativeBalanceHistory } from "@/common/react-query/account/api/use-get-account-native-balance-history";
import { CHART_FULL_DATE_FORMAT, formatChartDate } from "@/components/ui/chart/chart-common";
import { Spinner } from "@/components/ui/loading/spinner";
import Text from "@/components/ui/text";
import { AmountText } from "@/components/ui/text/amount-text";
import { UsdValueText } from "@/components/ui/text/usd-value-text";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import { useTokenPrice } from "@/common/hooks/common/use-token-price";
import {
  BALANCE_RANGE,
  BALANCE_RANGES,
  BalanceExtreme,
  BalanceRangeSelection,
  findBalanceExtremes,
  isCustomRange,
  makeBalanceHistoryRequest,
  toBalanceChartPoints,
} from "./account-balance-chart.utility";
import { AccountBalanceDayTransactions } from "./AccountBalanceDayTransactions";
import { BalanceDateFilter } from "./BalanceDateFilter";
import * as S from "./AccountBalanceChart.styles";

const BalanceChart = dynamic(() => import("@/components/ui/chart").then(mod => mod.BalanceChart), {
  ssr: false,
});

interface AccountBalanceChartProps {
  address: string;
}

const StandardNetworkAccountBalanceChart = ({ address }: AccountBalanceChartProps) => {
  const [selection, setSelection] = React.useState<BalanceRangeSelection>(BALANCE_RANGE.ONE_MONTH);
  // The day is fixed per mount so the query key stays stable while the page is open.
  const [now] = React.useState(() => Date.now());
  const request = React.useMemo(() => makeBalanceHistoryRequest(address, selection, now), [address, selection, now]);

  // The previous range stays (dimmed) while the next loads, so the cards do not drop out and shift the page.
  const { data, isError, isPreviousData } = useGetAccountNativeBalanceHistory(request, { keepPreviousData: true });
  const { getUsdDisplay } = useTokenPrice();
  // Valued at the current GNOT price, like the summary cards; a zero balance shows no value.
  const getUsd = React.useCallback(
    (balance: string) => (BigNumber(balance).isZero() ? null : getUsdDisplay(GNOTToken.denom, balance)),
    [getUsdDisplay],
  );

  const items = data?.items;
  const points = React.useMemo(() => toBalanceChartPoints(items ?? []), [items]);
  const extremes = React.useMemo(() => findBalanceExtremes(items ?? []), [items]);
  const hasBalance = !!items?.some(item => item.balance !== "0");

  // Clicking the selected day again clears it, and so does another range. A day that the range on screen does not
  // have, or one of a range without balance, is not selected.
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const activeDate = hasBalance && items?.some(item => item.date === selectedDate) ? selectedDate : null;
  // A selection that went away stays gone when the day comes back.
  if (items && selectedDate && !activeDate) {
    setSelectedDate(null);
  }
  const changeSelection = React.useCallback((next: BalanceRangeSelection) => {
    setSelection(next);
    setSelectedDate(null);
  }, []);
  const toggleDate = React.useCallback(
    (date: string) => setSelectedDate(current => (current === date ? null : date)),
    [],
  );

  const renderChart = () => {
    if (!items)
      return isError ? <Notice message="Balance history could not be loaded." /> : <Spinner position="center" />;
    if (!hasBalance) return <Notice message="No balance in this period." />;
    return (
      <>
        <BalanceChart datas={points} getUsd={getUsd} selectedDate={activeDate} onSelectDate={toggleDate} />
        {isPreviousData && <Spinner position="center" />}
      </>
    );
  };

  return (
    <S.Content>
      <S.Header>
        <Text type="h6" desktopType="h4" color="primary">
          GNOT Balance History
        </Text>
        <S.RangeTabs>
          {BALANCE_RANGES.map(item => (
            <S.RangeButton
              key={item}
              type="button"
              $selected={item === selection}
              aria-pressed={item === selection}
              onClick={() => changeSelection(item)}
            >
              {item}
            </S.RangeButton>
          ))}
          <BalanceDateFilter now={now} range={isCustomRange(selection) ? selection : null} onChange={changeSelection} />
        </S.RangeTabs>
      </S.Header>

      {hasBalance && extremes && (
        <S.SummaryList $loading={isPreviousData}>
          <Summary title="Highest Balance" extreme={extremes.highest} />
          <Summary title="Lowest Balance" extreme={extremes.lowest} />
        </S.SummaryList>
      )}

      <S.ChartArea $loading={isPreviousData}>{renderChart()}</S.ChartArea>

      {hasBalance && !activeDate && (
        <Text type="body1" color="tertiary">
          Select a day on the chart to see its transactions.
        </Text>
      )}
      {activeDate && <AccountBalanceDayTransactions key={activeDate} address={address} date={activeDate} />}
    </S.Content>
  );
};

const Summary = ({ title, extreme }: { title: string; extreme: BalanceExtreme }) => (
  <S.SummaryBox>
    <Text type="body1" color="tertiary">
      {title}
    </Text>
    <S.SummaryAmount>
      <AmountText minSize="body1" maxSize="p4" lineHeight="24px" value={extreme.value} denom={GNOTToken.symbol} />
      {/* Valued at the current GNOT price, not the price of that day. */}
      <UsdValueText tokenKey={GNOTToken.denom} amount={extreme.value} />
    </S.SummaryAmount>
    <Text type="body1" color="tertiary">
      {`on ${formatChartDate(extreme.date, CHART_FULL_DATE_FORMAT)}`}
    </Text>
  </S.SummaryBox>
);

const Notice = ({ message }: { message: string }) => (
  <S.Notice role="status">
    <Text type="p4" color="tertiary">
      {message}
    </Text>
  </S.Notice>
);

export default StandardNetworkAccountBalanceChart;
