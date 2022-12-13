import React, {useEffect, useState} from 'react';
import styled, {ThemeProvider} from 'styled-components';
import theme from '@/styles/theme';
import {Header} from '@/components/view/header';
import {Footer} from '@/components/view/footer';
import mixins from '@/styles/mixins';
import useTheme from '@/common/hooks/use-theme';
import useLoading from '@/common/hooks/use-loading';

interface LayoutProps {
  children: React.ReactNode;
}

const Wrapper = styled.div`
  ${mixins.flexbox('column', 'center', 'center')}
  background: ${({theme}) => theme.colors.base};
  min-height: 100%;
  width: 100%;
  position: relative;
`;

export const Layout = ({children}: LayoutProps) => {
  const [themeMode] = useTheme();
  const {clearLoading} = useLoading();

  useEffect(() => {
    clearLoading();
  }, []);

  return (
    <ThemeProvider
      theme={{
        colors: themeMode === 'light' ? theme.lightTheme : theme.darkTheme,
        fonts: theme.fonts,
        device: theme.device,
      }}>
      <Wrapper>
        <Header />
        {children}
        <Footer />
      </Wrapper>
    </ThemeProvider>
  );
};
