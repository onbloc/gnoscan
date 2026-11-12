import { FunctionFilterApiParams } from "@/common/types/function-filter";

export interface GetTokenMetaTransactionsRequest extends FunctionFilterApiParams {
  path: string;

  page?: number;

  limit?: number;
}
