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
          rpcUrl: query?.rpcUrl?.toString() || '',
          indexerUrl: query?.indexerUrl?.toString() || '',
        });
        return;
      }
      const chain = chains.find(chain => chain.chainId === query?.chainId?.toString()) || chains[0];
      setCurrentNetwork({
        isCustom: false,
        chainId: chain.chainId,
        rpcUrl: chain.rpcUrl || '',
        indexerUrl: chain.indexerUrl || '',
      });
    }
  }, [query, currentNetwork]);

  const currentNetworkModel: ChainModel = useMemo(() => {
    if (currentNetwork?.isCustom) {
      return {
        name: 'Custom Network',
        chainId: '',
        apiUrl: null,
        rpcUrl: currentNetwork.rpcUrl || null,
        indexerUrl: currentNetwork.indexerUrl || null,
      };
    }
    const chain =
      chains.find(chain => chain.chainId === currentNetwork?.chainId?.toString()) || chains[0];
    return chain;
  }, [currentNetwork]);

  const nodeRPCClient = useMemo(() => {
    const chainSupportType = getChainSupportType(currentNetworkModel);
    if (!['ALL', 'RPC_WITH_INDEXER', 'RPC'].includes(chainSupportType)) {
      return null;
    }

    const rpcUrl = currentNetworkModel.apiUrl || currentNetworkModel.rpcUrl || '';
    return new NodeRPCClient(rpcUrl, currentNetworkModel.chainId);
  }, [currentNetworkModel]);

  const indexerQueryClient = useMemo(() => {
    const chainSupportType = getChainSupportType(currentNetworkModel);
    if (!['ALL', 'RPC_WITH_INDEXER'].includes(chainSupportType)) {
      return null;
    }

    const indexerQueryUrl = currentNetworkModel.indexerUrl + '/graphql/query';
    return new IndexerClient(indexerQueryUrl);
  }, [currentNetworkModel]);

  const onblocRPCClient = useMemo(() => {
    const chainSupportType = getChainSupportType(currentNetworkModel);
    if (!['ALL'].includes(chainSupportType)) {
      return null;
    }

    const rpcUrl = currentNetworkModel.apiUrl + '/gno' || '';
    return new HttpRPCClient(rpcUrl);
  }, [currentNetworkModel]);

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
        currentNetwork: currentNetworkModel,
        nodeRPCClient,
        indexerQueryClient,
        onblocRPCClient,
      }}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
