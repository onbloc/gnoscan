import theme from '@/styles/theme';
import {atom} from 'recoil';
import {v1} from 'uuid';

export const currentNetwork = atom({
  key: `network/currentNetwork/${v1()}`,
  default: 'test3',
});
