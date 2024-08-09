import {parseABCI} from '@gnolang/tm2-js-client';
import {NodeRPCClient} from '@/common/clients/node-client';
import {IndexerClient} from '@/common/clients/indexer-client/indexer-client';
import {parseABCIQueryNumberResponse} from '@/common/clients/node-client/utility';
import {Transaction} from '@/types/data-type';

import {
  mapReceivedTransactionByBankMsgSend,
  mapReceivedTransactionByMsgCall,
  mapSendTransactionByBankMsgSend,
  mapVMTransaction,
} from '../response/transaction.mapper';
import {AccountTransactionResponse, IAccountRepository} from './types';
import {
  makeGRC20ReceivedTransactionsByAddressQuery,
  makeNativeTokenReceivedTransactionsByAddressQuery,
  makeNativeTokenSendTransactionsByAddressQuery,
  makeVMTransactionsByAddressQuery,
} from './query';

export class AccountRepository implements IAccountRepository {
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

  async getAccountTransactions(): Promise<AccountTransactionResponse> {
    throw new Error('not supported function');
  }

  async getGRC20ReceivedTransactionsByAddress(address: string): Promise<Transaction[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      ?.query<any>(makeGRC20ReceivedTransactionsByAddressQuery(address))
      .then(result => result.data?.transactions || [])
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
