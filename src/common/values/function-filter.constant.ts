import { FunctionFilterValue } from "@/common/types/function-filter";

/** Most distinct function labels the API accepts in one request, for `function` and for `excludeFunction` each. */
export const MAX_FUNCTION_LABELS = 100;

/** The filter that lists every transaction. */
export const ALL_FUNCTIONS: FunctionFilterValue = { mode: "exclude", labels: [] };
