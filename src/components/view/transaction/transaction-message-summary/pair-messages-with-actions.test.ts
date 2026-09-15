import { TransactionContractModel } from "@/repositories/api/transaction/response";
import { TransactionAction } from "@/types/data-type";
import { pairMessagesWithActions } from "./pair-messages-with-actions";

function makeMessage(pkgPath: string): TransactionContractModel {
  return {
    messageType: "/vm.m_call",
    name: "",
    pkgName: "",
    pkgPath,
    funcType: "",
    caller: "",
    callerName: "",
    creator: "",
    creatorName: "",
    amount: { value: "0", denom: "" },
    from: "",
    fromName: "",
    to: "",
    toName: "",
    log: "",
    args: [],
    calledFunctions: [],
    files: [],
    deposit: { value: "0", denom: "" },
    maxDeposit: { value: "0", denom: "" },
    send: { value: "0", denom: "" },
  };
}

function makeAction(realm: string, type: string): TransactionAction {
  return { tag: "vm", realm, type, assets: [] };
}

function makeRunMessage(calledPackagePaths: string[]): TransactionContractModel {
  return {
    ...makeMessage("gno.land/r/run_script"), // an m_run message's own pkgPath is its ephemeral script package, not a realm
    messageType: "/vm.m_run",
    calledFunctions: calledPackagePaths.map(packagePath => ({ packagePath, method: "Swap" })),
  };
}

describe("pairMessagesWithActions", () => {
  it("returns one array per message, matching each pkgPath 1:1", () => {
    const messages = [makeMessage("gno.land/r/a"), makeMessage("gno.land/r/b")];
    const actions = [makeAction("gno.land/r/a", "swap"), makeAction("gno.land/r/b", "stake")];

    const result = pairMessagesWithActions(messages, actions);

    expect(result).toHaveLength(messages.length);
    expect(result[0].map(a => a.type)).toEqual(["swap"]);
    expect(result[1].map(a => a.type)).toEqual(["stake"]);
  });

  it("leaves a message unmatched (empty array) when no action targets its pkgPath", () => {
    const messages = [makeMessage("gno.land/r/a")];
    const result = pairMessagesWithActions(messages, []);

    expect(result).toEqual([[]]);
  });

  it("pairs two messages to the same realm with two actions in order", () => {
    const messages = [makeMessage("gno.land/r/pool"), makeMessage("gno.land/r/pool")];
    const actions = [makeAction("gno.land/r/pool", "swap"), makeAction("gno.land/r/pool", "stake")];

    const result = pairMessagesWithActions(messages, actions);

    expect(result[0].map(a => a.type)).toEqual(["swap"]);
    expect(result[1].map(a => a.type)).toEqual(["stake"]);
  });

  it("keeps the result length equal to the message count even with extra unmatched actions", () => {
    const messages = [makeMessage("gno.land/r/a")];
    const actions = [makeAction("gno.land/r/a", "swap"), makeAction("gno.land/r/unrelated", "enable")];

    const result = pairMessagesWithActions(messages, actions);

    expect(result).toHaveLength(1);
    expect(result[0].map(a => a.type)).toEqual(["swap"]);
  });

  it("matches an m_run message by its calledFunctions packagePath, not its own pkgPath", () => {
    const messages = [makeRunMessage(["gno.land/r/gnoswap/pool"])];
    const actions = [makeAction("gno.land/r/gnoswap/pool", "swap")];

    const result = pairMessagesWithActions(messages, actions);

    expect(result[0].map(a => a.type)).toEqual(["swap"]);
  });

  it("attaches every matched action to a single m_run message that calls multiple realms", () => {
    const messages = [makeRunMessage(["gno.land/r/gnoswap/pool", "gno.land/r/gnoswap/staker"])];
    const actions = [makeAction("gno.land/r/gnoswap/pool", "swap"), makeAction("gno.land/r/gnoswap/staker", "stake")];

    const result = pairMessagesWithActions(messages, actions);

    expect(result[0].map(a => a.type).sort()).toEqual(["stake", "swap"]);
  });

  it("attaches a realm's lone action to a single m_run message even if it lists that realm twice", () => {
    // calledFunctions has the same realm twice (e.g. Approve then Swap on the same pool),
    // but the backend only reported one action for it — this is still unambiguous (one
    // message), so it must not fall back the way a genuine multi-message mismatch would.
    const messages = [makeRunMessage(["gno.land/r/gnoswap/pool", "gno.land/r/gnoswap/pool"])];
    const actions = [makeAction("gno.land/r/gnoswap/pool", "swap")];

    const result = pairMessagesWithActions(messages, actions);

    expect(result[0].map(a => a.type)).toEqual(["swap"]);
  });

  it("leaves both messages unmatched when a realm's message count and action count disagree", () => {
    // A generic (no-op-for-summary) call and a real swap both hit the same realm, but the
    // backend only reported one action for it — pairing by position would risk attaching
    // "swap" to the wrong (first) message, so neither should be guessed.
    const messages = [makeMessage("gno.land/r/pool"), makeMessage("gno.land/r/pool")];
    const actions = [makeAction("gno.land/r/pool", "swap")];

    const result = pairMessagesWithActions(messages, actions);

    expect(result[0]).toEqual([]);
    expect(result[1]).toEqual([]);
  });
});
