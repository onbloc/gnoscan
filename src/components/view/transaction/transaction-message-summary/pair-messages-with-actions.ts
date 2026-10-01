import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { TransactionAction } from "@/types/data-type";

// `summary.actions` (per-tx backend summary) and `messages` (per-message contracts API)
// come from two independent endpoints with no shared index — the only link between them
// is pkgPath (`message.pkgPath === action.realm`, or one of an m_run message's
// `calledFunctions[].packagePath`, see pkgPathCandidates below).
//
// Group messages and actions by realm, and only pair them within a realm when the
// message count and action count agree there. An unequal count means we can't tell
// *which* message(s) the action(s) belong to — e.g. two messages call the same realm,
// only the second one produced a real action, and guessing by position would attach
// that action (e.g. "Swap") to the wrong (first) message. In that case every message
// sharing the ambiguous realm is left unmatched and falls back to a generic line
// instead of risking a wrong one.
//
// A message can end up with more than one matched action (an m_run message calling
// several realms, each cleanly 1:1) — callers should render all of them for that message.
export function pairMessagesWithActions(
  messages: TransactionContractModel[],
  actions: TransactionAction[],
): TransactionAction[][] {
  const matchesByMessage: TransactionAction[][] = messages.map(() => []);

  // Dedupe per message: an m_run message listing the same realm twice in
  // `calledFunctions` (e.g. Approve then Swap on the same pool) must count as ONE
  // candidate message for that realm, not two — it's still a single, unambiguous
  // message, and inflating its count here would wrongly trip the mismatch check below.
  const messageIndicesByRealm = new Map<string, number[]>();
  messages.forEach((message, index) => {
    new Set(pkgPathCandidates(message)).forEach(realm => {
      const indices = messageIndicesByRealm.get(realm) ?? [];
      indices.push(index);
      messageIndicesByRealm.set(realm, indices);
    });
  });

  const actionsByRealm = new Map<string, TransactionAction[]>();
  actions.forEach(action => {
    const realmActions = actionsByRealm.get(action.realm) ?? [];
    realmActions.push(action);
    actionsByRealm.set(action.realm, realmActions);
  });

  actionsByRealm.forEach((realmActions, realm) => {
    const messageIndices = messageIndicesByRealm.get(realm);
    if (!messageIndices) return;

    // A single candidate message for this realm is never ambiguous — whether it named
    // the realm once or (via duplicate calledFunctions) several times, every action the
    // backend reports for that realm belongs to it.
    if (messageIndices.length === 1) {
      matchesByMessage[messageIndices[0]].push(...realmActions);
      return;
    }

    // Multiple distinct messages share this realm: only pair them in order when the
    // counts agree — see the module comment for why a mismatch is left unmatched.
    if (messageIndices.length !== realmActions.length) return;

    messageIndices.forEach((messageIndex, i) => {
      matchesByMessage[messageIndex].push(realmActions[i]);
    });
  });

  return matchesByMessage;
}

// A `/vm.m_run` message's own `pkgPath` is just its ephemeral run-script package, not a
// realm — the realm(s) it actually touches live in `calledFunctions[].packagePath`
// (see StandardNetworkMsgRunMessage, which renders those as "Called Functions" and
// never reads `pkgPath`). Include them so a run-script swap/stake/etc. still matches
// its backend action, which reports the *called* realm.
function pkgPathCandidates(message: TransactionContractModel): string[] {
  return [message.pkgPath, ...(message.calledFunctions?.map(fn => fn.packagePath) ?? [])];
}
