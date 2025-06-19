/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { RecoilRoot } from "recoil";
import { GlobalStyle } from "../styles";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { Layout } from "@/components/core/layout";
import { ErrorBoundary } from "@/components/core/error-boundary";
import "antd/dist/reset.css";
import Meta from "@/components/core/layout/meta";
import GoogleAnalytics from "@/components/core/layout/google-analytics";
import DefaultChainData from "public/resource/chains.json";
import NetworkProvider from "@/providers/network-provider";
import ServiceProvider from "@/providers/service-provider";
import { getNetworkConfig } from "@/common/config/network.config";

const App: React.FC = ({ Component, pageProps }: any) => {
  const networks = getNetworkConfig(DefaultChainData);

  return (
    <>
      <Meta />
      <GoogleAnalytics />
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                cacheTime: 60 * 1000,
                staleTime: 60 * 1000,
              },
            },
          })
        }
      >
        <Hydrate state={pageProps.dehydratedState}>
          <RecoilRoot>
            <ErrorBoundary fallback={<div>ERROR</div>}>
              <NetworkProvider chains={networks}>
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
