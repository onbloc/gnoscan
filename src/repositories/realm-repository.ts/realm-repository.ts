import {IndexerClient} from '@/common/clients/indexer-client/indexer-client';
import {
  AddPackageValue,
  GRC20Info,
  IRealmRepository,
  MsgCallValue,
  RealmFunction,
  RealmTransaction,
  RealmTransactionInfo,
} from './types';
import {NodeRPCClient} from '@/common/clients/node-client';
import {parseABCI} from '@gnolang/tm2-js-client';
import {toBech32AddressByPackagePath} from '@/common/utils/bech32.utility';
import {parseTokenAmount} from '@/common/utils/token.utility';
import {Amount, Board} from '@/types/data-type';
import {isAddPackageMessageValue} from './mapper';
import {
  GRC20_FUNCTIONS,
  parseBankerGRC20InfoByFile,
  parseGRC20InfoByFile,
} from '@/common/utils/realm.utility';
import {GNOTToken} from '@/common/hooks/common/use-token-meta';
import {TransactionWithEvent} from '../response/transaction.types';
import {
  extractStringFromResponse,
  parseABCIQueryNumberResponse,
} from '@/common/clients/node-client/utility';
import {PageInfo, PageOption} from '@/common/clients/indexer-client/types';
import {
  makeRealmTransactionInfoQuery,
  makeTokenQuery,
  makeTokensQuery,
  makeUsernameQuery,
  makeRealmCallTransactionsWithArgsQuery,
  makeRealmPackagesQuery,
  makeRealmQuery,
  makeRealmsQuery,
  makeRealmTransactionInfosQuery,
  makeRealmTransactionsQuery,
  makeRealmTransactionsWithArgsQuery,
} from './query';
import BigNumber from 'bignumber.js';

export class RealmRepository implements IRealmRepository {
  constructor(
    private nodeClient: NodeRPCClient | null,
    private indexerClient: IndexerClient | null,
  ) {}

  async getLatestRealms(pageOption?: PageOption): Promise<any | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient.query(makeRealmsQuery(), pageOption);
  }

  async getRealms(pageOption?: PageOption): Promise<any | null> {
    if (!this.indexerClient) {
      return null;
    }

    const response = await this.indexerClient
      .query(makeRealmsQuery(), pageOption)
      .catch(() => null);
    if (!response) {
      return null;
    }

    return response.data?.transactions;
  }

  async getRealm(realmPath: string): Promise<RealmTransaction | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient.query(makeRealmQuery(realmPath)).then(result => {
      if (!result?.data?.transactions || result?.data?.transactions.length === 0) {
        return null;
      }
      return result?.data?.transactions[0];
    });
  }

  async getRealmBalance(realmPath: string): Promise<Amount | null> {
    if (!this.nodeClient) {
      return null;
    }

    const realmAddress = toBech32AddressByPackagePath('g', realmPath);
    return this.nodeClient
      .abciQueryBankBalances(realmAddress)
      .then(response => response?.response?.ResponseBase?.Data)
      .then(encodedData => (encodedData ? parseABCI<string>(encodedData) : null))
      .then(data =>
        data
          ? ({
              value: parseTokenAmount(data).toString(),
              denom: GNOTToken.denom,
            } as Amount)
          : null,
      )
      .catch(() => null);
  }

  async getRealmFunctions(realmPath: string): Promise<RealmFunction[] | null> {
    if (!this.nodeClient) {
      return null;
    }

    const response = await this.nodeClient.abciQueryVMQueryFuncs(realmPath).catch(() => null);
    if (!response || !response?.response?.ResponseBase?.Data) {
      return null;
    }

    try {
      const results = parseABCI<any[]>(response?.response?.ResponseBase?.Data);
      return results.map<RealmFunction>(result => ({
        functionName: result?.FuncName,
        params:
          result?.Params?.map((p: any) => ({
            name: p.Name,
            type: p.Type,
            value: p.Value,
          })) || [],
        results:
          result?.Results?.map((r: any) => ({
            name: r.Name,
            type: r.Type,
            value: r.Value,
          })) || [],
      }));
    } catch (e) {
      return [];
    }
  }

  async getRealmTransactions(
    realmPath: string,
    pageOption?: PageOption,
  ): Promise<TransactionWithEvent[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient.query(makeRealmTransactionsQuery(), pageOption).then(
      result =>
        result?.data?.transactions.filter((transaction: RealmTransaction) => {
          return transaction.messages.find((message: any) => {
            return (
              message?.value?.pkg_path === realmPath || message?.value?.package?.path === realmPath
            );
          });
        }) || [],
    );
  }

  async getRealmTransactionsWithArgs(
    realmPath: string,
    pageOption?: PageOption,
  ): Promise<RealmTransaction[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      .query(makeRealmTransactionsWithArgsQuery(realmPath), pageOption)
      .then(result => result?.data?.transactions || []);
  }

  async getRealmCallTransactionsWithArgs(
    realmPath: string,
  ): Promise<RealmTransaction<MsgCallValue>[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      .query(makeRealmCallTransactionsWithArgsQuery(realmPath))
      .then(result => result?.data?.transactions || []);
  }

  async getRealmTotalSupply(realmPath: string): Promise<number | null> {
    if (!this.nodeClient) {
      return null;
    }

    return this.nodeClient
      .abciQueryVMQueryEvaluation(realmPath, 'TotalSupply', [])
      .then(response => response?.response?.ResponseBase?.Data || null)
      .then(parseABCIQueryNumberResponse)
      .catch(() => null);
  }

  async getRealmTransactionInfos(): Promise<{[key in string]: RealmTransactionInfo} | null> {
    if (!this.indexerClient) {
      return null;
    }

    const transactions: RealmTransaction[] | null = await this.indexerClient
      .query(makeRealmTransactionInfosQuery())
      .then(result => result?.data?.transactions || [])
      .catch(() => null);
    if (!transactions) {
      return null;
    }

    return transactions.reduce<{[key in string]: RealmTransactionInfo}>(
      (accum: {[key in string]: RealmTransactionInfo}, current: RealmTransaction) => {
        let packagePath: string | null = null;

        let msgCallCount = 0;
        let gasUsed = current.gas_fee.amount;
        for (const message of current.messages) {
          if (isAddPackageMessageValue(message.value)) {
            packagePath = message.value.package?.path || null;
          } else if (message.value.__typename === 'MsgCall') {
            packagePath = message.value.pkg_path || null;
            msgCallCount += 1;
          }
        }

        if (packagePath) {
          if (accum[packagePath]) {
            msgCallCount += accum[packagePath].msgCallCount;
            gasUsed += accum[packagePath].gasUsed;
          }

          accum[packagePath] = {
            msgCallCount,
            gasUsed,
          };
        }

        return accum;
      },
      {},
    );
  }

  async getRealmTransactionInfo(packagePath: string): Promise<RealmTransactionInfo | null> {
    if (!this.indexerClient) {
      return null;
    }

    const transactions: RealmTransaction[] | null = await this.indexerClient
      .query(makeRealmTransactionInfoQuery(packagePath))
      .then(result => result?.data?.transactions || [])
      .catch(() => null);
    if (!transactions) {
      return null;
    }

    return transactions.reduce<RealmTransactionInfo>(
      (accum: RealmTransactionInfo, current: RealmTransaction) => {
        let packagePath: string | null = null;

        for (const message of current.messages) {
          let msgCallCount = 0;
          let gasUsed = current.gas_fee.amount;
          if (isAddPackageMessageValue(message.value)) {
            packagePath = message.value.package?.path || null;
          } else if (message.value.__typename === 'MsgCall') {
            packagePath = message.value.pkg_path || null;
            msgCallCount += 1;
          }

          if (packagePath) {
            if (accum) {
              msgCallCount += accum.msgCallCount;
              gasUsed += accum.gasUsed;
            }

            accum = {
              msgCallCount,
              gasUsed,
            };
          }
        }

        return accum;
      },
      {msgCallCount: 0, gasUsed: 0},
    );
  }

  async getRealmPackages(): Promise<{
    pageInfo: PageInfo;
    transactions: RealmTransaction<AddPackageValue>[];
  } | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      .pageQuery<RealmTransaction<AddPackageValue>>(makeRealmPackagesQuery())
      .then(result => {
        const edges = result?.data?.transactions.edges || [];
        const transactions = edges.map(edge => edge.transaction);
        return {
          pageInfo: result.data.transactions.pageInfo,
          transactions,
        };
      });
  }

  async getTokens(): Promise<GRC20Info[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    const transactions = await this.indexerClient
      .query(makeTokensQuery())
      .then(result => result?.data?.transactions || [])
      .then((transactions: RealmTransaction<AddPackageValue>[]) => transactions);
    return transactions
      .flatMap(tx => tx.messages)
      .map(message => {
        for (const file of message.value.package?.files || []) {
          const info = parseGRC20InfoByFile(file.body) || parseBankerGRC20InfoByFile(file.body);
          if (info) {
            return {
              ...info,
              packagePath: message.value.package?.path || '',
            };
          }
        }
        return null;
      })
      .filter(info => !!info) as GRC20Info[];
  }

  async getToken(packagePath: string): Promise<{
    realmTransaction: RealmTransaction<AddPackageValue>;
    tokenInfo: GRC20Info;
  } | null> {
    if (!this.nodeClient || !this.indexerClient) {
      return null;
    }

    const transactions = await this.indexerClient
      .query(makeTokenQuery(packagePath))
      .then(result => (result?.data?.transactions as RealmTransaction<AddPackageValue>[]) || null)
      .catch(() => null);
    if (!transactions || transactions?.length < 1) {
      return null;
    }

    const realmTransaction = transactions[0];
    const tokenInfo = realmTransaction.messages
      .map(message => {
        const files = message.value.package?.files;
        if (!files) {
          return null;
        }

        for (const file of files) {
          const tokenInfo =
            parseGRC20InfoByFile(file.body) || parseBankerGRC20InfoByFile(file.body);
          const tokenPath = message.value.package?.path;
          if (tokenInfo && tokenPath === packagePath) {
            return {
              ...tokenInfo,
              packagePath,
            };
          }
        }

        return null;
      })
      .filter(info => !!info)[0];

    if (!tokenInfo) {
      return null;
    }

    return {
      realmTransaction,
      tokenInfo: {
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
        owner: tokenInfo.owner,
        holders: 0,
        functions: GRC20_FUNCTIONS,
        totalSupply: 0,
        packagePath,
      },
    };
  }

  async getUsernames(): Promise<{[key in string]: string}> {
    if (!this.indexerClient) {
      return {};
    }

    const transactions = await this.indexerClient
      .query(makeUsernameQuery())
      .then(result => (result?.data?.transactions as RealmTransaction<MsgCallValue>[]) || null)
      .catch(() => null);

    if (!transactions) {
      return {};
    }

    return transactions
      .flatMap(tx => tx.messages)
      .reduce<{[key in string]: string}>((accum, current) => {
        if (current.value.caller && current.value.args) {
          accum[current.value.caller] = current.value.args?.[1] || current.value.caller;
        }
        return accum;
      }, {});
  }

  async getTokenHolders(packagePath: string): Promise<number> {
    if (!this.nodeClient) {
      return 0;
    }

    const nodeResponse = await this.nodeClient.abciQueryVMQueryRender(packagePath + ':', []);
    const responseData = nodeResponse.response.ResponseBase.Data
      ? extractStringFromResponse(nodeResponse.response.ResponseBase.Data)
      : '';

    if (responseData) {
      const regex = /(?:\*\s*)?\**\s*(?:Known\s+)?(accounts|users|holders)\**\s*:\s*(\d+)/i;
      const match = responseData.match(regex);

      if (match && match.length > 2) {
        return BigNumber(match[2]).toNumber();
      }
    }

    // If it can't be parsed in render function, look up the transaction.
    if (!this.indexerClient) {
      return 0;
    }

    const transactions = await this.indexerClient
      .pageQuery(makeRealmTransactionsWithArgsQuery(packagePath))
      .then(result => result?.data?.transactions.edges.map(edge => edge.transaction) || []);

    if (!transactions) {
      return 0;
    }

    const addresses = transactions
      .flatMap(tx =>
        tx.messages.flatMap((message: any) => {
          const caller = message.value.caller;
          const receiver = message.value?.args?.[0];
          return [caller, receiver];
        }),
      )
      .filter(address => !!address);

    return [...new Set(addresses)].length;
  }

  async getBoards(): Promise<Board[]> {
    if (!this.nodeClient) {
      return [];
    }

    const response = await this.nodeClient
      .abciQueryVMQueryRender('gno.land/r/demo/boards:', [])
      .then(response => response?.response?.ResponseBase?.Data);

    if (!response) {
      return [];
    }

    const data = extractStringFromResponse(response);
    const lines = data
      .trim()
      .split('\n')
      .filter(line => line.length > 1)
      .map(line => line.trim().slice(2));

    return lines
      .map((line, index) => {
        const match = line.match(/\[(.*?)\]\((.*?)\)/);
        if (!match) {
          return null;
        }

        const path = match[1];
        const name = match[1].split(':')[1];
        return {
          index,
          path,
          name,
        };
      })
      .filter(result => !!result) as Board[];
  }
}
