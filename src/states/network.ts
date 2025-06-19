import { atom } from "recoil";
import { v1 } from "uuid";

import { ChainModel } from "@/models/chain-model";
import DefaultChainData from "public/resource/chains.json";

export const currentNetwork = atom<{
  isCustom: boolean;
  chainId: string;
  apiUrl: string;
  rpcUrl: string;
  indexerUrl: string;
  gnoWebUrl: string | null;
} | null>({
  key: `network/currentNetwork/${v1()}`,
  default: null,
});

export const chainData = atom<ChainModel[]>({
  key: `network/chainData/${v1()}`,
  default: DefaultChainData,
});
