import {BaseSyntheticEvent, useEffect, useRef} from 'react';

const useOutSideClick = (callback: (e?: CustomEvent<MouseEvent | TouchEvent>) => void) => {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const listener = (event: BaseSyntheticEvent | MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', listener as EventListener);
    document.addEventListener('touchstart', listener as EventListener);
    return () => {
      document.removeEventListener('mousedown', listener as EventListener);
      document.removeEventListener('touchstart', listener as EventListener);
    };
  }, [callback, ref]);

  return ref;
};

export default useOutSideClick;
