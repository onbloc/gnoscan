import { FunctionFilterApiParams } from "@/common/types/function-filter";

export interface GetAccountDirectTransactionsRequest extends FunctionFilterApiParams {
  address: string;

  page?: number;

  limit?: number;
}
