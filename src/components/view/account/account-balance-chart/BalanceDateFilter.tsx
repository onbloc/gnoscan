import React, { useRef, useState } from "react";
import { useRecoilValue } from "recoil";

import IconClose from "@/assets/svgs/icon-close.svg";
import IconFilter from "@/assets/svgs/icon-filter.svg";
import { useBodyScrollLock } from "@/common/hooks/common/use-body-scroll-lock";
import { useModalFocus } from "@/common/hooks/common/use-modal-focus";
import { themeState } from "@/states";
import Portal from "@/components/core/portal";
import Text from "@/components/ui/text";
import { CHART_FULL_DATE_FORMAT, formatChartDate } from "@/components/ui/chart/chart-common";
import * as F from "../../common/function-filter/FunctionFilter.styles";
import {
  BalanceCustomRange,
  getBalanceToday,
  makeRecentRange,
  validateCustomRange,
} from "./account-balance-chart.utility";
import * as S from "./BalanceDateFilter.styles";

const DEFAULT_DAYS = 30;

const formatRange = ({ from, to }: BalanceCustomRange) =>
  `${formatChartDate(from, CHART_FULL_DATE_FORMAT)} - ${formatChartDate(to, CHART_FULL_DATE_FORMAT)}`;

interface DialogProps {
  // The time the chart treats as now, so both agree on the latest day.
  now: number;
  // The range applied now, or null while a preset range is selected.
  range: BalanceCustomRange | null;
  onApply: (range: BalanceCustomRange) => void;
  onClose: () => void;
}

const DateDialog = ({ now, range, onApply, onClose }: DialogProps) => {
  const today = getBalanceToday(now);
  const [draft, setDraft] = useState<BalanceCustomRange>(() => range ?? makeRecentRange(now, DEFAULT_DAYS));
  const fromRef = useRef<HTMLInputElement>(null);
  const isDark = useRecoilValue(themeState) === "dark";

  useBodyScrollLock(true);
  useModalFocus(onClose, fromRef);

  const error = validateCustomRange(draft, today);
  // An unfilled field is left to the disabled OK instead of an error text.
  const showError = error !== null && !!draft.from && !!draft.to;

  return (
    <F.Overlay onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <F.Dialog role="dialog" aria-modal="true" aria-label="Date filter">
        <F.Header>
          <Text type="h5" color="primary">
            Date Filter
          </Text>
          <F.CloseButton type="button" aria-label="Close" onClick={onClose}>
            <IconClose aria-hidden="true" />
          </F.CloseButton>
        </F.Header>

        <F.Body>
          <S.Fields>
            <S.Field>
              From
              <S.DateInput
                ref={fromRef}
                type="date"
                $dark={isDark}
                value={draft.from}
                max={draft.to || today}
                onChange={event => setDraft(current => ({ ...current, from: event.target.value }))}
              />
            </S.Field>
            <S.Field>
              To
              <S.DateInput
                type="date"
                $dark={isDark}
                value={draft.to}
                min={draft.from}
                max={today}
                onChange={event => setDraft(current => ({ ...current, to: event.target.value }))}
              />
            </S.Field>
          </S.Fields>
          {showError && <S.ErrorText role="alert">{error}</S.ErrorText>}
        </F.Body>

        <F.Footer>
          <F.Count>UTC dates, up to 365 days</F.Count>
          <F.Actions>
            <F.ApplyButton type="button" disabled={error !== null} onClick={() => onApply(draft)}>
              OK
            </F.ApplyButton>
          </F.Actions>
        </F.Footer>
      </F.Dialog>
    </F.Overlay>
  );
};

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
          <DateDialog
            now={now}
            range={range}
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
