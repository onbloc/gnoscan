import { Amount } from "@/types/data-type";
import { BaseTransactionModel } from "@/models/api/transaction";

export interface AccountTransactionInfo extends BaseTransactionModel {
  amountIn: Amount;
  amountOut: Amount;

  isGRC20Transfer: boolean;
  isGRC721Transfer: boolean;
}

export interface GetAccountTransactionsResponse {
  items: AccountTransactionInfo[];

  page: {
    cursor: string;
    hasNext: boolean;
  };
}
