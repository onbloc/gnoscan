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
import ChainData from 'public/resource/chains.json';
import NetworkProvider from '@/providers/network-provider';
import ServiceProvider from '@/providers/service-provider';

const App: React.FC = ({Component, pageProps}: any) => {
  return (
    <>
      <Meta />
      <GoogleAnalytics />
      <QueryClientProvider client={new QueryClient()}>
        <Hydrate state={pageProps.dehydratedState}>
          <RecoilRoot>
            <ErrorBoundary fallback={<div>ERROR</div>}>
              <NetworkProvider chains={ChainData}>
                <ServiceProvider>
                  <Layout>
                    <GlobalStyle />
                    <Component {...pageProps} />
                  </Layout>
                </ServiceProvider>
              </NetworkProvider>
            </ErrorBoundary>
          </RecoilRoot>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
};

export default App;
