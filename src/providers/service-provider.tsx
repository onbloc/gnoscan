import {useNetworkProvider} from '@/common/hooks/provider/use-network-provider';
import {BlockRepository, IBlockRepository} from '@/repositories/block-repository';
import {ChainRepository, IChainRepository} from '@/repositories/chain-repository';
import {IRealmRepository, RealmRepository} from '@/repositories/realm-repository.ts';
import {ITransactionRepository, TransactionRepository} from '@/repositories/transaction-repository';
import {createContext, useMemo} from 'react';

interface ServiceContextProps {
  chainRepository: IChainRepository | null;
  blockRepository: IBlockRepository | null;
  transactionRepository: ITransactionRepository | null;
  realmRepository: IRealmRepository | null;
}

export const ServiceContext = createContext<ServiceContextProps | null>(null);

const ServiceProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const {currentNetwork, indexerQueryClient, nodeRPCClient, onblocRPCClient} = useNetworkProvider();

  const chainRepository = useMemo(() => new ChainRepository(nodeRPCClient), [nodeRPCClient]);

  const blockRepository = useMemo(() => new BlockRepository(nodeRPCClient), [nodeRPCClient]);

  const transactionRepository = useMemo(
    () => new TransactionRepository(nodeRPCClient, indexerQueryClient),
    [nodeRPCClient, indexerQueryClient],
  );

  const realmRepository = useMemo(
    () => new RealmRepository(indexerQueryClient),
    [indexerQueryClient],
  );

  return (
    <ServiceContext.Provider
      value={{
        chainRepository,
        blockRepository,
        transactionRepository,
        realmRepository,
      }}>
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceProvider;
