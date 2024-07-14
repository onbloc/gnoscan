import {NodeRPCClient} from '@/common/clients/node-client';
import {ITransactionRepository} from './types';
import {IndexerClient} from '@/common/clients/indexer-client/indexer-client';
import {
  TRANSACTIONS_QUERY,
  makeGRC20ReceivedTransactionsByAddressQuery,
  makeSimpleTransactionsByFromHeight,
  makeTransactionHashQuery,
} from './query';
import {Transaction} from '@/types/data-type';
import {parseTokenAmount} from '@/common/utils/token.utility';
import {mapTransactionByRealm} from '../realm-repository.ts/mapper';
import {PageOption} from '@/common/clients/indexer-client/types';

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
      value: parseTokenAmount(amountValue).toString() || '0',
      denom: 'ugnot',
    },
    time: '',
    fee: {
      value: data?.gas_fee?.amount || '0',
      denom: 'ugnot',
    },
  };
}

export class TransactionRepository implements ITransactionRepository {
  constructor(
    private nodeRPCClient: NodeRPCClient | null,
    private indexerClient: IndexerClient | null,
  ) {}

  async getTransactions(
    minBlockHeight: number,
    maxBlockHeight: number,
    pageOption?: PageOption,
  ): Promise<Transaction[]> {
    if (!this.indexerClient) {
      return [];
    }

    if (!pageOption) {
      return this.indexerClient
        ?.query(TRANSACTIONS_QUERY)
        .then(result => result?.data?.transactions?.map(mapTransaction) || []);
    }

    return this.indexerClient
      ?.queryWithOptions(
        TRANSACTIONS_QUERY,
        pageOption || {
          page: 0,
          pageSize: 0,
        },
      )
      .then(result => result?.data?.transactions?.map(mapTransaction) || []);
  }

  async getTransactionsPage(
    minBlockHeight: number,
    maxBlockHeight: number,
    pageOption: PageOption,
  ): Promise<Transaction[]> {
    if (!this.indexerClient || !pageOption) {
      return [];
    }

    return this.indexerClient
      ?.queryWithOptions(
        TRANSACTIONS_QUERY,
        pageOption || {
          page: 0,
          pageSize: 0,
        },
      )
      .then(result => result?.data?.transactions?.map(mapTransaction) || []);
  }

  async getTransactionBlockHeight(transactionHash: string): Promise<number | null> {
    if (this.nodeRPCClient) {
      const height = await this.nodeRPCClient
        .tx(transactionHash)
        .then(response => Number(response.height))
        .catch(() => null);
      if (height) {
        return height;
      }
    }

    if (this.indexerClient) {
      return this.indexerClient
        ?.query(makeTransactionHashQuery(transactionHash))
        .then(result =>
          result.data.transactions.length > 0 ? result.data.transactions[0].block_height : null,
        );
    }

    return null;
  }

  async getGRC20ReceivedTransactionsByAddress(
    address: string,
    pageOption?: PageOption,
  ): Promise<Transaction[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      ?.query(makeGRC20ReceivedTransactionsByAddressQuery(address), pageOption)
      .then(result => result.data?.transactions || [])
      .then(transactions => transactions.map(mapTransactionByRealm));
  }

  async getNativeTokenReceivedTransactionsByAddress(
    address: string,
    pageOption?: PageOption,
  ): Promise<Transaction[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      ?.query(makeGRC20ReceivedTransactionsByAddressQuery(address), pageOption)
      .then(result => result.data?.transactions || [])
      .then(transactions => transactions.map(mapTransactionByRealm));
  }

  async getSimpleTransactionsByFromHeight(height: number): Promise<any[]> {
    if (!this.indexerClient) {
      return [];
    }

    return this.indexerClient
      ?.query(makeSimpleTransactionsByFromHeight(height))
      .then(result => result.data?.transactions || []);
  }
}
