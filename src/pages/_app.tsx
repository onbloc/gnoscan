import React from 'react';
import type {AppProps} from 'next/app';
import {GlobalStyle} from '../styles';
import {RecoilRoot} from 'recoil';
import {Hydrate, QueryClient, QueryClientProvider} from 'react-query';
import {Layout} from '@/components/core/layout';
import {ErrorBoundary} from '@/components/core/error-boundary';
import 'antd/dist/reset.css';
import Meta from '@/components/core/layout/meta';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = ({Component, pageProps}: any) => {
  return (
    <>
      <Meta />
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
