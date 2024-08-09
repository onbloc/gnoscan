import {Transaction} from '@/types/data-type';
import {
  AddPackageValue,
  BankSendValue,
  MsgCallValue,
  MsgRunValue,
  TransactionWithEvent,
} from './transaction.types';
import {toNumber, toString} from '@/common/utils/string-util';
import {GNOTToken} from '@/common/hooks/common/use-token-meta';
import {parseTokenAmount} from '@/common/utils/token.utility';
import {getDefaultMessage} from '../utility';

export function mapSendTransactionByBankMsgSend(
  tx: TransactionWithEvent<BankSendValue>,
): Transaction {
  const defaultMessage = getDefaultMessage(tx.messages);

  return {
    hash: tx.hash,
    success: tx.success,
    numOfMessage: tx.messages.length,
    type: '/bank.MsgSend',
    packagePath: '/bank.MsgSend',
    functionName: 'Transfer',
    blockHeight: toNumber(tx.block_height),
    from: toString(defaultMessage.value.from_address),
    to: toString(defaultMessage.value.to_address),
    amount: {
      value: '0',
      denom: GNOTToken.denom,
    },
    amountOut: {
      value: parseTokenAmount(toString(defaultMessage.value.amount)).toString(),
      denom: GNOTToken.denom,
    },
    time: '',
    fee: {
      value: toString(tx.gas_fee.amount),
      denom: GNOTToken.denom,
    },
    messages: tx.messages,
    events:
      tx?.response?.events?.map((event, index) => ({
        transactionHash: tx.hash,
        id: tx.hash + '_' + index,
        caller: defaultMessage.value.from_address,
        attrs: event.attrs,
        blockHeight: tx.block_height,
        functionName: event.func,
        packagePath: event.pkg_path,
        type: event.type,
        time: '',
      })) || [],
  };
}

export function mapReceivedTransactionByMsgCall(
  tx: TransactionWithEvent<MsgCallValue>,
): Transaction {
  const defaultMessage = getDefaultMessage(tx.messages);

  return {
    hash: tx.hash,
    success: tx.success,
    numOfMessage: tx.messages.length,
    type: '/vm.m_call',
    packagePath: toString(defaultMessage.value.pkg_path),
    functionName: 'Transfer',
    blockHeight: toNumber(tx.block_height),
    from: toString(defaultMessage.value.caller),
    to: toString(defaultMessage.value.args?.[0]),
    amount: {
      value: toString(defaultMessage.value.args?.[1] || 0),
      denom: toString(defaultMessage.value.pkg_path),
    },
    amountOut: {
      value: '0',
      denom: toString(defaultMessage.value.pkg_path),
    },
    time: '',
    fee: {
      value: toString(tx.gas_fee.amount),
      denom: GNOTToken.denom,
    },
    messages: tx.messages,
    events:
      tx?.response?.events?.map((event, index) => ({
        transactionHash: tx.hash,
        id: tx.hash + '_' + index,
        caller: toString(defaultMessage.value.caller),
        attrs: event.attrs,
        blockHeight: tx.block_height,
        functionName: event.func,
        packagePath: event.pkg_path,
        type: event.type,
        time: '',
      })) || [],
  };
}

export function mapReceivedTransactionByBankMsgSend(
  tx: TransactionWithEvent<BankSendValue>,
): Transaction {
  const defaultMessage = getDefaultMessage(tx.messages);

  return {
    hash: tx.hash,
    success: tx.success,
    numOfMessage: tx.messages.length,
    type: '/bank.MsgSend',
    packagePath: '/bank.MsgSend',
    functionName: 'Transfer',
    blockHeight: toNumber(tx.block_height),
    from: toString(defaultMessage.value.from_address),
    to: toString(defaultMessage.value.to_address),
    amount: {
      value: parseTokenAmount(defaultMessage.value.amount).toString(),
      denom: GNOTToken.denom,
    },
    amountOut: {
      value: '0',
      denom: GNOTToken.denom,
    },
    time: '',
    fee: {
      value: toString(tx.gas_fee.amount),
      denom: GNOTToken.denom,
    },
    messages: tx.messages,
    events:
      tx?.response?.events?.map((event, index) => ({
        transactionHash: tx.hash,
        id: tx.hash + '_' + index,
        caller: defaultMessage.value.from_address,
        attrs: event.attrs,
        blockHeight: tx.block_height,
        functionName: event.func,
        packagePath: event.pkg_path,
        type: event.type,
        time: '',
      })) || [],
  };
}

export function mapVMTransaction(
  tx: TransactionWithEvent<AddPackageValue | MsgRunValue | MsgCallValue>,
): Transaction {
  const defaultMessage = getDefaultMessage(tx.messages);

  if (defaultMessage.value.__typename === 'MsgAddPackage') {
    const messageValue = defaultMessage.value as AddPackageValue;
    return {
      hash: tx.hash,
      success: tx.success,
      numOfMessage: tx.messages.length,
      type: '/vm.add_pkg',
      packagePath: toString(messageValue.package?.path),
      functionName: 'AddPkg',
      blockHeight: toNumber(tx.block_height),
      from: toString(messageValue.creator),
      amount: {
        value: toString(parseTokenAmount(messageValue.deposit || '0')),
        denom: GNOTToken.denom,
      },
      amountOut: {
        value: '0',
        denom: GNOTToken.denom,
      },
      time: '',
      gasUsed: tx?.gas_used
        ? {
            value: toString(tx.gas_used || 0),
            denom: GNOTToken.denom,
          }
        : undefined,
      fee: {
        value: toString(tx.gas_fee.amount),
        denom: GNOTToken.denom,
      },
      messages: tx.messages,
      events:
        tx?.response?.events?.map((event, index) => ({
          transactionHash: tx.hash,
          id: tx.hash + '_' + index,
          caller: toString(messageValue.creator),
          attrs: event.attrs,
          blockHeight: tx.block_height,
          functionName: event.func,
          packagePath: event.pkg_path,
          type: event.type,
          time: '',
        })) || [],
    };
  }

  if (defaultMessage.value.__typename === 'MsgCall') {
    const messageValue = defaultMessage.value as MsgCallValue;
    const isTransfer = messageValue.func === 'Transfer';

    return {
      hash: tx.hash,
      success: tx.success,
      numOfMessage: tx.messages.length,
      type: '/vm.m_call',
      packagePath: toString(messageValue.pkg_path),
      functionName: isTransfer ? 'Transfer' : toString(messageValue.func),
      blockHeight: toNumber(tx.block_height),
      from: toString(messageValue.caller),
      amount: {
        value: '0',
        denom: isTransfer ? toString(messageValue.pkg_path) : GNOTToken.denom,
      },
      amountOut: {
        value: isTransfer
          ? toString(messageValue.args?.[1] || 0)
          : toString(parseTokenAmount(messageValue.send || '0')),
        denom: isTransfer ? toString(messageValue.pkg_path) : GNOTToken.denom,
      },
      time: '',
      fee: {
        value: toString(tx.gas_fee.amount),
        denom: GNOTToken.denom,
      },
      messages: tx.messages,
      events:
        tx?.response?.events?.map((event, index) => ({
          transactionHash: tx.hash,
          id: tx.hash + '_' + index,
          caller: messageValue.caller || '',
          attrs: event.attrs,
          blockHeight: tx.block_height,
          functionName: event.func,
          packagePath: event.pkg_path,
          type: event.type,
          time: '',
        })) || [],
    };
  }
  const messageValue = defaultMessage.value as MsgRunValue;

  return {
    hash: tx.hash,
    success: tx.success,
    numOfMessage: tx.messages.length,
    type: '/vm.m_run',
    packagePath: 'MsgRun',
    functionName: 'MsgRun',
    blockHeight: toNumber(tx.block_height),
    from: toString(messageValue.caller),
    amount: {
      value: toString(0),
      denom: GNOTToken.denom,
    },
    amountOut: {
      value: '0',
      denom: GNOTToken.denom,
    },
    time: '',
    fee: {
      value: toString(tx.gas_fee.amount),
      denom: GNOTToken.denom,
    },
    messages: tx.messages,
    events:
      tx?.response?.events?.map((event, index) => ({
        transactionHash: tx.hash,
        id: tx.hash + '_' + index,
        caller: toString(messageValue.caller),
        attrs: event.attrs,
        blockHeight: tx.block_height,
        functionName: event.func,
        packagePath: event.pkg_path,
        type: event.type,
        time: '',
      })) || [],
  };
}
