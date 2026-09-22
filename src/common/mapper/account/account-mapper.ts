import { AccountTransactionInfo } from "@/repositories/api/account/response";
import { Transaction } from "@/types/data-type";

export class AccountMapper {
  public static accountTransactionFromApiResponses(responses: AccountTransactionInfo[]): Transaction[] {
    return responses.map(response => this.accountTransactionFromApiResponse(response));
  }

  public static accountTransactionFromApiResponse(response: AccountTransactionInfo): Transaction {
    return {
      amount: response.amountIn,
      amountOut: response.amountOut,
      blockHeight: response.blockHeight,
      fee: response.fee,
      from: response.fromAddress,
      to: response.toAddress,
      hash: response.txHash,
      numOfMessage: response.messageCount,
      functionName: response.func[0].funcType,
      packagePath: response.func[0].pkgPath,
      type: response.func[0].messageType,
      success: response.successYn,
      time: response.timestamp,
    };
  }
}
