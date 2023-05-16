import {isEmptyObj} from '@/common/utils';
import {firstStrUpperCase} from '@/common/utils/string-util';

export const searchQuerySelector = (data: any) => {
  const checkedObj = isEmptyObj(data);
  if (checkedObj) {
    return null;
  } else {
    const convert = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => {
        if (value === null) return;
        return [firstStrUpperCase(key), value];
      }),
    );

    return convert;
  }
};
