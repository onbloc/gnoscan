import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { AccountRepository, IAccountRepository } from "@/repositories/account-repository";
import { OnblocAccountRepository } from "@/repositories/account-repository/onbloc-account-repository";
import { ApiBlockRepositoryImpl, ApiBlockRepository } from "@/repositories/api/block";
import { BlockRepository, IBlockRepository, OnblocBlockRepository } from "@/repositories/block-repository";
import { ChainRepository, IChainRepository } from "@/repositories/chain-repository";
import { IRealmRepository, RealmRepository } from "@/repositories/realm-repository.ts";
import { OnblocRealmRepository } from "@/repositories/realm-repository.ts/onbloc-realm-repository";
import { ITransactionRepository, TransactionRepository } from "@/repositories/transaction-repository";
import { OnblocTransactionRepository } from "@/repositories/transaction-repository/onbloc-transaction-repository";
import { createContext, useMemo } from "react";

interface ServiceContextProps {
  chainRepository: IChainRepository | null;
  blockRepository: IBlockRepository | null;
  apiBlockRepository: ApiBlockRepository | null;
  transactionRepository: ITransactionRepository | null;
  realmRepository: IRealmRepository | null;
  accountRepository: IAccountRepository | null;
}

export const ServiceContext = createContext<ServiceContextProps | null>(null);

const ServiceProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { indexerQueryClient, nodeRPCClient, onblocRPCClient, onblocAPIClient, mainNodeRPCClient, isCustomNetwork } =
    useNetworkProvider();

  const chainRepository = useMemo(() => (nodeRPCClient ? new ChainRepository(nodeRPCClient) : null), [nodeRPCClient]);

  const blockRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }

    if (!isCustomNetwork) {
      return new OnblocBlockRepository(nodeRPCClient, indexerQueryClient);
    }

    return new BlockRepository(nodeRPCClient, indexerQueryClient);
  }, [nodeRPCClient, isCustomNetwork, indexerQueryClient]);

  const apiBlockRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }

    return new ApiBlockRepositoryImpl(onblocAPIClient);
  }, [nodeRPCClient, onblocAPIClient, isCustomNetwork]);

  const transactionRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }

    if (!isCustomNetwork && onblocRPCClient) {
      return new OnblocTransactionRepository(nodeRPCClient, indexerQueryClient, onblocRPCClient);
    }

    return new TransactionRepository(nodeRPCClient, indexerQueryClient);
  }, [nodeRPCClient, isCustomNetwork, indexerQueryClient, onblocRPCClient]);

  const realmRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }

    if (!isCustomNetwork) {
      return new OnblocRealmRepository(nodeRPCClient, indexerQueryClient, onblocRPCClient, mainNodeRPCClient);
    }

    return new RealmRepository(nodeRPCClient, indexerQueryClient, mainNodeRPCClient);
  }, [nodeRPCClient, isCustomNetwork, indexerQueryClient, onblocRPCClient]);

  const accountRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }

    if (!isCustomNetwork) {
      return new OnblocAccountRepository(nodeRPCClient, indexerQueryClient);
    }

    return new AccountRepository(nodeRPCClient, indexerQueryClient);
  }, [nodeRPCClient, isCustomNetwork, indexerQueryClient]);

  return (
    <ServiceContext.Provider
      value={{
        chainRepository,
        blockRepository,
        apiBlockRepository,
        transactionRepository,
        realmRepository,
        accountRepository,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceProvider;
