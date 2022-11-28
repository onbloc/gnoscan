import {atom} from 'recoil';
import {v1} from 'uuid';

// type Theme = | 'dark' | 'light' | ''

// export interface ThemeType {
//   theme: Theme
// }

export const themeState = atom({
  key: `theme/${v1()}`,
  default: '',
});
