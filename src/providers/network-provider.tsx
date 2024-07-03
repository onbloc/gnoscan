'use client';
import {useRouter} from '@/common/hooks/common/use-router';
import {createContext, useMemo} from 'react';

import {ChainModel, getChainSupportType} from '@/models/chain-model';
import {HttpRPCClient} from '@/common/clients/rpc-client/http-rpc-client';
import {NodeRPCClient} from '@/common/clients/node-client';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {RPCClient} from '@/common/clients/rpc-client';
import {IndexerClient} from '@/common/clients/indexer-client/indexer-client';

interface NetworkContextProps {
  chains: ChainModel[];

  currentNetwork: ChainModel;

  nodeRPCClient: NodeRPCClient | null;

  indexerQueryClient: IndexerClient | null;

  onblocRPCClient: RPCClient | null;
}

export const NetworkContext = createContext<NetworkContextProps | null>(null);

interface NetworkProviderPros {
  chains: ChainModel[];
}

const NetworkProvider: React.FC<React.PropsWithChildren<NetworkProviderPros>> = ({
  chains,
  children,
}) => {
  const {query} = useRouter();

  const currentChainInfo = useMemo(() => {
    const chainIds = chains.map(chain => chain.chainId);
    const chainId = chainIds.includes(query?.chainId?.toString() || '')
      ? query?.chainId?.toString()
      : 'portal-loop';

    return {
      chainId,
      isCustom: query?.type === 'custom',
      rpcUrl: query?.rpcUrl || null,
      indexerUrl: query?.indexerUrl || null,
    };
  }, [query]);

  const currentNetwork: ChainModel = useMemo(() => {
    return chains.find(chain => chain.chainId === currentChainInfo.chainId) || chains[0];
  }, [currentChainInfo]);

  const nodeRPCClient = useMemo(() => {
    const chainSupportType = getChainSupportType(currentNetwork);
    if (!['ALL', 'RPC_WITH_INDEXER', 'RPC'].includes(chainSupportType)) {
      return null;
    }

    const rpcUrl = currentNetwork.apiUrl || currentNetwork.rpcUrl || '';
    return new NodeRPCClient(rpcUrl, currentNetwork.chainId);
  }, [currentNetwork]);

  const indexerQueryClient = useMemo(() => {
    const chainSupportType = getChainSupportType(currentNetwork);
    if (!['ALL', 'RPC_WITH_INDEXER'].includes(chainSupportType)) {
      return null;
    }

    const indexerQueryUrl = currentNetwork.indexerUrl + '/graphql/query';
    return new IndexerClient(indexerQueryUrl);
  }, [currentNetwork]);

  const onblocRPCClient = useMemo(() => {
    const chainSupportType = getChainSupportType(currentNetwork);
    if (!['ALL'].includes(chainSupportType)) {
      return null;
    }

    const rpcUrl = currentNetwork.apiUrl + '/gno' || '';
    return new HttpRPCClient(rpcUrl);
  }, [currentNetwork]);

  const apolloClient = useMemo(() => {
    if (!indexerQueryClient) {
      return new ApolloClient({cache: new InMemoryCache()});
    }

    return indexerQueryClient.apolloClient;
  }, [indexerQueryClient]);

  return (
    <NetworkContext.Provider
      value={{
        chains,
        currentNetwork,
        nodeRPCClient,
        indexerQueryClient,
        onblocRPCClient,
      }}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
