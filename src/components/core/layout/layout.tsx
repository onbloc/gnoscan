"use client";

import React, { useEffect } from "react";
import styled from "styled-components";
import { Header } from "@/components/view/header";
import { Footer } from "@/components/view/footer";
import mixins from "@/styles/mixins";
import useLoading from "@/common/hooks/use-loading";
import { CustomThemeProvider } from "./CustomThemeProvider";
import { useGetLatestBlockHeightIntervalQuery } from "@/common/react-query/block/queries";
import { useTokenMeta } from "@/common/hooks/common/use-token-meta";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isCustomNetwork } = useNetworkProvider();

  useLoading();

  useTokenMeta();
  // Only custom network views read the live block height, standard network views use the API.
  useGetLatestBlockHeightIntervalQuery({ enabled: isCustomNetwork });

  return (
    <CustomThemeProvider>
      <Wrapper>
        <Header />
        {children}
        <Footer />
      </Wrapper>
    </CustomThemeProvider>
  );
};

const Wrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")}
  background: ${({ theme }) => theme.colors.base};
  min-height: 100%;
  width: 100%;
  position: relative;
`;
