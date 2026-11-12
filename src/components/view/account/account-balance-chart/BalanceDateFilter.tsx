import React, { useState } from "react";

import IconFilter from "@/assets/svgs/icon-filter.svg";
import { DateFilterDialog } from "@/components/view/common/date-filter/DateFilterDialog";
import Portal from "@/components/core/portal";
import { CHART_FULL_DATE_FORMAT, formatChartDate } from "@/components/ui/chart/chart-common";
import { BalanceCustomRange } from "./account-balance-chart.utility";
import * as S from "./BalanceDateFilter.styles";

const formatRange = ({ from, to }: BalanceCustomRange) =>
  `${formatChartDate(from, CHART_FULL_DATE_FORMAT)} - ${formatChartDate(to, CHART_FULL_DATE_FORMAT)}`;

interface BalanceDateFilterProps {
  // The time the chart treats as now, so both agree on the latest day.
  now: number;
  // The range applied now, or null while a preset range is selected.
  range: BalanceCustomRange | null;
  onChange: (range: BalanceCustomRange) => void;
}

/** Filter button, highlighted while a picked range is applied, that opens the date filter modal. */
export const BalanceDateFilter = ({ now, range, onChange }: BalanceDateFilterProps) => {
  const [open, setOpen] = useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  return (
    <>
      <S.DateFilterButton
        type="button"
        $active={range !== null}
        aria-haspopup="dialog"
        aria-label={range ? `Date filter, ${formatRange(range)}` : "Date filter"}
        onClick={() => setOpen(true)}
      >
        <IconFilter aria-hidden="true" />
      </S.DateFilterButton>
      {open && (
        <Portal selector="modal-root">
          <DateFilterDialog
            now={now}
            range={range}
            maxRangeDays={365}
            onApply={next => {
              onChange(next);
              close();
            }}
            onClose={close}
          />
        </Portal>
      )}
    </>
  );
};
