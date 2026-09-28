import type { BaseTransactionModel } from "@/models/api/transaction/transaction-model";
import { WUGNOT_PACKAGE_PATH } from "@/common/values/constant-value";

export const APPROVE_FUNCTION = "Approve";
const WUGNOT_WRAP_FUNCTIONS: Readonly<Record<string, true>> = {
  Deposit: true,
  Withdraw: true,
};

export function isPreparatoryTransactionFunction(packagePath: string, functionName: string): boolean {
  return (
    functionName === APPROVE_FUNCTION ||
    (packagePath === WUGNOT_PACKAGE_PATH && WUGNOT_WRAP_FUNCTIONS[functionName] === true)
  );
}

export function getRepresentativeTransactionFunction(transaction: Pick<BaseTransactionModel, "messageCount" | "func">) {
  const first = transaction.func[0];
  if (transaction.messageCount <= 1) return first;

  return (
    transaction.func.find(func => !isPreparatoryTransactionFunction(func.pkgPath, func.funcType)) ??
    transaction.func.find(func => func.funcType !== APPROVE_FUNCTION) ??
    first
  );
}
