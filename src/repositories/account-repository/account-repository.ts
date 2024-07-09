import {NodeRPCClient} from '@/common/clients/node-client';
import {IAccountRepository} from './types';
import {IndexerClient} from '@/common/clients/indexer-client/indexer-client';
import {
  TRANSACTIONS_QUERY,
  makeGRC20ReceivedTransactionsByAddressQuery,
  makeNativeTokenReceivedTransactionsByAddressQuery,
  makeNativeTokenSendTransactionsByAddressQuery,
  makeVMTransactionsByAddressQuery,
} from './query';
import {Transaction} from '@/types/data-type';
import {parseTokenAmount} from '@/common/utils/token.utility';
import {mapTransactionByRealm} from '../realm-repository.ts/mapper';
import {parseABCI} from '@gnolang/tm2-js-client';
import {parseABCIQueryNumberResponse} from '@/common/clients/node-client/utility';
import {
  mapReceivedTransactionByBankMsgSend,
  mapReceivedTransactionByMsgCall,
  mapSendTransactionByBankMsgSend,
  mapVMTransaction,
} from '../response/transaction.mapper';

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

  async getTransactions(minBlockHeight: number, maxBlockHeight: number): Promise<Transaction[]> {
    if (!this.indexerClient) {
      return [];
    }

    return this.indexerClient
      ?.query(TRANSACTIONS_QUERY)
      .then(result => result?.data?.transactions?.map(mapTransaction) || []);
  }

  async getGRC20ReceivedTransactionsByAddress(address: string): Promise<Transaction[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      ?.query(makeGRC20ReceivedTransactionsByAddressQuery(address))
      .then(result => result.data?.transactions || [])
      .then(transactions => transactions.map(mapReceivedTransactionByMsgCall));
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
