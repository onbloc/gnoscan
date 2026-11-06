import React from "react";
import dynamic from "next/dynamic";

import { useGetAccountNativeBalanceHistory } from "@/common/react-query/account/api/use-get-account-native-balance-history";
import { formatChartDate } from "@/components/ui/chart/chart-common";
import { Spinner } from "@/components/ui/loading";
import Text from "@/components/ui/text";
import { AmountText } from "@/components/ui/text/amount-text";
import { UsdValueText } from "@/components/ui/text/usd-value-text";
import { GNOTToken } from "@/common/hooks/common/use-token-meta";
import {
  BALANCE_RANGE,
  BALANCE_RANGES,
  BalanceExtreme,
  BalanceRange,
  findBalanceExtremes,
  makeBalanceHistoryRequest,
  toBalanceChartPoints,
} from "./account-balance-chart.utility";
import * as S from "./AccountBalanceChart.styles";

const BalanceChart = dynamic(() => import("@/components/ui/chart").then(mod => mod.BalanceChart), {
  ssr: false,
});

interface AccountBalanceChartProps {
  address: string;
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };

const StandardNetworkAccountBalanceChart = ({ address }: AccountBalanceChartProps) => {
  const [range, setRange] = React.useState<BalanceRange>(BALANCE_RANGE.ONE_MONTH);
  // The day is fixed per mount so the query key stays stable while the page is open.
  const [now] = React.useState(() => Date.now());
  const request = React.useMemo(() => makeBalanceHistoryRequest(address, range, now), [address, range, now]);

  const { data, isError } = useGetAccountNativeBalanceHistory(request);

  const items = data?.items;
  const points = React.useMemo(() => toBalanceChartPoints(items ?? []), [items]);
  const extremes = React.useMemo(() => findBalanceExtremes(items ?? []), [items]);
  const hasBalance = !!items?.some(item => item.balance !== "0");

  const renderChart = () => {
    if (!items)
      return isError ? <Notice message="Balance history could not be loaded." /> : <Spinner position="center" />;
    if (!hasBalance) return <Notice message="No balance in this period." />;
    return <BalanceChart datas={points} />;
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
              $selected={item === range}
              aria-pressed={item === range}
              onClick={() => setRange(item)}
            >
              {item}
            </S.RangeButton>
          ))}
        </S.RangeTabs>
      </S.Header>

      {hasBalance && extremes && (
        <S.SummaryList>
          <Summary title="Highest Balance" extreme={extremes.highest} />
          <Summary title="Lowest Balance" extreme={extremes.lowest} />
        </S.SummaryList>
      )}

      <S.ChartArea>{renderChart()}</S.ChartArea>
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
      {`on ${formatChartDate(extreme.date, DATE_FORMAT)}`}
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
