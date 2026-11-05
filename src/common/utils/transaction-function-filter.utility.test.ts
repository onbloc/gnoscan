import { ALL_FUNCTIONS, MAX_FUNCTION_LABELS } from "@/repositories/api/transaction/request";
import {
  canToggleFunction,
  isFunctionChecked,
  isFunctionFilterApplicable,
  removeFunctionLabel,
  setAllFunctionsChecked,
  setFunctionChecked,
} from "./transaction-function-filter.utility";

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

  it("starts an include list with nothing checked when All is unchecked, and lists everything when it is checked", () => {
    expect(setAllFunctionsChecked(false)).toEqual(include());
    expect(setAllFunctionsChecked(true)).toEqual(ALL_FUNCTIONS);
  });

  it("cannot apply an include filter with no label", () => {
    expect(isFunctionFilterApplicable(include())).toBe(false);
    expect(isFunctionFilterApplicable(include("Mint"))).toBe(true);
    expect(isFunctionFilterApplicable(ALL_FUNCTIONS)).toBe(true);
  });

  it("falls back to every transaction when removing the last label of an include filter", () => {
    expect(removeFunctionLabel(include("Mint"), "Mint")).toEqual(ALL_FUNCTIONS);
    expect(removeFunctionLabel(include("Mint", "Swap"), "Mint")).toEqual(include("Swap"));
    expect(removeFunctionLabel(exclude("Mint"), "Mint")).toEqual(ALL_FUNCTIONS);
  });

  it("only lets a label out of a full list", () => {
    const labels = Array.from({ length: MAX_FUNCTION_LABELS }, (_, index) => `Fn${index}`);

    expect(canToggleFunction(include(...labels), "Fn1")).toBe(true);
    expect(canToggleFunction(include(...labels), "Other")).toBe(false);
    expect(canToggleFunction(exclude(...labels), "Fn1")).toBe(true);
    expect(canToggleFunction(exclude(...labels), "Other")).toBe(false);
    expect(canToggleFunction(include(...labels.slice(1)), "Other")).toBe(true);
  });
});
