export interface FunctionNameModel {
  name: string;
  // Number of calls, used to rank the candidates.
  count: number;
}

export interface GetFunctionNamesResponse {
  items: FunctionNameModel[];
}
