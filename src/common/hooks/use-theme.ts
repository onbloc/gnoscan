import {themeState} from '@/states';
import {useCallback, useLayoutEffect} from 'react';
import {useRecoilState} from 'recoil';

function useTheme() {
  const [themeMode, setTheme] = useRecoilState(themeState);

  const onChangeTheme = useCallback(() => {
    const updatedTheme = themeMode === 'light' ? 'dark' : 'light';
    setTheme(updatedTheme);
    localStorage.setItem('theme', updatedTheme);
  }, [themeMode]);

  useLayoutEffect(() => {
    const savedTheme = localStorage.getItem('theme') ?? 'dark';
    if (savedTheme && ['dark', 'light'].includes(savedTheme)) {
      setTheme(savedTheme);
      return;
    }
  }, []);

  return [themeMode, onChangeTheme];
}

export default useTheme;
