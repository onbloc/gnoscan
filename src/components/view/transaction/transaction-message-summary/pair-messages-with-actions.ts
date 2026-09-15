import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { TransactionAction } from "@/types/data-type";

// `summary.actions` (per-tx backend summary) and `messages` (per-message contracts API)
// come from two independent endpoints with no shared index — the only link between them
// is pkgPath (`message.pkgPath === action.realm`). Pair them in message order, consuming
// each action at most once, so a tx with two calls into the same realm (e.g. two swaps)
// gets its two actions matched in the same order the messages were sent. A message with
// no match (most messages — actions only exist for backend-recognized semantics like
// swap/stake/enable) gets `undefined`, and falls back to a generic message-based line.
export function pairMessagesWithActions(
  messages: TransactionContractModel[],
  actions: TransactionAction[],
): (TransactionAction | undefined)[] {
  const remaining = [...actions];

  return messages.map(message => {
    const candidates = pkgPathCandidates(message);
    const index = remaining.findIndex(action => candidates.includes(action.realm));
    if (index === -1) return undefined;

    const [matched] = remaining.splice(index, 1);
    return matched;
  });
}

// A `/vm.m_run` message's own `pkgPath` is just its ephemeral run-script package, not a
// realm — the realm(s) it actually touches live in `calledFunctions[].packagePath`
// (see StandardNetworkMsgRunMessage, which renders those as "Called Functions" and
// never reads `pkgPath`). Include them so a run-script swap/stake/etc. still matches
// its backend action, which reports the *called* realm.
function pkgPathCandidates(message: TransactionContractModel): string[] {
  return [message.pkgPath, ...(message.calledFunctions?.map(fn => fn.packagePath) ?? [])];
}
