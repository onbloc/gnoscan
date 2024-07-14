import {Transaction} from '@/types/data-type';
import {AddPackageValue, MsgCallValue, RealmTransaction} from './types';
import {toNumber, toString} from '@/common/utils/string-util';

export function isAddPackageMessageValue(
  messageValue: AddPackageValue | MsgCallValue,
): messageValue is AddPackageValue {
  return messageValue.__typename === 'MsgAddPackage';
}

export function mapTransactionByRealm(tx: RealmTransaction): Transaction {
  const firstMessage = tx.messages[0];
  if (isAddPackageMessageValue(firstMessage.value)) {
    return {
      hash: tx.hash,
      success: tx.success,
      numOfMessage: tx.messages.length,
      type: '/vm.m_addpkg',
      packagePath: toString(firstMessage.value.package?.path),
      gasUsed: {
        value: `${tx.gas_used || 0}`,
        denom: 'ugnot',
      },
      functionName: 'AddPkg',
      blockHeight: toNumber(tx.block_height),
      from: toString(firstMessage.value.creator),
      amount: {
        value: '0',
        denom: 'ugnot',
      },
      time: '',
      fee: {
        value: toString(tx.gas_fee.amount),
        denom: 'ugnot',
      },
      messages: tx.messages,
    };
  }

  if (tx.messages.length === 1 && firstMessage.value.func === 'Transfer') {
    return {
      hash: tx.hash,
      success: tx.success,
      numOfMessage: tx.messages.length,
      type: '/vm.m_call',
      packagePath: toString(firstMessage.value.pkg_path),
      functionName: toString(firstMessage.value.func),
      blockHeight: toNumber(tx.block_height),
      from: toString(firstMessage.value.caller),
      to: firstMessage.value.args?.[1] || '',
      amount: {
        value: toString(firstMessage.value.args?.[1] || 0),
        denom: firstMessage.value.pkg_path || '',
      },
      time: '',
      fee: {
        value: toString(tx.gas_fee.amount),
        denom: 'ugnot',
      },
      messages: tx.messages,
    };
  }

  return {
    hash: tx.hash,
    success: tx.success,
    numOfMessage: tx.messages.length,
    type: '/vm.m_call',
    packagePath: toString(firstMessage.value.pkg_path),
    functionName: toString(firstMessage.value.func),
    blockHeight: toNumber(tx.block_height),
    from: toString(firstMessage.value.caller),
    amount: {
      value: toString(firstMessage.value.send),
      denom: 'ugnot',
    },
    time: '',
    fee: {
      value: toString(tx.gas_fee.amount),
      denom: 'ugnot',
    },
    messages: tx.messages,
  };
}
