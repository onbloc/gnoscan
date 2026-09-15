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
  it("returns one entry per message, matching each pkgPath in order", () => {
    const messages = [makeMessage("gno.land/r/a"), makeMessage("gno.land/r/b")];
    const actions = [makeAction("gno.land/r/a", "swap"), makeAction("gno.land/r/b", "stake")];

    const result = pairMessagesWithActions(messages, actions);

    expect(result).toHaveLength(messages.length);
    expect(result[0]?.type).toBe("swap");
    expect(result[1]?.type).toBe("stake");
  });

  it("leaves a message unmatched when no action targets its pkgPath", () => {
    const messages = [makeMessage("gno.land/r/a")];
    const result = pairMessagesWithActions(messages, []);

    expect(result).toEqual([undefined]);
  });

  it("consumes each action at most once, so repeated pkgPaths pair in message order", () => {
    const messages = [makeMessage("gno.land/r/pool"), makeMessage("gno.land/r/pool")];
    const actions = [makeAction("gno.land/r/pool", "swap"), makeAction("gno.land/r/pool", "stake")];

    const result = pairMessagesWithActions(messages, actions);

    expect(result[0]?.type).toBe("swap");
    expect(result[1]?.type).toBe("stake");
  });

  it("keeps the result length equal to the message count even with extra unmatched actions", () => {
    const messages = [makeMessage("gno.land/r/a")];
    const actions = [makeAction("gno.land/r/a", "swap"), makeAction("gno.land/r/unrelated", "enable")];

    const result = pairMessagesWithActions(messages, actions);

    expect(result).toHaveLength(1);
    expect(result[0]?.type).toBe("swap");
  });

  it("matches an m_run message by its calledFunctions packagePath, not its own pkgPath", () => {
    const messages = [makeRunMessage(["gno.land/r/gnoswap/pool"])];
    const actions = [makeAction("gno.land/r/gnoswap/pool", "swap")];

    const result = pairMessagesWithActions(messages, actions);

    expect(result[0]?.type).toBe("swap");
  });
});
