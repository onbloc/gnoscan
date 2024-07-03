import {useMemo} from 'react';
import {
  useGetBlockQuery,
  useGetBlockResultQuery,
  useGetLatestBlockHeightQuery,
} from '@/common/react-query/block';
import {toBech32Address} from '@/common/utils/bech32.utility';
import {getDateDiff, getLocalDateString} from '@/common/utils/date-util';
import {
  makeDisplayNumber,
  makeDisplayNumberWithDefault,
  makeDisplayTokenAmount,
} from '@/common/utils/string-util';
import {decodeTransaction, makeTransactionMessageInfo} from '@/common/utils/transaction.utility';
import BigNumber from 'bignumber.js';
import {Transaction} from '@/types/data-type';
import {parseTokenAmount} from '@/common/utils/token.utility';

export const useBlock = (height: number) => {
  const {data: latestBlockHeight} = useGetLatestBlockHeightQuery();
  const {data: block, isFetched} = useGetBlockQuery(height);
  const {data: blockResult, isFetched: isFetchedBlockResult} = useGetBlockResultQuery(height);

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

  const transactionItems: Transaction[] = useMemo(() => {
    if (!transactions || !blockResult) {
      return [];
    }
    return transactions?.map((transaction, index) => {
      const result = blockResult.deliver_tx.find((_, resultIndex) => index === resultIndex);
      const firstMessage = makeTransactionMessageInfo(transaction.messages[0]);
      const feeAmount = parseTokenAmount(transaction.fee?.gasFee || '0ugnot');

      return {
        hash: transaction.hash,
        success: !result?.ResponseBase?.Error,
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
      };
    });
  }, [transactions, blockResult]);

  const numberOfTransactions = useMemo(
    () => makeDisplayNumberWithDefault(block?.block.header.num_txs),
    [block],
  );

  const transactionGasInfo = useMemo(() => {
    if (!blockResult?.deliver_tx) {
      return {
        gasWanted: 0,
        gasUsed: 0,
      };
    }

    return blockResult.deliver_tx.reduce<{
      gasWanted: number;
      gasUsed: number;
    }>(
      (accum, current) => {
        accum.gasUsed += Number(current.GasUsed);
        accum.gasWanted += Number(current.GasWanted);
        return accum;
      },
      {
        gasWanted: 0,
        gasUsed: 0,
      },
    );
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

  const proposerAddress = useMemo(() => {
    if (!block) {
      return '-';
    }
    return toBech32Address('g', block.block.header.proposer_address);
  }, [block]);

  const hasPreviousBlock = useMemo(() => {
    if (!block) {
      return false;
    }
    return Number(block.block.header.height) > 1;
  }, [block?.block_meta.header.height]);

  const hasNextBlock = useMemo(() => {
    if (!block || !latestBlockHeight) {
      return false;
    }
    return Number(block.block.header.height) < latestBlockHeight;
  }, [block?.block_meta.header.height, latestBlockHeight]);

  return {
    isFetched,
    isFetchedBlockResult,
    block: {
      timeStamp,
      network,
      blockHeight,
      blockHeightStr,
      transactions,
      numberOfTransactions,
      gas,
      proposerAddress,
      hasPreviousBlock,
      hasNextBlock,
    },
    transactionItems,
  };
};
