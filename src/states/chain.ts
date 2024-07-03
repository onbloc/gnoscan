import {atom} from 'recoil';
import {v1} from 'uuid';

export const chainID = atom({
  key: `chain/chainID/${v1()}`,
  default: 'portal-loop',
});
