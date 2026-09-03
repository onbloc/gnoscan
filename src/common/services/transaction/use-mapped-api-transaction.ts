import React from "react";

import { useGetTransactionByHash, useGetTransactionPending } from "@/common/react-query/transaction/api";
import { TransactionMapper } from "@/common/mapper/transaction/transaction-mapper";
import { TransactionSummaryInfo } from "@/types/data-type";
import { CommonError } from "@/common/errors";

export const INITIAL_TRANSACTION_SUMMARY_STATE: TransactionSummaryInfo = {
  network: "",
  timeStamp: {
    time: "-",
    passedTime: "-",
  },
  blockResult: "",
  gas: "",
  transactionEvents: [],
  transactionItem: null,
};

// Matches the backend's mempool poll interval (1s) closely enough to catch a pending
// tx while it's still in the pool, without hammering the API.
const POLL_INTERVAL_MS = 3000;

// GET /transactions/{hash}/pending's UNKNOWN is not a confirmed negative (see its
// backend doc comment) — the node only exposes its oldest mempool entries, and a
// freshly-broadcast tx can also land in the gap between leaving the mempool and the
// indexer finishing the confirmed write. Ride out a few poll cycles as "loading"
// before settling on not_found, instead of treating the first UNKNOWN as final.
const NOT_FOUND_GRACE_MS = 10000;

export type TransactionLookupStatus = "loading" | "confirmed" | "pending" | "not_found";

type Settled = { hash: string; status: "confirmed" | "pending"; data: TransactionSummaryInfo };

/**
 * Hooks to get transaction-detail data for the "standard" (indexer-backed) network.
 *
 * 1. Looks up the confirmed tx via GET /transactions/{hash}, polling every
 *    POLL_INTERVAL_MS until it's found.
 * 2. If it comes back not-found, also polls GET /transactions/{hash}/pending —
 *    reads the tx straight out of the gno node's mempool and decodes it
 *    client-side, so only fields derivable from the raw tx bytes are available
 *    (memo, fee, gas wanted, decoded messages), not block height/timestamp/gas
 *    used/success/storage, which only exist once the tx is confirmed and indexed.
 * 3. A poll tick that finds nothing new is simply ignored — the page keeps
 *    showing whatever it already had, and the next tick tries again. This
 *    matters because a tx leaving the mempool almost always means it just got
 *    included in a block, and the indexer needs a moment to catch up; without
 *    this, that brief window would flash the page from "Pending" to "Not Found".
 * 4. Before ever having seen a pending/confirmed result, "not found" is only
 *    declared after NOT_FOUND_GRACE_MS of polling — see NOT_FOUND_GRACE_MS above.
 *
 * @param hash - the transaction hash to look up
 * @param enabled - set to false to skip both queries entirely (e.g. this repo also
 * supports pointing at an arbitrary custom RPC network, which isn't necessarily the
 * network gnoscan's own indexer API is tracking)
 * @returns Mapped transaction data, a lookup status, and (for backward
 * compatibility with existing callers) isFetched/isLoading/isError derived from it.
 */
export const useMappedApiTransaction = (hash: string, enabled = true) => {
  const {
    data: apiData,
    isFetched: isApiFetched,
    isError: isApiError,
  } = useGetTransactionByHash(hash, {
    enabled: enabled && !!hash,
    // A real 404 shouldn't be retried (it never resolves — fall through to the
    // pending check instead), but the repository/network client can still be
    // mid-initialization on first mount, which fails with a CommonError before
    // ever making a request. Retry a few times for that case only.
    retry: (failureCount, error) => error instanceof CommonError && failureCount < 3,
    refetchInterval: data => (data?.data ? false : POLL_INTERVAL_MS),
  });

  const confirmedResolved = isApiFetched && !isApiError && !!apiData?.data;
  const confirmedLookupFailed = isApiFetched && isApiError;

  const { data: pendingData, isFetched: isPendingFetched } = useGetTransactionPending(hash, {
    enabled: enabled && !!hash && confirmedLookupFailed && !confirmedResolved,
    // Every real response from this endpoint is a 200 (see its handler), so any
    // error here is transient (network hiccup, or the same repository-init race
    // as above) — worth a few retries rather than waiting a full poll cycle.
    retry: 3,
    refetchInterval: POLL_INTERVAL_MS,
  });

  // The last result good enough to show. A poll tick only ever moves this forward
  // (pending -> confirmed) — it's never cleared by a tick that comes back worse.
  // Scoped by hash: a stale `settled` from the previous tx (state updates are async,
  // so it can still be around for one render right after `hash` changes) is filtered
  // out below rather than shown against the new hash.
  const [settled, setSettled] = React.useState<Settled | null>(null);
  const settledForHash = settled?.hash === hash ? settled : null;

  // Whether NOT_FOUND_GRACE_MS has elapsed since the first completed confirmed+pending
  // pass, without ever having found anything. Starts false on every new hash.
  const [gracePeriodElapsed, setGracePeriodElapsed] = React.useState(false);
  const firstCheckedAtRef = React.useRef<number | null>(null);

  const hasData = Boolean(apiData?.data);

  React.useEffect(() => {
    setSettled(null);
    setGracePeriodElapsed(false);
    firstCheckedAtRef.current = null;
  }, [hash]);

  React.useEffect(() => {
    if (confirmedResolved && apiData?.data) {
      setSettled({ hash, status: "confirmed", data: TransactionMapper.transactionFromApiResponse(apiData.data) });
    } else if (pendingData?.status === "PENDING" && pendingData.rawTx) {
      const data = TransactionMapper.transactionFromPendingRawTx(pendingData.rawTx);
      setSettled(prev =>
        prev?.hash === hash && prev.status === "confirmed" ? prev : { hash, status: "pending", data },
      );
    }
  }, [hash, confirmedResolved, apiData?.data, pendingData?.status, pendingData?.rawTx]);

  React.useEffect(() => {
    if (settledForHash || firstCheckedAtRef.current !== null || !confirmedLookupFailed || !isPendingFetched) {
      return;
    }

    firstCheckedAtRef.current = Date.now();

    const timer = setTimeout(() => setGracePeriodElapsed(true), NOT_FOUND_GRACE_MS);

    return () => clearTimeout(timer);
  }, [settledForHash, confirmedLookupFailed, isPendingFetched, hash]);

  const status: TransactionLookupStatus = React.useMemo(() => {
    if (settledForHash) return settledForHash.status;
    if (!isApiFetched) return "loading";
    if (confirmedLookupFailed && !isPendingFetched) return "loading";
    return gracePeriodElapsed ? "not_found" : "loading";
  }, [settledForHash, isApiFetched, confirmedLookupFailed, isPendingFetched, gracePeriodElapsed]);

  return {
    data: settledForHash?.data ?? INITIAL_TRANSACTION_SUMMARY_STATE,
    status,
    isFetched: status === "confirmed" || status === "pending" || status === "not_found",
    isLoading: status === "loading",
    isError: status === "not_found",
    hasData,
  };
};
