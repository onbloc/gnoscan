import { FunctionFilterApiParams } from "@/common/types/function-filter";

export interface GetBlockTransactionsRequest extends FunctionFilterApiParams {
  blockHeight: string;

  page?: number;

  limit?: number;
}
