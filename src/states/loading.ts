import {atom} from 'recoil';
import {v1} from 'uuid';

export const loadingState = atom({
  key: `loading/${v1()}`,
  default: true,
});
