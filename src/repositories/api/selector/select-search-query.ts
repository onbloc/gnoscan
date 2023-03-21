import {isEmptyObj} from '@/common/utils';
import {firstStrUpperCase} from '@/common/utils/string-util';

export const searchQuerySelector = (data: any) => {
  const checkedObj = isEmptyObj(data);
  if (checkedObj) {
    return null;
  } else {
    const convert = Object.fromEntries(
      Object.entries(data).map(([key]) => [firstStrUpperCase(key), data[key]]),
    );
    return convert;
  }
};
