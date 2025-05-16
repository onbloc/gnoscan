import { atom } from "recoil";
import { v1 } from "uuid";

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
