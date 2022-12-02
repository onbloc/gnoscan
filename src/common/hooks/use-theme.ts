import {themeState} from '@/states';
import {useCallback, useLayoutEffect} from 'react';
import {useRecoilState} from 'recoil';

function useTheme() {
  const [themeMode, setTheme] = useRecoilState(themeState);

  const onChangeTheme = useCallback(() => {
    const updatedTheme = themeMode === 'light' ? 'dark' : 'light';
    setTheme(updatedTheme);
    sessionStorage.setItem('theme', updatedTheme);
  }, [themeMode]);

  useLayoutEffect(() => {
    const savedTheme = sessionStorage.getItem('theme');
    if (savedTheme && ['dark', 'light'].includes(savedTheme)) {
      setTheme(savedTheme);
      return;
    }
    if (window.matchMedia) {
      setTheme(() =>
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
      );
      return;
    }
  }, []);

  return [themeMode, onChangeTheme];
}

export default useTheme;
