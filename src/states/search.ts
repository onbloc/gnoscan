import {atom} from 'recoil';
import {v1} from 'uuid';

export const searchState = atom({
  key: `search/${v1()}`,
  default: '',
});
