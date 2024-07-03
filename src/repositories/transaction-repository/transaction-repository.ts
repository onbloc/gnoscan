import {NodeRPCClient} from '@/common/clients/node-client';
import {ITransactionRepository} from './types';
import {IndexerClient} from '@/common/clients/indexer-client/indexer-client';
import {gql} from '@apollo/client';
import {TRANSACTIONS_QUERY, makeTransactionHashQuery} from './query';
import {Transaction} from '@/types/data-type';
import {parseTokenAmount} from '@/common/utils/token.utility';
import {makeDisplayTokenAmount} from '@/common/utils/string-util';

function mapTransaction(data: any): Transaction {
  const firstMessage = data.messages[0]?.value;
  const amountValue =
    firstMessage?.amount || firstMessage?.send || firstMessage?.deposit || '0ugnot';
  return {
    hash: data.hash,
    success: data.success === true,
    numOfMessage: data.messages.length,
    type: firstMessage?.__typename,
    packagePath: firstMessage?.package?.path || firstMessage?.pkg_path || firstMessage?.__typename,
    functionName: firstMessage?.func || firstMessage?.__typename,
    blockHeight: data.block_height,
    from: firstMessage?.caller || firstMessage?.creator || firstMessage?.from_address,
    to: firstMessage?.to_address,
    amount: {
      value: makeDisplayTokenAmount(parseTokenAmount(amountValue)) || '0',
      denom: 'GNOT',
    },
    time: '',
    fee: {
      value: makeDisplayTokenAmount(data?.gas_fee?.amount) || '0',
      denom: 'GNOT',
    },
  };
}

export class TransactionRepository implements ITransactionRepository {
  constructor(
    private nodeRPCClient: NodeRPCClient | null,
    private indexerClient: IndexerClient | null,
  ) {}

  async getTransactions(minBlockHeight: number, maxBlockHeight: number): Promise<Transaction[]> {
    if (!this.indexerClient) {
      return [];
    }

    return this.indexerClient
      ?.query(TRANSACTIONS_QUERY)
      .then(result => result.data.transactions.map(mapTransaction));
  }

  async getTransactionBlockHeight(transactionHash: string): Promise<number | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      ?.query(makeTransactionHashQuery(transactionHash))
      .then(result =>
        result.data.transactions.length > 0 ? result.data.transactions[0].block_height : null,
      );
  }
}
