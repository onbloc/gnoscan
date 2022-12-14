import {Dispatch, SetStateAction} from 'react';
import {RecoilState} from 'recoil';

export function textEllipsis(value: string, num?: number): string {
  const length = num ?? 4;
  return value.length < 10 ? value : `${value.slice(0, length)}...${value.slice(-length)}`;
}

export const debounce = (callback: any, duration: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (v: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(v), duration);
  };
};

export const firstStrUpperCase = (v: string) => {
  return v.replace(/^[a-z]/, char => char.toUpperCase());
};
