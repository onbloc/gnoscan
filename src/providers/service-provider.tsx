import {useNetworkProvider} from '@/common/hooks/provider/use-network-provider';
import {AccountRepository, IAccountRepository} from '@/repositories/account-repository';
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
  accountRepository: IAccountRepository | null;
}

export const ServiceContext = createContext<ServiceContextProps | null>(null);

const ServiceProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const {indexerQueryClient, nodeRPCClient} = useNetworkProvider();

  const chainRepository = useMemo(
    () => (nodeRPCClient ? new ChainRepository(nodeRPCClient) : null),
    [nodeRPCClient],
  );

  const blockRepository = useMemo(
    () => (nodeRPCClient ? new BlockRepository(nodeRPCClient) : null),
    [nodeRPCClient],
  );

  const transactionRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }
    return new TransactionRepository(nodeRPCClient, indexerQueryClient);
  }, [nodeRPCClient, indexerQueryClient]);

  const realmRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }
    return new RealmRepository(nodeRPCClient, indexerQueryClient);
  }, [nodeRPCClient, indexerQueryClient]);

  const accountRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }
    return new AccountRepository(nodeRPCClient, indexerQueryClient);
  }, [nodeRPCClient, indexerQueryClient]);

  return (
    <ServiceContext.Provider
      value={{
        chainRepository,
        blockRepository,
        transactionRepository,
        realmRepository,
        accountRepository,
      }}>
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceProvider;
