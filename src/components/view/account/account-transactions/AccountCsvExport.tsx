import React, { useCallback, useEffect, useRef, useState } from "react";

import IconDownload from "@/assets/svgs/icon-download.svg";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { FunctionFilterApiParams } from "@/common/types/function-filter";
import {
  ACCOUNT_CSV_LIMIT,
  AccountCsvLimitError,
  fetchAccountActivityCsv,
} from "@/common/utils/account-activity-csv.utility";
import { downloadCsv, toCsv } from "@/common/utils/csv.utility";
import Portal from "@/components/core/portal";
import { DateFilterDialog } from "../../common/date-filter/DateFilterDialog";
import { DateFilterRange } from "../../common/date-filter/date-filter.utility";
import { CsvButton } from "../../common/list-csv/ListCsvButton.styles";
import * as S from "./AccountCsvExport.styles";
import { useTokenResourceMeta } from "@/common/hooks/common/use-token-resource-meta";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";

export type AccountCsvKind = "transactions" | "native-transfers" | "token-transfers";

interface Props {
  address: string;
  kind: AccountCsvKind;
  filter: FunctionFilterApiParams;
}

const CSV_CLICK_INTERVAL_MS = 5000;

/** Export state belongs to the account, network, tab and applied function filter. */
export const AccountCsvExport = ({ address, kind, filter }: Props) => {
  const { apiAccountRepository } = useServiceProvider();
  const { getTokenMeta, isFetched: isResourceFetched } = useTokenResourceMeta();
  const { getTokenAmount, isFetchedGRC20Tokens } = useTokenMeta();
  const amountsReady = isResourceFetched && isFetchedGRC20Tokens;
  const [range, setRange] = useState<DateFilterRange | null>(null);
  const [dialog, setDialog] = useState<{ now: number } | null>(null);
  const [notice, setNotice] = useState<{ type: "info" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const retryAt = useRef(0);
  const coolingDown = remainingSeconds > 0;
  const active = useRef(true);
  const pending = useRef(false);
  const requestId = useRef(0);
  const close = useCallback(() => {
    requestId.current += 1;
    setDialog(null);
    setNotice(null);
  }, []);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  useEffect(() => {
    if (!coolingDown) return;
    const timer = window.setInterval(() => {
      setRemainingSeconds(Math.max(0, Math.ceil((retryAt.current - Date.now()) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [coolingDown]);

  const download = async (selected: DateFilterRange) => {
    const now = Date.now();
    if (!apiAccountRepository || !amountsReady || pending.current || now < retryAt.current) return;
    const id = ++requestId.current;
    const isCurrent = () => active.current && requestId.current === id;
    pending.current = true;
    retryAt.current = now + CSV_CLICK_INTERVAL_MS;
    setRemainingSeconds(CSV_CLICK_INTERVAL_MS / 1000);
    setRange(selected);
    setBusy(true);
    setNotice(null);

    try {
      const csv = await fetchAccountActivityCsv(
        async pagination => {
          // Closing the dialog or changing context cancels the old export.
          if (!isCurrent()) throw new Error("Export cancelled.");
          const params = { address, ...selected, ...pagination };
          const result = await (kind === "transactions"
            ? apiAccountRepository.getAccountDirectTransactions({ ...params, ...filter })
            : kind === "native-transfers"
            ? apiAccountRepository.getAccountNativeTransfers(params)
            : apiAccountRepository.getAccountTokenTransfers(params));
          if (!isCurrent()) throw new Error("Export cancelled.");
          return result;
        },
        kind === "transactions" ? "direct" : "transfers",
        { getTokenMeta, getFeeAmount: fee => getTokenAmount(fee.denom, fee.value) },
      );
      if (!isCurrent()) return;
      if (csv.rows.length === 0) {
        setNotice({ type: "info", text: "No transactions found in the selected date range." });
        return;
      }
      downloadCsv(`account-${address}_${kind}_${selected.from}_${selected.to}.csv`, toCsv(csv.header, csv.rows));
      setNotice({ type: "info", text: `CSV exported: ${csv.rows.length.toLocaleString("en-US")} transactions.` });
    } catch (error) {
      if (!isCurrent()) return;
      setNotice({
        type: "error",
        text:
          error instanceof AccountCsvLimitError
            ? `More than ${ACCOUNT_CSV_LIMIT.toLocaleString(
                "en-US",
              )} transactions match this date range. Please choose a smaller date range.`
            : "Could not export CSV. Please try again.",
      });
    } finally {
      pending.current = false;
      if (active.current) setBusy(false);
    }
  };

  return (
    <>
      <CsvButton
        type="button"
        aria-label="Download CSV"
        aria-haspopup="dialog"
        title="Download CSV"
        disabled={!apiAccountRepository || !amountsReady}
        onClick={() => setDialog({ now: Date.now() })}
      >
        <IconDownload aria-hidden="true" />
        <span>Download CSV</span>
      </CsvButton>
      {dialog && (
        <Portal selector="modal-root">
          <DateFilterDialog
            now={dialog.now}
            range={range}
            onClose={close}
            onApply={download}
            applyLabel={busy ? "Preparing CSV…" : coolingDown ? `Try again in ${remainingSeconds}s` : "Download CSV"}
            isApplying={busy}
            isApplyDisabled={coolingDown || !apiAccountRepository || !amountsReady}
            feedback={
              notice && (
                <S.Notice role={notice.type === "error" ? "alert" : "status"} $error={notice.type === "error"}>
                  {notice.text}
                </S.Notice>
              )
            }
          />
        </Portal>
      )}
    </>
  );
};
