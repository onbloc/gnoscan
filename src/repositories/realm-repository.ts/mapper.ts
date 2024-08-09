import {Transaction} from '@/types/data-type';
import {AddPackageValue, MsgCallValue, RealmTransaction} from './types';
import {toNumber, toString} from '@/common/utils/string-util';
import {getDefaultMessage} from '../utility';

export function isAddPackageMessageValue(
  messageValue: AddPackageValue | MsgCallValue,
): messageValue is AddPackageValue {
  return messageValue.__typename === 'MsgAddPackage';
}

export function mapTransactionByRealm(tx: RealmTransaction): Transaction {
  const defaultMessage = getDefaultMessage(tx.messages);
  if (isAddPackageMessageValue(defaultMessage.value)) {
    return {
      hash: tx.hash,
      success: tx.success,
      numOfMessage: tx.messages.length,
      type: '/vm.m_addpkg',
      packagePath: toString(defaultMessage.value.package?.path),
      gasUsed: {
        value: `${tx.gas_used || 0}`,
        denom: 'ugnot',
      },
      functionName: 'AddPkg',
      blockHeight: toNumber(tx.block_height),
      from: toString(defaultMessage.value.creator),
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

  if (tx.messages.length === 1 && defaultMessage.value.func === 'Transfer') {
    return {
      hash: tx.hash,
      success: tx.success,
      numOfMessage: tx.messages.length,
      type: '/vm.m_call',
      packagePath: toString(defaultMessage.value.pkg_path),
      functionName: toString(defaultMessage.value.func),
      blockHeight: toNumber(tx.block_height),
      from: toString(defaultMessage.value.caller),
      to: defaultMessage.value.args?.[1] || '',
      amount: {
        value: toString(defaultMessage.value.args?.[1] || 0),
        denom: defaultMessage.value.pkg_path || '',
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
    packagePath: toString(defaultMessage.value.pkg_path),
    functionName: toString(defaultMessage.value.func),
    blockHeight: toNumber(tx.block_height),
    from: toString(defaultMessage.value.caller),
    amount: {
      value: toString(defaultMessage.value.send),
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
