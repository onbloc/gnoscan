/* eslint-disable @typescript-eslint/no-explicit-any */
import { NetworkState } from "@/states";
import React, { useMemo } from "react";
import { useRecoilState } from "recoil";
import ChainData from "public/resource/chains.json";
import { useRouter } from "next/router";
import { makeQueryString } from "../utils/string-util";

const MIN_LOADING_DURATION = 1000;

type NetworkTransitionState = {
  isPending: boolean;
  startTime: number | null;
  timerId: NodeJS.Timeout | null;
};

function parseSearchString(search: string) {
  if (!search || search.length === 1) {
    return {};
  }

  return search
    .replace("?", "")
    .split("&")
    .reduce<{ [key in string]: string }>((accum, current) => {
      const separatorIndex = current.indexOf("=");
      if (separatorIndex < 0 || separatorIndex + 1 >= current.length) {
        return accum;
      }

      const values = [
        current.substring(0, separatorIndex),
        decodeURIComponent(current.substring(separatorIndex + 1, current.length)),
      ];
      if (values.length === 0) {
        return accum;
      }

      if (["type", "rpcUrl", "indexerUrl", "chainId"].includes(values[0])) {
        return accum;
      }

      accum[values[0]] = values.length > 1 ? values[1] : "";
      return accum;
    }, {});
}

export const useNetwork = () => {
  const { replace } = useRouter();
  const [currentNetwork, setCurrentNetwork] = useRecoilState(NetworkState.currentNetwork);
  const [isNetworkSwitching, setIsNetworkSwitching] = React.useState(false);

  const networkTransitionRef = React.useRef<NetworkTransitionState>({
    isPending: false,
    startTime: null,
    timerId: null,
  });

  const networkParams = useMemo(() => {
    if (!currentNetwork || currentNetwork.chainId === ChainData[0].chainId) {
      return null;
    }

    if (currentNetwork.isCustom) {
      return {
        type: "custom",
        rpcUrl: currentNetwork.rpcUrl,
        indexerUrl: currentNetwork.indexerUrl,
      };
    }

    return {
      chainId: currentNetwork?.chainId || "",
    };
  }, [currentNetwork]);

  const startLoading = React.useCallback(() => {
    const transitionState = networkTransitionRef.current;

    if (transitionState.timerId) {
      clearTimeout(transitionState.timerId);
      transitionState.timerId = null;
    }

    setIsNetworkSwitching(true);
    transitionState.isPending = true;
    transitionState.startTime = Date.now();
  }, []);

  const finishLoading = React.useCallback(() => {
    const transitionState = networkTransitionRef.current;

    if (!transitionState.isPending) return;

    const elapsedTime = transitionState.startTime ? Date.now() - transitionState.startTime : 0;
    const remainingTime = Math.max(0, MIN_LOADING_DURATION - elapsedTime);

    transitionState.timerId = setTimeout(() => {
      setIsNetworkSwitching(false);
      transitionState.isPending = false;
      transitionState.startTime = null;
      transitionState.timerId = null;
    }, remainingTime);
  }, []);

  React.useEffect(() => {
    return () => {
      const { timerId } = networkTransitionRef.current;
      if (timerId) clearTimeout(timerId);
    };
  }, []);

  const getUrlWithNetwork = (uri: string) => {
    return getUrlWithNetworkData(uri, networkParams);
  };

  const getUrlWithNetworkData = (uri: string, networkParamData: any) => {
    try {
      const origin = window.location.origin;
      const urlData = new URL(origin + uri);
      const params = { ...networkParamData, ...parseSearchString(urlData.search) };
      const queryString = makeQueryString(params);

      if (!queryString) {
        return uri;
      }

      return `${urlData.pathname}?${queryString}`;
    } catch {}
    return uri;
  };

  const changeNetwork = (chainId: string) => {
    const chain = ChainData.find(chain => chain.chainId === chainId) || ChainData[0];

    setCurrentNetwork({
      isCustom: false,
      chainId: chain.chainId,
      apiUrl: chain.apiUrl,
      rpcUrl: chain.rpcUrl,
      indexerUrl: chain.indexerUrl,
    });

    const uri = window.location.pathname + window.location.search;
    replace(
      getUrlWithNetworkData(uri, {
        chainId,
      }),
    );
  };

  const changeCustomNetwork = async (rpcUrl: string, indexerUrl: string) => {
    startLoading();

    setCurrentNetwork({
      isCustom: true,
      chainId: "",
      apiUrl: "",
      rpcUrl,
      indexerUrl,
    });

    const uri = window.location.pathname + window.location.search;
    try {
      await replace(
        getUrlWithNetworkData(uri, {
          type: "custom",
          rpcUrl,
          indexerUrl,
        }),
      );
    } finally {
      finishLoading();
    }
  };

  return {
    isNetworkSwitching,
    currentNetwork,
    getUrlWithNetwork,
    setCurrentNetwork,
    changeNetwork,
    changeCustomNetwork,
  };
};
