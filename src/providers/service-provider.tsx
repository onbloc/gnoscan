import { createContext, useMemo } from "react";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { AccountRepository, IAccountRepository } from "@/repositories/account-repository";
import { OnblocAccountRepository } from "@/repositories/account-repository/onbloc-account-repository";
import { BlockRepository, IBlockRepository, OnblocBlockRepository } from "@/repositories/block-repository";
import { ChainRepository, IChainRepository } from "@/repositories/chain-repository";
import { IRealmRepository, RealmRepository } from "@/repositories/realm-repository.ts";
import { OnblocRealmRepository } from "@/repositories/realm-repository.ts/onbloc-realm-repository";
import { ITransactionRepository, TransactionRepository } from "@/repositories/transaction-repository";
import { OnblocTransactionRepository } from "@/repositories/transaction-repository/onbloc-transaction-repository";

import { ApiAccountRepository, ApiAccountRepositoryImpl } from "@/repositories/api/account";
import { ApiBlockRepository, ApiBlockRepositoryImpl } from "@/repositories/api/block";
import { ApiTransactionRepository, ApiTransactionRepositoryImpl } from "@/repositories/api/transaction";
import { ApiRealmRepository, ApiRealmRepositoryImpl } from "@/repositories/api/realm";
import { ApiTokenRepository, ApiTokenRepositoryImpl } from "@/repositories/api/token";
import { ApiStatisticsRepository, ApiStatisticsRepositoryImpl } from "@/repositories/api/statistics";

interface ServiceContextProps {
  chainRepository: IChainRepository | null;
  blockRepository: IBlockRepository | null;
  transactionRepository: ITransactionRepository | null;
  realmRepository: IRealmRepository | null;
  accountRepository: IAccountRepository | null;
  apiAccountRepository: ApiAccountRepository | null;
  apiBlockRepository: ApiBlockRepository | null;
  apiTransactionRepository: ApiTransactionRepository | null;
  apiRealmRepository: ApiRealmRepository | null;
  apiTokenRepository: ApiTokenRepository | null;
  apiStatisticsRepository: ApiStatisticsRepository | null;
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

  const apiAccountRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }

    return new ApiAccountRepositoryImpl(onblocAPIClient);
  }, [nodeRPCClient, onblocAPIClient, isCustomNetwork]);

  const apiBlockRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }

    return new ApiBlockRepositoryImpl(onblocAPIClient);
  }, [nodeRPCClient, onblocAPIClient, isCustomNetwork]);

  const apiTransactionRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }

    return new ApiTransactionRepositoryImpl(onblocAPIClient);
  }, [nodeRPCClient, onblocAPIClient, isCustomNetwork]);

  const apiRealmRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }

    return new ApiRealmRepositoryImpl(onblocAPIClient);
  }, [nodeRPCClient, onblocAPIClient, isCustomNetwork]);

  const apiTokenRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }

    return new ApiTokenRepositoryImpl(onblocAPIClient);
  }, [nodeRPCClient, onblocAPIClient, isCustomNetwork]);

  const apiStatisticsRepository = useMemo(() => {
    if (!nodeRPCClient) {
      return null;
    }

    return new ApiStatisticsRepositoryImpl(onblocAPIClient);
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
        transactionRepository,
        realmRepository,
        accountRepository,
        apiAccountRepository,
        apiBlockRepository,
        apiTransactionRepository,
        apiRealmRepository,
        apiTokenRepository,
        apiStatisticsRepository,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export default ServiceProvider;
