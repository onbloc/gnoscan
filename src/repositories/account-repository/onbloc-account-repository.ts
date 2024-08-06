import {parseABCI} from '@gnolang/tm2-js-client';
import {NodeRPCClient} from '@/common/clients/node-client';
import {IndexerClient} from '@/common/clients/indexer-client/indexer-client';
import {parseABCIQueryNumberResponse} from '@/common/clients/node-client/utility';
import {parseTokenAmount} from '@/common/utils/token.utility';
import {Transaction} from '@/types/data-type';

import {
  mapReceivedTransactionByBankMsgSend,
  mapReceivedTransactionByMsgCall,
  mapSendTransactionByBankMsgSend,
  mapVMTransaction,
} from '../response/transaction.mapper';
import {AccountTransactionResponse, IAccountRepository} from './types';
import {
  makeAccountTransactionsQuery,
  makeGRC20ReceivedTransactionsByAddressQuery,
  makeNativeTokenReceivedTransactionsByAddressQuery,
  makeNativeTokenSendTransactionsByAddressQuery,
  makeVMTransactionsByAddressQuery,
} from './onbloc-query';

export class OnblocAccountRepository implements IAccountRepository {
  constructor(
    private nodeRPCClient: NodeRPCClient | null,
    private indexerClient: IndexerClient | null,
  ) {}

  async getNativeTokensBalances(address: string): Promise<any> {
    if (!this.nodeRPCClient) {
      return null;
    }

    return this.nodeRPCClient
      .abciQueryBankBalances(address)
      .then(response =>
        response.response.ResponseBase.Data ? parseABCI(response.response.ResponseBase.Data) : null,
      );
  }

  async getGRC20TokensBalances(address: string, tokenPaths: string[]): Promise<any> {
    if (!this.nodeRPCClient) {
      return null;
    }

    const fetchers = tokenPaths.map(path =>
      this.nodeRPCClient?.abciQueryVMQueryEvaluation(path, 'BalanceOf', [address]).then(response =>
        response?.response?.ResponseBase?.Data
          ? {
              denom: path,
              value: parseABCIQueryNumberResponse(response.response.ResponseBase.Data).toString(),
            }
          : null,
      ),
    );
    return Promise.all(fetchers).then(results => results.filter(result => !!result));
  }

  async getAccountTransactions(
    address: string,
    cursor: string | null,
  ): Promise<AccountTransactionResponse> {
    const transactions: Transaction[] = [];
    const pageInfo = {
      last: null,
      hasNext: false,
    };

    if (!this.indexerClient) {
      return {
        transactions,
        pageInfo,
      };
    }

    try {
      const response = await this.indexerClient?.pageQuery(
        makeAccountTransactionsQuery(address, cursor),
      );
      const transactionEdges = response?.data?.transactions.edges;
      const pageInfo = response?.data?.transactions.pageInfo;
      pageInfo.last = pageInfo?.last || null;
      pageInfo.hasNext = pageInfo?.hasNext || false;
      const mappedTransactions = transactionEdges
        .map((edge: any) => edge.transaction)
        .map(tx => {
          const firstMessage = tx.messages[0].value;
          const typename = firstMessage.__typename;
          switch (typename) {
            case 'BankMsgSend':
              if (firstMessage?.from_address === address) {
                return mapSendTransactionByBankMsgSend(tx);
              }
              return mapReceivedTransactionByBankMsgSend(tx);
            case 'MsgCall':
              if (firstMessage?.func === 'Transfer') {
                if (firstMessage.args?.[0] === address) {
                  return mapReceivedTransactionByMsgCall(tx);
                }
              }
            default:
              return mapVMTransaction(tx);
          }
        });
      transactions.push(...mappedTransactions);
    } catch (e) {
      console.error(e);
      return {
        transactions,
        pageInfo,
      };
    }

    return {
      transactions,
      pageInfo,
    };
  }

  async getGRC20ReceivedTransactionsByAddress(address: string): Promise<Transaction[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      ?.pageQuery(makeGRC20ReceivedTransactionsByAddressQuery(address))
      .then(result => result.data?.transactions.edges.map(edge => edge.transaction) || [])
      .then(transactions =>
        transactions
          .map(mapReceivedTransactionByMsgCall)
          .filter((tx: Transaction) => tx.to === address),
      );
  }

  async getNativeTokenSendTransactionsByAddress(address: string): Promise<Transaction[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      ?.query(makeNativeTokenSendTransactionsByAddressQuery(address))
      .then(result => result.data?.transactions || [])
      .then(transactions => transactions.map(mapSendTransactionByBankMsgSend));
  }

  async getNativeTokenReceivedTransactionsByAddress(
    address: string,
  ): Promise<Transaction[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      ?.query(makeNativeTokenReceivedTransactionsByAddressQuery(address))
      .then(result => result.data?.transactions || [])
      .then(transactions => transactions.map(mapReceivedTransactionByBankMsgSend));
  }

  async getVMTransactionsByAddress(address: string): Promise<Transaction[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      ?.query(makeVMTransactionsByAddressQuery(address))
      .then(result => result.data?.transactions || [])
      .then(transactions => transactions.map(mapVMTransaction));
  }
}
