import { FunctionFilterApiParams } from "@/common/types/function-filter";

export interface GetRealmDirectTransactionsRequest extends FunctionFilterApiParams {
  path: string;

  page?: number;

  limit?: number;
}
