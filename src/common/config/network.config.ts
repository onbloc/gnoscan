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

  if (
    process.env.NEXT_PUBLIC_NETWORK3_NAME &&
    process.env.NEXT_PUBLIC_NETWORK3_CHAIN_ID &&
    process.env.NEXT_PUBLIC_NETWORK3_API_URL &&
    process.env.NEXT_PUBLIC_NETWORK3_RPC_URL &&
    process.env.NEXT_PUBLIC_NETWORK3_INDEXER_URL
  ) {
    networks.push({
      name: process.env.NEXT_PUBLIC_NETWORK3_NAME,
      chainId: process.env.NEXT_PUBLIC_NETWORK3_CHAIN_ID,
      apiUrl: process.env.NEXT_PUBLIC_NETWORK3_API_URL || null,
      rpcUrl: process.env.NEXT_PUBLIC_NETWORK3_RPC_URL || null,
      indexerUrl: process.env.NEXT_PUBLIC_NETWORK3_INDEXER_URL || null,
      gnoWebUrl: process.env.NEXT_PUBLIC_NETWORK3_GNO_WEB_URL || null,
    });
  }

  return networks;
}

export function applyNetworkOrder(chains: ChainModel[]): ChainModel[] {
  const orderValue = process.env.NEXT_PUBLIC_NETWORK_ORDER;
  if (!orderValue) return chains;

  const orderIds = orderValue
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
  if (orderIds.length === 0) return chains;

  const byId = new Map(chains.map(c => [c.chainId, c]));
  const used = new Set<string>();
  const ordered: ChainModel[] = [];

  for (const id of orderIds) {
    const chain = byId.get(id);
    if (chain && !used.has(id)) {
      ordered.push(chain);
      used.add(id);
    }
  }
  for (const chain of chains) {
    if (!used.has(chain.chainId)) ordered.push(chain);
  }
  return ordered;
}

export function getDefaultChain(chains: ChainModel[]): ChainModel | undefined {
  if (chains.length === 0) return undefined;
  const defaultId = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID;
  if (defaultId) {
    const match = chains.find(c => c.chainId === defaultId);
    if (match) return match;
  }
  return chains[0];
}

export function getNetworkConfig(defaultChains: ChainModel[]): ChainModel[] {
  const envNetworks = getNetworksFromEnv();
  const chains = envNetworks.length > 0 ? envNetworks : defaultChains;
  return applyNetworkOrder(chains);
}

export function getNetworkByChainId(chainId: string, networks: ChainModel[]): ChainModel | undefined {
  return networks.find(network => network.chainId === chainId);
}
