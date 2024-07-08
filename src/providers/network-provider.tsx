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
    if (query?.type === 'custom') {
      return {
        chainId: '',
        name: 'Custom Network',
        isCustom: true,
        rpcUrl: `${query?.rpcUrl}` || null,
        indexerUrl: `${query?.indexerUrl}` || null,
        apiUrl: null,
      };
    }

    const chain = chains.find(chain => chain.chainId === query?.chainId?.toString()) || chains[0];

    return {
      chainId: chain.chainId,
      name: chain.name,
      isCustom: false,
      rpcUrl: chain.rpcUrl,
      indexerUrl: chain.indexerUrl,
      apiUrl: chain.apiUrl,
    };
  }, [chains, query]);

  const currentNetwork: ChainModel = useMemo(() => {
    return currentChainInfo;
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
