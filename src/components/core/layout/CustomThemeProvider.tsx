import React, {useEffect, useState} from 'react';
import {ThemeProvider} from 'styled-components';
import theme, {Palette} from '@/styles/theme';
import {useRecoilState} from 'recoil';
import {themeState} from '@/states';
import {setItem, getItem} from '@/repositories/storage/storage';

export const CustomThemeProvider = ({children}: {children: React.ReactElement}) => {
  const [mounted, setMounted] = useState(false);
  const [themeMode, setThemeMode] = useRecoilState(themeState);
  const [palette, setPalette] = useState<Palette | null>(null);

  useEffect(() => {
    setMounted(true);
    const localThemeValue = getItem('theme');
    if (!localThemeValue) {
      setItem('theme', 'light');
      setPalette(theme.lightTheme);
      setThemeMode('light');
    } else {
      setPalette(localThemeValue === 'dark' ? theme.darkTheme : theme.lightTheme);
      setThemeMode(localThemeValue);
    }
  }, [themeMode]);

  const body = (
    <ThemeProvider
      theme={{
        colors: palette,
        fonts: theme.fonts,
        device: theme.device,
      }}>
      {children}
    </ThemeProvider>
  );

  if (!mounted || !palette) return <></>;
  return body;
};
