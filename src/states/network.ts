import {atom} from 'recoil';
import {v1} from 'uuid';

export const currentNetwork = atom<{
  isCustom: boolean;
  chainId: string;
  rpcUrl: string;
  indexerUrl: string;
} | null>({
  key: `network/currentNetwork/${v1()}`,
  default: null,
});
