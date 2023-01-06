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

const App: React.FC = ({Component, pageProps}: any) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <>
      <Meta />
      <GoogleAnalytics />
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <RecoilRoot>
            <ErrorBoundary fallback={<div>ERROR</div>}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ErrorBoundary>
          </RecoilRoot>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
};

export default App;
