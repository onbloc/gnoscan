import { useMemo } from "react";
import { useGetBlockQuery, useGetBlockResultQuery, useGetLatestBlockHeightQuery } from "@/common/react-query/block";
import { getDateDiff, getLocalDateString } from "@/common/utils/date-util";
import { makeDisplayNumber, makeDisplayNumberWithDefault } from "@/common/utils/string-util";
import { decodeTransaction, makeTransactionMessageInfo } from "@/common/utils/transaction.utility";
import BigNumber from "bignumber.js";
import { GnoEvent, Transaction } from "@/types/data-type";
import { parseTokenAmount } from "@/common/utils/token.utility";
import { GNOTToken } from "../common/use-token-meta";
import { toBech32Address } from "@/common/utils/bech32.utility";
import { getDefaultMessageByBlockTransaction } from "@/repositories/utility";
import { BlockSummaryInfo } from "@/types/data-type";

export const useBlock = (height: number) => {
  const { data: latestBlockHeight } = useGetLatestBlockHeightQuery();
  const { data: block, isFetched, isError: isErrorBlockData } = useGetBlockQuery(height);
  const { data: blockResult, isFetched: isFetchedBlockResult } = useGetBlockResultQuery(height);

  const timeStamp = useMemo(() => {
    if (!block) {
      return {
        time: "-",
        passedTime: "",
      };
    }

    return {
      time: getLocalDateString(block.block_meta.header.time),
      passedTime: getDateDiff(block.block_meta.header.time),
    };
  }, [block]);

  const network = useMemo(() => {
    if (!block) {
      return "-";
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
      const defaultMessage = makeTransactionMessageInfo(getDefaultMessageByBlockTransaction(transaction.messages));
      const feeAmount = parseTokenAmount(transaction.fee?.gas_fee || "0ugnot");

      return {
        hash: transaction.hash,
        success: !result?.ResponseBase?.Error,
        numOfMessage: transaction.messages.length,
        type: defaultMessage?.type || "",
        packagePath: defaultMessage?.packagePath || "",
        functionName: defaultMessage?.functionName || "",
        blockHeight: blockHeight || 0,
        from: defaultMessage?.from || "",
        to: defaultMessage?.to || "",
        amount: defaultMessage?.amount || {
          value: "0",
          denom: GNOTToken.denom,
        },
        time: block?.block_meta.header.time || "",
        fee: {
          value: feeAmount.toString(),
          denom: GNOTToken.denom,
        },
      };
    });
  }, [transactions, blockResult]);

  const numberOfTransactions = useMemo(() => makeDisplayNumberWithDefault(block?.block.header.num_txs), [block]);

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
        : BigNumber(transactionGasInfo.gasUsed).dividedBy(transactionGasInfo.gasWanted).shiftedBy(2).toFixed(2);
    return `${gasUsed}/${gasWanted} (${rate}%)`;
  }, [transactionGasInfo]);

  const proposerAddress = useMemo(() => {
    if (!block) {
      return "-";
    }

    return Array.isArray(block.block.header.proposer_address)
      ? toBech32Address("g", block.block.header.proposer_address)
      : block.block.header.proposer_address;
  }, [block]);

  const events: GnoEvent[] = useMemo(() => {
    if (!blockResult) {
      return [];
    }

    return (
      (blockResult?.deliver_tx
        ?.flatMap(
          (result, index) =>
            result?.ResponseBase?.Events?.map((event, eventIndex) => {
              if (!block?.block.data.txs || !block?.block.data.txs?.[index]) {
                return null;
              }

              const transaction = decodeTransaction(block?.block.data.txs?.[index]);
              const eventId = transaction.hash + "_" + index + "_" + eventIndex;
              const caller = transaction?.messages?.[0]?.caller || "";
              return {
                id: eventId,
                transactionHash: transaction.hash,
                blockHeight: blockHeight || 0,
                type: event.type,
                packagePath: event.pkg_path,
                functionName: event.func,
                attrs: event.attrs,
                time: block.block.header.time,
                caller,
              };
            }) || [],
        )
        .filter(event => !!event) as GnoEvent[]) || []
    );
  }, [block?.block.data.txs, blockResult]);

  const isErrorBlock = useMemo(() => {
    if (!isFetched) return false;
    return block == null || isErrorBlockData;
  }, [block, isFetched, isErrorBlockData]);

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

  const blockSummaryInfo: BlockSummaryInfo = useMemo(() => {
    return {
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
    };
  }, [
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
  ]);

  return {
    isFetched,
    isFetchedBlockResult,
    block: blockSummaryInfo,
    isErrorBlock,
    events,
    transactionItems,
  };
};
