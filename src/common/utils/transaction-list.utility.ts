import type { BaseTransactionModel } from "@/models/api/transaction/transaction-model";
import { WUGNOT_PACKAGE_PATH } from "@/common/values/constant-value";

export function isPreparatoryTransactionFunction(packagePath: string, functionName: string): boolean {
  return (
    functionName === "Approve" ||
    (packagePath === WUGNOT_PACKAGE_PATH && (functionName === "Deposit" || functionName === "Withdraw"))
  );
}

export function getRepresentativeTransactionFunction(
  transaction: Pick<BaseTransactionModel, "messageCount" | "func" | "successYn">,
) {
  const first = transaction.func[0];
  if (transaction.successYn !== true || transaction.messageCount <= 1) return first;

  return (
    transaction.func.find(func => !isPreparatoryTransactionFunction(func.pkgPath, func.funcType)) ??
    transaction.func.find(func => func.funcType !== "Approve") ??
    first
  );
}
