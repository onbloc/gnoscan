import React, { useRef, useState } from "react";
import { useRecoilValue } from "recoil";

import IconClose from "@/assets/svgs/icon-close.svg";
import { useBodyScrollLock } from "@/common/hooks/common/use-body-scroll-lock";
import { useModalFocus } from "@/common/hooks/common/use-modal-focus";
import Text from "@/components/ui/text";
import { themeState } from "@/states";
import * as F from "../function-filter/FunctionFilter.styles";
import * as S from "./DateFilterDialog.styles";
import { DateFilterRange, validateDateFilterRange } from "./date-filter.utility";

interface DateFilterDialogProps {
  now: number;
  range: DateFilterRange | null;
  onApply: (range: DateFilterRange) => void;
  onClose: () => void;
  maxRangeDays?: number;
  applyLabel?: string;
  isApplying?: boolean;
  feedback?: React.ReactNode;
}

const DAY_TIME = 24 * 60 * 60 * 1000;
const toUtcDate = (time: number) => new Date(time).toISOString().slice(0, 10);

export const DateFilterDialog = ({
  now,
  range,
  onApply,
  onClose,
  maxRangeDays,
  applyLabel = "OK",
  isApplying = false,
  feedback,
}: DateFilterDialogProps) => {
  const today = toUtcDate(now);
  const [draft, setDraft] = useState<DateFilterRange>(
    () => range ?? { from: toUtcDate(Math.max(0, now - 29 * DAY_TIME)), to: today },
  );
  const fromRef = useRef<HTMLInputElement>(null);
  const isDark = useRecoilValue(themeState) === "dark";

  useBodyScrollLock(true);
  useModalFocus(onClose, fromRef);

  const error = validateDateFilterRange(draft, today, maxRangeDays);
  // An unfilled field is left to the disabled action instead of an error text.
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
                disabled={isApplying}
                value={draft.from}
                min="1970-01-01"
                max={draft.to || today}
                onChange={event => setDraft(current => ({ ...current, from: event.target.value }))}
              />
            </S.Field>
            <S.Field>
              To
              <S.DateInput
                type="date"
                $dark={isDark}
                disabled={isApplying}
                value={draft.to}
                min={draft.from || "1970-01-01"}
                max={today}
                onChange={event => setDraft(current => ({ ...current, to: event.target.value }))}
              />
            </S.Field>
          </S.Fields>
          {showError && <S.ErrorText role="alert">{error}</S.ErrorText>}
          {feedback}
        </F.Body>

        <F.Footer>
          <F.Count>{maxRangeDays === undefined ? "UTC dates" : `UTC dates, up to ${maxRangeDays} days`}</F.Count>
          <F.Actions>
            <F.ApplyButton
              type="button"
              disabled={error !== null || isApplying}
              aria-busy={isApplying}
              onClick={() => onApply(draft)}
            >
              {applyLabel}
            </F.ApplyButton>
          </F.Actions>
        </F.Footer>
      </F.Dialog>
    </F.Overlay>
  );
};
