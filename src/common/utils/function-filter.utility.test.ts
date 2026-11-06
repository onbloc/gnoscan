import { ALL_FUNCTIONS, MAX_FUNCTION_LABELS } from "@/common/values/function-filter.constant";
import {
  canToggleFunction,
  getFunctionFilterScope,
  isFunctionChecked,
  removeFunctionLabel,
  setAllFunctionsChecked,
  setFunctionChecked,
  toFunctionFilterApiParams,
} from "./function-filter.utility";

const include = (...labels: string[]) => ({ mode: "include" as const, labels });
const exclude = (...labels: string[]) => ({ mode: "exclude" as const, labels });

describe("transaction function filter", () => {
  it("checks every label but the listed ones in exclude mode, only the listed ones in include mode", () => {
    expect(isFunctionChecked(ALL_FUNCTIONS, "Mint")).toBe(true);
    expect(isFunctionChecked(exclude("Mint"), "Mint")).toBe(false);
    expect(isFunctionChecked(exclude("Mint"), "Swap")).toBe(true);
    expect(isFunctionChecked(include("Mint"), "Mint")).toBe(true);
    expect(isFunctionChecked(include("Mint"), "Swap")).toBe(false);
  });

  it("lists the unchecked labels in exclude mode and the checked ones in include mode", () => {
    expect(setFunctionChecked(ALL_FUNCTIONS, "Mint", false)).toEqual(exclude("Mint"));
    expect(setFunctionChecked(exclude("Mint"), "Mint", true)).toEqual(ALL_FUNCTIONS);
    expect(setFunctionChecked(include(), "Mint", true)).toEqual(include("Mint"));
    expect(setFunctionChecked(include("Mint"), "Mint", false)).toEqual(include());
  });

  it("does not list a label twice", () => {
    expect(setFunctionChecked(exclude("Mint"), "Mint", false)).toEqual(exclude("Mint"));
    expect(setFunctionChecked(include("Mint"), "Mint", true)).toEqual(include("Mint"));
  });

  it("leaves nothing checked when All is unchecked, and lists everything when it is checked", () => {
    expect(setAllFunctionsChecked(false)).toEqual(include());
    expect(setAllFunctionsChecked(true)).toEqual(ALL_FUNCTIONS);
  });

  it("unchecks a label of an include filter and checks a label of an exclude filter when it is removed", () => {
    expect(removeFunctionLabel(include("Mint", "Swap"), "Mint")).toEqual(include("Swap"));
    expect(removeFunctionLabel(include("Mint"), "Mint")).toEqual(include());
    expect(removeFunctionLabel(exclude("Mint"), "Mint")).toEqual(exclude());
  });

  it("only lets a label out of a full list", () => {
    const labels = Array.from({ length: MAX_FUNCTION_LABELS }, (_, index) => `Fn${index}`);

    expect(canToggleFunction(include(...labels), "Fn1")).toBe(true);
    expect(canToggleFunction(include(...labels), "Other")).toBe(false);
    expect(canToggleFunction(exclude(...labels), "Fn1")).toBe(true);
    expect(canToggleFunction(exclude(...labels), "Other")).toBe(false);
    expect(canToggleFunction(include(...labels.slice(1)), "Other")).toBe(true);
  });

  it("sends the labels as function in include mode and as excludeFunction in exclude mode, nothing without labels", () => {
    expect(toFunctionFilterApiParams(include("Mint", "Swap"))).toEqual({ function: ["Mint", "Swap"] });
    expect(toFunctionFilterApiParams(exclude("Mint"))).toEqual({ excludeFunction: ["Mint"] });
    expect(toFunctionFilterApiParams(ALL_FUNCTIONS)).toEqual({});
    expect(toFunctionFilterApiParams(include())).toEqual({});
  });

  it("sends the labels in the same order whatever the order they were picked in", () => {
    expect(toFunctionFilterApiParams(include("Swap", "Mint"))).toEqual({ function: ["Mint", "Swap"] });
    expect(toFunctionFilterApiParams(exclude("Swap", "Mint"))).toEqual({ excludeFunction: ["Mint", "Swap"] });
  });

  it("tells filters apart by mode and labels, not by the order of the labels", () => {
    expect(getFunctionFilterScope(include("Mint", "Swap"))).toBe(getFunctionFilterScope(include("Swap", "Mint")));
    expect(getFunctionFilterScope(include("Mint"))).not.toBe(getFunctionFilterScope(exclude("Mint")));
    expect(getFunctionFilterScope(ALL_FUNCTIONS)).not.toBe(getFunctionFilterScope(include("Mint")));
  });

  it("does not tell the filters that list every transaction apart", () => {
    expect(getFunctionFilterScope(include())).toBe(getFunctionFilterScope(ALL_FUNCTIONS));
  });
});
