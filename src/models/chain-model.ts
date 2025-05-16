export interface ChainModel {
  name: string;

  chainId: string;

  apiUrl: string | null;

  rpcUrl: string | null;

  indexerUrl: string | null;

  gnoWebUrl?: string | null;
}

export type ChainSupportType = "ALL" | "RPC_WITH_INDEXER" | "RPC" | "NONE";

export function getChainSupportType(chain: ChainModel): ChainSupportType {
  if (chain.apiUrl) {
    return "ALL";
  }

  if (chain.rpcUrl && chain.indexerUrl) {
    return "RPC_WITH_INDEXER";
  }

  if (chain.rpcUrl) {
    return "RPC";
  }

  return "NONE";
}
