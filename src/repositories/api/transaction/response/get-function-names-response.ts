export interface FunctionNameModel {
  name: string;
  // Realm the function belongs to; one name can appear once per realm.
  packagePath: string;
  // Number of calls, used to rank the candidates.
  count: number;
}

export interface GetFunctionNamesResponse {
  items: FunctionNameModel[];
}
