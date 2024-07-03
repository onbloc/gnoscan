import {
  useGetTransactionBlockHeightQuery,
  useGetTransactionsQuery,
} from '@/common/react-query/transaction';
import {useMemo, useState} from 'react';
import {useBlock} from '../blocks/use-block';
import {getDateDiff, getLocalDateString} from '@/common/utils/date-util';
import {decodeTransaction, makeTransactionMessageInfo} from '@/common/utils/transaction.utility';
import {Transaction} from '@/types/data-type';
import {
  makeDisplayNumber,
  makeDisplayNumberWithDefault,
  makeDisplayTokenAmount,
} from '@/common/utils/string-util';
import BigNumber from 'bignumber.js';
import {toBech32Address} from '@/common/utils/bech32.utility';
import {parseTokenAmount} from '@/common/utils/token.utility';

export const useTransaction = (hash: string) => {
  const {data, isFetched} = useGetTransactionBlockHeightQuery(hash);

  const block = useMemo(() => {
    return data?.block || null;
  }, [data?.block]);

  const blockResult = useMemo(() => {
    return data?.blockResult || null;
  }, [data?.blockResult]);

  const timeStamp = useMemo(() => {
    if (!block) {
      return {
        time: '-',
        passedTime: '',
      };
    }

    return {
      time: getLocalDateString(block.block_meta.header.time),
      passedTime: getDateDiff(block.block_meta.header.time),
    };
  }, [block]);

  const network = useMemo(() => {
    if (!block) {
      return '-';
    }
    return block.block.header.chain_id;
  }, [block]);

  const blockHeight = useMemo(() => {
    if (!block) {
      return null;
    }
    return Number(block.block.header.height);
  }, [block]);

  const blockHeightStr = useMemo(() => blockHeight?.toString(), [blockHeight]);

  const transactions = useMemo(() => {
    if (!block) {
      return [];
    }
    return block.block.data.txs?.map(decodeTransaction);
  }, [block]);

  const txResult = useMemo(() => {
    if (!transactions || !blockResult) {
      return null;
    }

    const txIndex = transactions.findIndex((tx: any) => tx.hash === hash);
    return blockResult.deliver_tx.find((_: any, index: number) => txIndex === index) || null;
  }, [transactions, blockResult]);

  const transactionItem: Transaction | null = useMemo(() => {
    const transaction = transactions.find((tx: any) => tx.hash === hash) || null;
    if (!transaction || !txResult) {
      return null;
    }

    const firstMessage = makeTransactionMessageInfo(transaction.messages[0]);
    const feeAmount = parseTokenAmount(transaction.fee?.gasFee || '0ugnot');

    return {
      hash: transaction.hash,
      messages: transaction?.messages,
      success: !txResult?.ResponseBase?.Error,
      numOfMessage: transaction.messages.length,
      type: firstMessage?.type || '',
      packagePath: firstMessage?.packagePath || '',
      functionName: firstMessage?.functionName || '',
      blockHeight: blockHeight || 0,
      from: firstMessage?.from || '',
      to: firstMessage?.to || '',
      amount: firstMessage?.amount || {
        value: '0',
        denom: 'GNOT',
      },
      time: block?.block_meta.header.time || '',
      fee: {
        value: makeDisplayTokenAmount(feeAmount) || '0',
        denom: 'GNOT',
      },
      memo: transaction.memo || '-',
      rawContent: JSON.stringify(
        {
          messages: transaction?.messages || '',
          fee: transaction?.fee || '',
          signatures: transaction?.signatures || '',
          memo: transaction?.memo || '',
        },
        null,
        2,
      ),
    };
  }, [transactions, txResult]);

  const transactionGasInfo = useMemo(() => {
    if (!txResult) {
      return {
        gasWanted: 0,
        gasUsed: 0,
      };
    }
    return {
      gasWanted: Number(txResult.GasWanted),
      gasUsed: Number(txResult.GasUsed),
    };
  }, [blockResult]);

  const gas = useMemo(() => {
    const gasWanted = makeDisplayNumber(transactionGasInfo.gasWanted);
    const gasUsed = makeDisplayNumber(transactionGasInfo.gasUsed);
    const rate =
      transactionGasInfo.gasWanted === 0
        ? 0
        : BigNumber(transactionGasInfo.gasUsed)
            .dividedBy(transactionGasInfo.gasWanted)
            .shiftedBy(2)
            .toFixed(2);
    return `${gasUsed}/${gasWanted} (${rate}%)`;
  }, [transactionGasInfo]);

  return {
    network,
    timeStamp,
    gas,
    transactionItem,
    isFetched,
  };
};
