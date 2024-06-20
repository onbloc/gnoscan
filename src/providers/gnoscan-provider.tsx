import {createContext, useMemo} from 'react';

import {IndexerRepository} from '@/repositories/indexer-repository/indexer-repository';
import {IIndexerRepository} from '@/repositories/indexer-repository/types';
import {INodeRepository, NodeRepository} from '@/repositories/node-repository';
import {IOnblocAPIRepository, OnblocAPIRepository} from '@/repositories/onbloc-api-respository';
import {ChainModel, getChainSupportType} from '@/models/chain-model';
import {HttpRPCClient} from '@/common/clients/rpc-client/http-rpc-client';

interface GnoscanContextProps {
  nodeRepository: INodeRepository | null;

  indexerRepository: IIndexerRepository | null;

  onblocAPIRepository: IOnblocAPIRepository | null;
}

export const GnoscanContext = createContext<GnoscanContextProps | null>(null);

interface GnoscanProviderPros {
  chains: ChainModel[];
}

const GnoscanProvider: React.FC<React.PropsWithChildren<GnoscanProviderPros>> = ({
  chains,
  children,
}) => {
  const customChain = useMemo(() => {
    return null;
  }, []);

  const currentChain = useMemo(() => {
    if (customChain) {
      return customChain;
    }

    return chains.find(chain => chain.chainId === 'test3') || chains[0];
  }, [customChain, chains]);

  const nodeRPCClient = useMemo(() => {
    const chainSupportType = getChainSupportType(currentChain);
    if (!['ALL', 'RPC_WITH_INDEXER', 'RPC'].includes(chainSupportType)) {
      return null;
    }

    const rpcUrl = currentChain.apiUrl || currentChain.rpcUrl || '';
    return new HttpRPCClient(rpcUrl);
  }, [currentChain]);

  const indexerRPCClient = useMemo(() => {
    const chainSupportType = getChainSupportType(currentChain);
    if (!['ALL', 'RPC_WITH_INDEXER'].includes(chainSupportType)) {
      return null;
    }

    const rpcUrl = currentChain.apiUrl + '/indexer' || currentChain.indexerUrl || '';
    return new HttpRPCClient(rpcUrl);
  }, [currentChain]);

  const onblocRPCClient = useMemo(() => {
    const chainSupportType = getChainSupportType(currentChain);
    if (!['ALL'].includes(chainSupportType)) {
      return null;
    }

    const rpcUrl = currentChain.apiUrl + '/gno' || '';
    return new HttpRPCClient(rpcUrl);
  }, [currentChain]);

  const nodeRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }

    return new NodeRepository(nodeRPCClient);
  }, [nodeRPCClient]);

  const indexerRepository = useMemo(() => {
    if (!indexerRPCClient) {
      return null;
    }

    return new IndexerRepository(indexerRPCClient);
  }, [indexerRPCClient]);

  const onblocAPIRepository = useMemo(() => {
    if (!onblocRPCClient) {
      return null;
    }

    return new OnblocAPIRepository(onblocRPCClient);
  }, [onblocRPCClient]);

  return (
    <GnoscanContext.Provider
      value={{
        nodeRepository,
        indexerRepository,
        onblocAPIRepository,
      }}>
      {children}
    </GnoscanContext.Provider>
  );
};

export default GnoscanProvider;
