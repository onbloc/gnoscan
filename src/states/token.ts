import {TokenModel} from '@/repositories/api/models/meta-token-model';
import {atom} from 'recoil';

export const tokenState = atom<TokenModel[]>({
  key: 'account/tokenInfo',
  default: [],
});
