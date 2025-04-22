/* eslint-disable @typescript-eslint/no-explicit-any */
import { IndexerClient } from "@/common/clients/indexer-client/indexer-client";
import { PageInfo, PageOption, PageQueryResponse } from "@/common/clients/indexer-client/types";
import { NodeRPCClient } from "@/common/clients/node-client";
import { makeRPCRequest, RPCClient } from "@/common/clients/rpc-client";
import { parseTokenAmount } from "@/common/utils/token.utility";
import { MonthlyTransactionStatInfo, TotalTransactionStatInfo, Transaction } from "@/types/data-type";
import { ApolloQueryResult } from "@apollo/client";
import { mapTransactionByRealm, mapTransactionTypeNameByMessage } from "../realm-repository.ts/mapper";
import { getDefaultMessage } from "../utility";
import {
  makeGRC20ReceivedTransactionsByAddressQuery,
  makeSimpleTransactionsByFromHeight,
  makeTransactionHashQuery,
  makeTransactionsQuery,
} from "./onbloc-query";
import { ITransactionRepository } from "./types";

function mapTransaction(data: any): Transaction {
  const defaultMessage = getDefaultMessage(data.messages).value;
  const amountValue = defaultMessage?.amount || defaultMessage?.send || defaultMessage?.deposit || "0ugnot";
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
      value: parseTokenAmount(amountValue).toString() || "0",
      denom: "ugnot",
    },
    time: "",
    fee: {
      value: data?.gas_fee?.amount || "0",
      denom: "ugnot",
    },
  };
}

export class OnblocTransactionRepository implements ITransactionRepository {
  constructor(
    private nodeRPCClient: NodeRPCClient | null,
    private indexerClient: IndexerClient | null,
    private onblocRPCClient: RPCClient | null,
  ) {}

  async getTransactions(): Promise<Transaction[]> {
    if (!this.indexerClient) {
      return [];
    }

    const results: Transaction[] = [];
    let cursor = null;
    let hasNext = true;
    try {
      while (hasNext) {
        const response: ApolloQueryResult<PageQueryResponse<any>> = await this.indexerClient.pageQuery(
          makeTransactionsQuery(cursor),
        );

        const transactionEdges = response?.data?.transactions?.edges;
        const pageInfo = response?.data?.transactions?.pageInfo;

        cursor = pageInfo?.last || null;
        hasNext = pageInfo?.hasNext || false;
        results.push(...transactionEdges.map((edge: any) => mapTransaction(edge.transaction)));
      }
    } catch (e) {
      console.error(e);
      return [];
    }

    return results;
  }

  async getTransactionsPage(cursor: string | null): Promise<{
    pageInfo: PageInfo;
    transactions: Transaction[];
  } | null> {
    if (!this.indexerClient) {
      return null;
    }

    return (
      this.indexerClient?.pageQuery(makeTransactionsQuery(cursor)).then(result => {
        const edges = result.data.transactions.edges;
        const pageInfo = result.data.transactions.pageInfo;
        return {
          pageInfo: pageInfo,
          transactions: edges.map(edge => mapTransaction(edge.transaction)),
        };
      }) || null
    );
  }

  async getTransactionStatInfo(): Promise<TotalTransactionStatInfo> {
    if (!this.onblocRPCClient) {
      return {
        accounts: 0,
        gasFee: 0,
      };
    }

    const request = makeRPCRequest({
      method: "getTotalTransactionInfo",
      params: [],
    });
    const response = await this.onblocRPCClient.call<TotalTransactionStatInfo>(request);

    if (!response.result) {
      return {
        accounts: 0,
        gasFee: 0,
      };
    }

    return response.result;
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
      return this.indexerClient?.pageQuery(makeTransactionHashQuery(transactionHash)).then(result => {
        const edges = result.data.transactions.edges;
        return edges.length > 0 ? edges[0].transaction.block_height : null;
      });
    }

    return null;
  }

  async getGRC20ReceivedTransactionsByAddress(address: string, pageOption?: PageOption): Promise<Transaction[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      ?.pageQuery<any>(makeGRC20ReceivedTransactionsByAddressQuery(address))
      .then(result => result.data?.transactions.edges || [])
      .then(edges => edges.map(edge => mapTransactionByRealm(edge.transaction)));
  }

  async getNativeTokenReceivedTransactionsByAddress(
    address: string,
    pageOption?: PageOption,
  ): Promise<Transaction[] | null> {
    if (!this.indexerClient) {
      return null;
    }

    return this.indexerClient
      ?.pageQuery(makeGRC20ReceivedTransactionsByAddressQuery(address))
      .then(result => result.data?.transactions.edges || [])
      .then(edges => edges.map(edge => mapTransactionByRealm(edge.transaction)));
  }

  async getSimpleTransactionsByFromHeight(height: number): Promise<any[]> {
    if (!this.indexerClient) {
      return [];
    }

    const results: any[] = [];
    let fromBlockHeight = height;
    let hasError = true;
    try {
      while (hasError === true) {
        const response = await this.indexerClient?.pageQuery<any>(makeSimpleTransactionsByFromHeight(fromBlockHeight));
        const transactions = response?.data?.transactions.edges.map(edge => edge.transaction);
        hasError = Array.isArray(response.errors);
        if (hasError) {
          fromBlockHeight = transactions[transactions?.length - 1].transaction.block_height + 1;
        }
        results.push(...transactions);
      }
    } catch (e) {
      console.error(e);
      return [];
    }

    return results;
  }

  async getMonthlyTransactionStatInfo(): Promise<MonthlyTransactionStatInfo | null> {
    if (!this.onblocRPCClient) {
      return null;
    }

    const request = makeRPCRequest({ method: "getMonthlyTransactionInfo" });
    const response = await this.onblocRPCClient.call<MonthlyTransactionStatInfo>(request);

    const result = response.result;
    if (!result) {
      return null;
    }

    return result;
  }
}
