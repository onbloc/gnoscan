import { useMemo } from "react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";

import { NetworkState } from "@/states";
import { getDefaultChain } from "@/common/config/network.config";
import { useNetworkProvider } from "./provider/use-network-provider";

export interface NetworkInfo {
  isCustom: boolean;
  chainId: string;
  apiUrl: string;
  rpcUrl: string;
  indexerUrl: string;
  gnoWebUrl: string | null;
}

export interface NetworkControls {
  currentNetwork: NetworkInfo | null;
  gnoWebUrl: string | null;
  getUrlWithNetwork: (uri: string) => string;
  changeNetwork: (chainId: string) => void;
  changeCustomNetwork: (rpcUrl: string, indexerUrl: string) => Promise<void>;
}

export const useNetwork = (): NetworkControls => {
  const { replace } = useRouter();
  const { currentNetwork: currentNetworkModel } = useNetworkProvider();
  const storedNetwork = useRecoilValue(NetworkState.currentNetwork);
  const chainData = useRecoilValue(NetworkState.chainData);
  const currentNetwork = currentNetworkModel ? storedNetwork : null;

  const networkParams = useMemo((): Record<string, string> | null => {
    if (!currentNetwork) {
      return null;
    }

    if (currentNetwork.isCustom) {
      return {
        type: "custom",
        rpcUrl: currentNetwork.rpcUrl,
        indexerUrl: currentNetwork.indexerUrl,
      };
    }

    if (currentNetwork.chainId === getDefaultChain(chainData)?.chainId) {
      return null;
    }

    return {
      chainId: currentNetwork.chainId,
    };
  }, [currentNetwork, chainData]);

  const gnoWebUrl = currentNetwork?.gnoWebUrl || null;

  const getUrlWithNetworkData = (uri: string, networkParamData: Record<string, string> | null) => {
    try {
      const origin = typeof window === "undefined" ? "http://localhost" : window.location.origin;
      const url = new URL(uri, origin);
      if (url.origin !== origin) return uri;
      ["type", "rpcUrl", "indexerUrl", "chainId"].forEach(key => url.searchParams.delete(key));
      Object.entries(networkParamData || {}).forEach(([key, value]) => url.searchParams.set(key, value));
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return uri;
    }
  };

  const getUrlWithNetwork = (uri: string) => getUrlWithNetworkData(uri, networkParams);

  const changeNetwork = (chainId: string) => {
    const uri = window.location.pathname + window.location.search + window.location.hash;
    replace(getUrlWithNetworkData(uri, { chainId }));
  };

  const changeCustomNetwork = async (rpcUrl: string, indexerUrl: string) => {
    const uri = window.location.pathname + window.location.search + window.location.hash;
    await replace(
      getUrlWithNetworkData(uri, {
        type: "custom",
        rpcUrl,
        indexerUrl,
      }),
    );
  };

  return {
    currentNetwork,
    gnoWebUrl,
    getUrlWithNetwork,
    changeNetwork,
    changeCustomNetwork,
  };
};
