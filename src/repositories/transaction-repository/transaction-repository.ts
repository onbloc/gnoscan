import {IndexerClient} from '@/common/clients/indexer-client/indexer-client';
import {PageOption} from '@/common/clients/indexer-client/types';
import {NodeRPCClient} from '@/common/clients/node-client';
import {parseTokenAmount} from '@/common/utils/token.utility';
import {TotalTransactionStatInfo, Transaction} from '@/types/data-type';
import {makeTransactionsQuery} from '../account-repository/query';
import {
  mapTransactionByRealm,
  mapTransactionTypeNameByMessage,
} from '../realm-repository.ts/mapper';
import {getDefaultMessage} from '../utility';
import {
  makeGRC20ReceivedTransactionsByAddressQuery,
  makeSimpleTransactionsByFromHeight,
  makeTransactionHashQuery,
} from './query';
import {ITransactionRepository} from './types';

function mapTransaction(data: any): Transaction {
  const defaultMessage = getDefaultMessage(data.messages[0])?.value;
  const amountValue =
    defaultMessage?.amount || defaultMessage?.send || defaultMessage?.deposit || '0ugnot';
  const typeName = mapTransactionTypeNameByMessage(defaultMessage);
  return {
    hash: data.hash,
    success: data.success === true,
    numOfMessage: data.messages.length,
    type: typeName,
    packagePath: defaultMessage?.package?.path || defaultMessage?.pkg_path || typeName,
    functionName: defaultMessage?.func || typeName,
    blockHeight: data.block_height,
    from: defaultMessage?.caller || defaultMessage?.creator || defaultMessage?.from_address,
    to: defaultMessage?.to_address,
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
      const results: Transaction[] = [];
      let fromBlockHeight = 1;
      let hasNext = true;
      try {
        while (hasNext === true) {
          const response = await this.indexerClient?.query(makeTransactionsQuery(fromBlockHeight));
          const transactions = response?.data?.transactions || [];
          hasNext = Array.isArray(response.errors) && transactions.length > 0;
          if (hasNext) {
            fromBlockHeight = transactions[transactions.length - 1].block_height + 1;
          }
          results.push(...transactions.map(mapTransaction));
        }
      } catch (e) {
        console.error(e);
        return [];
      }

      return results;
    }

    return this.indexerClient
      ?.queryWithOptions(
        makeTransactionsQuery(1),
        pageOption || {
          page: 0,
          pageSize: 0,
        },
      )
      .then(result => result?.data?.transactions?.map(mapTransaction) || []);
  }

  async getTransactionsPage(): Promise<null> {
    return null;
  }

  getTransactionStatInfo(): Promise<TotalTransactionStatInfo> {
    throw new Error('not supported');
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
      return this.indexerClient?.query(makeTransactionHashQuery(transactionHash)).then(result => {
        const transactions = result?.data?.transactions || [];
        if (transactions.length === 0) {
          return null;
        }
        return transactions[0].block_height;
      });
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

    const results: any[] = [];
    let fromBlockHeight = height;
    let hasNext = true;
    try {
      while (hasNext === true) {
        const response = await this.indexerClient?.query(
          makeSimpleTransactionsByFromHeight(fromBlockHeight),
        );
        const transactions = response?.data?.transactions || [];
        hasNext = Array.isArray(response.errors) && transactions.length > 0;
        if (hasNext) {
          fromBlockHeight = transactions[transactions.length - 1].block_height + 1;
        }
        results.push(...transactions);
      }
    } catch (e) {
      console.error(e);
      return [];
    }

    return results;
  }

  async getMonthlyTransactionStatInfo(): Promise<null> {
    return null;
  }
}
