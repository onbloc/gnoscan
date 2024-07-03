import {firstStrUpperCase} from '@/common/utils/string-util';

export const searchQuerySelector = (data: any) => {
  const result: {[key in string]: any} = {};
  Object.entries(data).filter((v, i) => {
    if (v[1] !== null) {
      const key = firstStrUpperCase(v[0]);
      const value = v[1];
      return (result[key] = value);
    }
  });
  return result;
};
