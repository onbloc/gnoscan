'use client';
import {useRouter} from '@/common/hooks/common/use-router';
import {createContext, useEffect, useMemo} from 'react';

import {ChainModel, getChainSupportType} from '@/models/chain-model';
import {HttpRPCClient} from '@/common/clients/rpc-client/http-rpc-client';
import {NodeRPCClient} from '@/common/clients/node-client';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {RPCClient} from '@/common/clients/rpc-client';
import {IndexerClient} from '@/common/clients/indexer-client/indexer-client';
import {useNetwork} from '@/common/hooks/use-network';

interface NetworkContextProps {
  chains: ChainModel[];

  currentNetwork: ChainModel | null;

  isCustomNetwork: boolean;

  nodeRPCClient: NodeRPCClient | null;

  // current main is portal-loop
  mainNodeRPCClient: NodeRPCClient | null;

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
  const {currentNetwork, setCurrentNetwork} = useNetwork();

  useEffect(() => {
    // If the query fails to load.
    if (!!window?.location?.href.split('?')?.[1] && Object.keys(query).length === 0) {
      return;
    }

    if (!currentNetwork) {
      if (query?.type === 'custom') {
        setCurrentNetwork({
          isCustom: true,
          chainId: '',
          apiUrl: '',
          rpcUrl: query?.rpcUrl?.toString() || '',
          indexerUrl: query?.indexerUrl?.toString() || '',
        });
        return;
      }
      const chain = chains.find(chain => chain.chainId === query?.chainId?.toString()) || chains[0];
      setCurrentNetwork({
        isCustom: false,
        chainId: chain.chainId,
        apiUrl: chain.apiUrl || '',
        rpcUrl: chain.rpcUrl || '',
        indexerUrl: chain.indexerUrl || '',
      });
    }
  }, [query, currentNetwork]);

  const currentNetworkModel: ChainModel | null = useMemo(() => {
    if (!currentNetwork) {
      return null;
    }

    if (currentNetwork?.isCustom) {
      return {
        name: 'Custom Network',
        chainId: '',
        apiUrl: null,
        rpcUrl: decodeURIComponent(currentNetwork.rpcUrl) || null,
        indexerUrl: decodeURIComponent(currentNetwork.indexerUrl) || null,
      };
    }
    const chain =
      chains.find(chain => chain.chainId === currentNetwork?.chainId?.toString()) || chains[0];
    return chain;
  }, [currentNetwork]);

  const isCustomNetwork = useMemo(() => {
    if (!currentNetworkModel) {
      return false;
    }

    if (!currentNetworkModel.apiUrl) {
      return true;
    }

    return false;
  }, [currentNetworkModel]);

  const nodeRPCClient = useMemo(() => {
    if (!currentNetworkModel) {
      return null;
    }
    const chainSupportType = getChainSupportType(currentNetworkModel);
    if (!['ALL', 'RPC_WITH_INDEXER', 'RPC'].includes(chainSupportType)) {
      return null;
    }

    const rpcUrl = currentNetworkModel.rpcUrl || currentNetworkModel.apiUrl || '';
    return new NodeRPCClient(rpcUrl, currentNetworkModel.chainId);
  }, [currentNetworkModel]);

  const indexerQueryClient = useMemo(() => {
    if (!currentNetworkModel) {
      return null;
    }
    const chainSupportType = getChainSupportType(currentNetworkModel);
    if (!['ALL', 'RPC_WITH_INDEXER'].includes(chainSupportType)) {
      return null;
    }

    const indexerQueryUrl = currentNetworkModel.indexerUrl + '/graphql/query';
    return new IndexerClient(indexerQueryUrl);
  }, [currentNetworkModel]);

  const onblocRPCClient = useMemo(() => {
    if (!currentNetworkModel) {
      return null;
    }
    const chainSupportType = getChainSupportType(currentNetworkModel);
    if (!['ALL'].includes(chainSupportType)) {
      return null;
    }

    const rpcUrl = `${currentNetworkModel.apiUrl || ''}/gno`;
    return new HttpRPCClient(rpcUrl);
  }, [currentNetworkModel]);

  const mainNodeRPCClient = useMemo(() => {
    const mainNetwork = chains.find(chain => chain.chainId === 'portal-loop');
    if (!mainNetwork) {
      return null;
    }

    return new NodeRPCClient(mainNetwork.rpcUrl || '', mainNetwork.chainId);
  }, [chains]);

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
        isCustomNetwork,
        currentNetwork: currentNetworkModel,
        nodeRPCClient,
        indexerQueryClient,
        onblocRPCClient,
        mainNodeRPCClient,
      }}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
