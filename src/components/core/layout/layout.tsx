import React, {useEffect} from 'react';
import styled, {ThemeProvider} from 'styled-components';
import Head from 'next/head';
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

  useEffect(() => console.log(themeMode), [themeMode]);

  useEffect(() => {
    clearLoading();
  }, []);

  return (
    <ThemeProvider
      theme={{
        colors: themeMode === 'dark' ? theme.darkTheme : theme.lightTheme,
        fonts: theme.fonts,
        device: theme.device,
      }}>
      <Head>
        <title>Gnoscan</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Wrapper>
        <Header />
        {children}
        <Footer />
      </Wrapper>
    </ThemeProvider>
  );
};
