import React from 'react';
import type {AppProps} from 'next/app';
import {GlobalStyle} from '../styles';
import {RecoilRoot} from 'recoil';
import {Hydrate, QueryClient, QueryClientProvider} from 'react-query';
import {Layout} from '@/components/core/layout';
import {ErrorBoundary} from '@/components/core/error-boundary';
import 'antd/dist/reset.css';
import Meta from '@/components/core/layout/meta';
import GoogleAnalytics from '@/components/core/layout/google-analytics';
import GnoscanProvider from '@/providers/gnoscan-provider';
import ChainData from 'public/resource/chains.json';

const App: React.FC = ({Component, pageProps}: any) => {
  return (
    <>
      <Meta />
      <GoogleAnalytics />
      <QueryClientProvider client={new QueryClient()}>
        <Hydrate state={pageProps.dehydratedState}>
          <RecoilRoot>
            <ErrorBoundary fallback={<div>ERROR</div>}>
              <GnoscanProvider chains={ChainData}>
                <Layout>
                  <GlobalStyle />
                  <Component {...pageProps} />
                </Layout>
              </GnoscanProvider>
            </ErrorBoundary>
          </RecoilRoot>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
};

export default App;
