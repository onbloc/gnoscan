import React from 'react';
import type {AppProps} from 'next/app';
import {GlobalStyle} from '../styles';
import {RecoilRoot} from 'recoil';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Layout} from '@/components/core/layout';
import Head from 'next/head';
import {ErrorBoundary} from '@/components/core/error-boundary';

import 'antd/dist/reset.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC<AppProps<any>> = ({Component, pageProps}: AppProps) => {
  return (
    <>
      <Head>
        <title>Gnoscan - Gnoland Blockchain Explorer</title>
      </Head>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <ErrorBoundary fallback={<div>ERROR</div>}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ErrorBoundary>
        </RecoilRoot>
      </QueryClientProvider>
    </>
  );
};

export default App;
