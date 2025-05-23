import { ChainModel } from "@/models/chain-model";

export function getNetworksFromEnv(): ChainModel[] {
  const networks: ChainModel[] = [];

  if (
    process.env.NEXT_PUBLIC_NETWORK1_NAME &&
    process.env.NEXT_PUBLIC_NETWORK1_CHAIN_ID &&
    process.env.NEXT_PUBLIC_NETWORK1_API_URL &&
    process.env.NEXT_PUBLIC_NETWORK1_RPC_URL &&
    process.env.NEXT_PUBLIC_NETWORK1_INDEXER_URL
  ) {
    networks.push({
      name: process.env.NEXT_PUBLIC_NETWORK1_NAME,
      chainId: process.env.NEXT_PUBLIC_NETWORK1_CHAIN_ID,
      apiUrl: process.env.NEXT_PUBLIC_NETWORK1_API_URL || null,
      rpcUrl: process.env.NEXT_PUBLIC_NETWORK1_RPC_URL || null,
      indexerUrl: process.env.NEXT_PUBLIC_NETWORK1_INDEXER_URL || null,
      gnoWebUrl: process.env.NEXT_PUBLIC_NETWORK1_GNO_WEB_URL || null,
    });
  }

  if (
    process.env.NEXT_PUBLIC_NETWORK2_NAME &&
    process.env.NEXT_PUBLIC_NETWORK2_CHAIN_ID &&
    process.env.NEXT_PUBLIC_NETWORK2_API_URL &&
    process.env.NEXT_PUBLIC_NETWORK2_RPC_URL &&
    process.env.NEXT_PUBLIC_NETWORK2_INDEXER_URL
  ) {
    networks.push({
      name: process.env.NEXT_PUBLIC_NETWORK2_NAME,
      chainId: process.env.NEXT_PUBLIC_NETWORK2_CHAIN_ID,
      apiUrl: process.env.NEXT_PUBLIC_NETWORK2_API_URL || null,
      rpcUrl: process.env.NEXT_PUBLIC_NETWORK2_RPC_URL || null,
      indexerUrl: process.env.NEXT_PUBLIC_NETWORK2_INDEXER_URL || null,
      gnoWebUrl: process.env.NEXT_PUBLIC_NETWORK2_GNO_WEB_URL || null,
    });
  }

  return networks;
}

export function getNetworkConfig(defaultChains: ChainModel[]): ChainModel[] {
  const envNetworks = getNetworksFromEnv();

  if (envNetworks.length > 0) {
    return envNetworks;
  }

  return defaultChains;
}

export function getNetworkByChainId(chainId: string, networks: ChainModel[]): ChainModel | undefined {
  return networks.find(network => network.chainId === chainId);
}
