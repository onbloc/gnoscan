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
import {Amount, Blog} from '@/types/data-type';
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
import {PageInfo, PageOption, PageQueryResponse} from '@/common/clients/indexer-client/types';
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
  makeLatestRealmsQuery,
  makeRealmTransactionsByEventQuery,
} from './onbloc-query';
import {makeRPCRequest, RPCClient} from '@/common/clients/rpc-client';
import BigNumber from 'bignumber.js';

export class OnblocRealmRepository implements IRealmRepository {
  constructor(
    private nodeClient: NodeRPCClient | null,
    private indexerClient: IndexerClient | null,
    private onblocRPCClient: RPCClient | null,
    private mainNodeRPCClient: NodeRPCClient | null,
  ) {}

  async getLatestRealms(): Promise<any | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient.pageQuery(makeLatestRealmsQuery()).then(result => {
      const edges = result?.data?.transactions?.edges;
      return edges.flatMap((edge: any) => edge.transaction);
    });
  }

  async getRealms(pageOption?: PageOption): Promise<any | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient.pageQuery(makeRealmsQuery()).then(result => {
      const edges = result?.data?.transactions?.edges;
      return edges.flatMap((edge: any) => edge.transaction);
    });
  }

  async getRealm(realmPath: string): Promise<RealmTransaction | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient.pageQuery(makeRealmQuery(realmPath)).then(result => {
      const edges = result?.data?.transactions?.edges;
      if (!edges || edges.length === 0) {
        return null;
      }

      return edges[0].transaction;
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

  async getRealmTransactions(realmPath: string): Promise<TransactionWithEvent[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      .pageQuery<TransactionWithEvent>(makeRealmTransactionsQuery(realmPath))
      .then(result => result?.data?.transactions.edges.map(edge => edge.transaction) || []);
  }

  async getRealmTransactionsByEvent(
    realmPath: string,
    cursor?: string | null,
  ): Promise<{
    pageInfo: PageInfo;
    transactions: TransactionWithEvent[];
  } | null> {
    if (!this.indexerClient) {
      return null;
    }

    const response = await this.indexerClient.pageQuery<TransactionWithEvent>(
      makeRealmTransactionsByEventQuery(realmPath, cursor || null),
    );

    const transactions = response?.data?.transactions.edges.map(edge => edge.transaction) || [];
    const pageInfo = response?.data?.transactions.pageInfo;

    return {
      transactions,
      pageInfo,
    };
  }

  async getRealmTransactionsWithArgs(realmPath: string): Promise<RealmTransaction[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      .pageQuery(makeRealmTransactionsWithArgsQuery(realmPath))
      .then(result => result?.data?.transactions.edges.map(edge => edge.transaction) || []);
  }

  async getRealmCallTransactionsWithArgs(
    realmPath: string,
  ): Promise<RealmTransaction<MsgCallValue>[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      .pageQuery(makeRealmCallTransactionsWithArgsQuery(realmPath))
      .then(result => result?.data?.transactions.edges.map(edge => edge.transaction) || []);
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

  async getRealmTransactionInfos(
    fromHeight?: number,
  ): Promise<{[key in string]: RealmTransactionInfo} | null> {
    if (!this.indexerClient) {
      return null;
    }

    const transactions: RealmTransaction[] | null = await this.indexerClient
      .pageQuery(makeRealmTransactionInfosQuery(fromHeight))
      .then(result => result?.data?.transactions.edges.map(edge => edge.transaction) || [])
      .catch(() => null);

    if (!transactions) {
      return null;
    }

    return transactions.reduce<{[key in string]: RealmTransactionInfo}>(
      (accum: {[key in string]: RealmTransactionInfo}, current: RealmTransaction) => {
        const packagePathsOfMessages = current.messages
          .filter(message => !isAddPackageMessageValue(message.value))
          .map(message => (message.value as MsgCallValue).pkg_path || '')
          .filter(packagePath => !!packagePath);

        for (const packagePath of [...new Set(packagePathsOfMessages)]) {
          if (!accum[packagePath]) {
            accum[packagePath] = {
              gasUsed: 0,
              msgCallCount: 0,
            };
          }

          accum[packagePath].gasUsed += current.gas_fee.amount;
          accum[packagePath].msgCallCount += 1;
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
      .pageQuery(makeRealmTransactionInfoQuery(packagePath))
      .then(result => result?.data?.transactions.edges.map(edge => edge.transaction) || [])
      .catch(() => null);
    if (!transactions) {
      return null;
    }

    return transactions.reduce<RealmTransactionInfo>(
      (accum: RealmTransactionInfo, current: RealmTransaction) => {
        const availableTransactionCallMessages = current.messages.filter(
          message =>
            !isAddPackageMessageValue(message.value) && message.value.pkg_path === packagePath,
        );

        if (availableTransactionCallMessages.length > 0) {
          accum.gasUsed += current.gas_fee.amount;
          accum.msgCallCount += 1;
        }

        return accum;
      },
      {msgCallCount: 0, gasUsed: 0},
    );
  }

  async getRealmPackages(cursor: string | null): Promise<{
    pageInfo: PageInfo;
    transactions: RealmTransaction<AddPackageValue>[];
  } | null> {
    if (!this.indexerClient) {
      return null;
    }

    const response: {
      data: PageQueryResponse<RealmTransaction<AddPackageValue>>;
    } = await this.indexerClient.pageQuery<RealmTransaction<AddPackageValue>>(
      makeRealmPackagesQuery(cursor),
    );

    const pageInfo = response?.data?.transactions?.pageInfo;
    const transactionEdges = response?.data?.transactions?.edges || [];
    const transactions = transactionEdges.map(edge => edge.transaction);

    return {
      transactions,
      pageInfo,
    };
  }

  async getTokens(): Promise<GRC20Info[] | null> {
    if (!this.onblocRPCClient) {
      return null;
    }

    const request = makeRPCRequest({method: 'getGRC20Tokens'});
    const response = await this.onblocRPCClient.call<
      {
        name: string;
        owner: string;
        symbol: string;
        packagePath: string;
        decimals: number;
      }[]
    >(request);

    const result = response.result;
    if (!result) {
      return null;
    }

    return result.map(tokenInfo => ({
      ...tokenInfo,
      functions: [],
      totalSupply: 0,
      holders: 0,
    }));
  }

  async getToken(packagePath: string): Promise<{
    realmTransaction: RealmTransaction<AddPackageValue>;
    tokenInfo: GRC20Info;
  } | null> {
    if (!this.nodeClient || !this.indexerClient) {
      return null;
    }

    const transactions = await this.indexerClient
      .pageQuery<RealmTransaction<AddPackageValue>>(makeTokenQuery(packagePath))
      .then(result => result?.data?.transactions.edges.map(edge => edge.transaction) || [])
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

    if (this.onblocRPCClient) {
      const response = await this.onblocRPCClient.call<
        {
          address: string;
          name: string;
        }[]
      >(
        makeRPCRequest({
          method: 'getUsernames',
        }),
      );

      if (!response.result) {
        return {};
      }

      return response.result.reduce<{[key in string]: string}>((accum, current) => {
        accum[current.address] = current.name;
        return accum;
      }, {});
    }

    const transactions = await this.indexerClient
      .pageQuery<RealmTransaction<MsgCallValue>>(makeUsernameQuery())
      .then(result => result?.data?.transactions.edges.map(edge => edge.transaction) || [])
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

  async getBlogs(): Promise<Blog[]> {
    if (!this.mainNodeRPCClient) {
      return [];
    }

    const responseData = await this.mainNodeRPCClient
      .abciQueryVMQueryRender('gno.land/r/gnoland/blog:', [])
      .then(response => response?.response?.ResponseBase?.Data)
      .then(extractStringFromResponse);

    if (!responseData) {
      return [];
    }

    const results: Blog[] = [];

    const regex = /### \[(.+?)\]\((.+?)\)\s+(\d{2} \w+ \d{4})/g;

    let match;
    let index = 0;
    while ((match = regex.exec(responseData)) !== null && index < 10) {
      const [, title, path, date] = match;
      results.push({
        index,
        title,
        path,
        date,
      });
      index++;
    }

    return results;
  }

  async getBlogPublisher(path: string): Promise<string | null> {
    if (!this.mainNodeRPCClient) {
      return null;
    }

    const responseData = await this.mainNodeRPCClient
      .abciQueryVMQueryRender('gno.land' + path, [])
      .then(response => response?.response?.ResponseBase?.Data)
      .then(extractStringFromResponse);

    if (!responseData) {
      return null;
    }

    const regex = /Published by ([\w\d]+) to gno.land's Blog/g;
    let match;
    let lastMatch = null;

    while ((match = regex.exec(responseData)) !== null) {
      lastMatch = match[1]; // 매칭된 주소 값을 저장
    }

    return lastMatch;
  }
}
