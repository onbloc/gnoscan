import { useRecoilState } from "recoil";
import { useRouter } from "next/router";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createContext, useEffect, useMemo } from "react";

import { IndexerClient } from "@/common/clients/indexer-client/indexer-client";
import { NetworkClient } from "@/common/clients/network-client";
import { AxiosClient } from "@/common/clients/network-client/axios-client";
import { NodeRPCClient } from "@/common/clients/node-client";
import { RPCClient } from "@/common/clients/rpc-client";
import { HttpRPCClient } from "@/common/clients/rpc-client/http-rpc-client";

import { ChainModel, getChainSupportType } from "@/models/chain-model";
import { NetworkState } from "@/states";
import { getDefaultChain } from "@/common/config/network.config";

export interface NetworkContextProps {
  chains: ChainModel[];

  currentNetwork: ChainModel | null;

  isCustomNetwork: boolean;

  nodeRPCClient: NodeRPCClient | null;

  // current main is staging
  mainNodeRPCClient: NodeRPCClient | null;

  indexerQueryClient: IndexerClient | null;

  onblocRPCClient: RPCClient | null;

  onblocAPIClient: NetworkClient | null;
}

export const NetworkContext = createContext<NetworkContextProps | null>(null);

interface NetworkProviderPros {
  chains: ChainModel[];
}

const NetworkProvider: React.FC<React.PropsWithChildren<NetworkProviderPros>> = ({ chains, children }) => {
  const router = useRouter();
  const [currentNetwork, setCurrentNetwork] = useRecoilState(NetworkState.currentNetwork);
  const [, setChainData] = useRecoilState(NetworkState.chainData);

  const requestedChainId = router.query.chainId?.toString();
  const networkType = router.query.type === "custom" ? "custom" : null;
  const rpcUrl = networkType === "custom" ? router.query.rpcUrl?.toString() || "" : "";
  const indexerUrl = networkType === "custom" ? router.query.indexerUrl?.toString() || "" : "";
  const selectedChain = useMemo(
    () =>
      networkType === "custom"
        ? undefined
        : chains.find(chain => chain.chainId === requestedChainId) || getDefaultChain(chains),
    [chains, networkType, requestedChainId],
  );
  const routeNetwork = useMemo(() => {
    if (!router.isReady) return null;
    if (networkType === "custom") {
      return {
        isCustom: true,
        chainId: "",
        apiUrl: "",
        rpcUrl,
        indexerUrl,
        gnoWebUrl: null,
      };
    }
    if (!selectedChain) return null;
    return {
      isCustom: false,
      chainId: selectedChain.chainId,
      apiUrl: selectedChain.apiUrl || "",
      rpcUrl: selectedChain.rpcUrl || "",
      indexerUrl: selectedChain.indexerUrl || "",
      gnoWebUrl: selectedChain.gnoWebUrl || null,
    };
  }, [router.isReady, networkType, rpcUrl, indexerUrl, selectedChain]);
  const isNetworkReady =
    !!routeNetwork &&
    !!currentNetwork &&
    currentNetwork.isCustom === routeNetwork.isCustom &&
    currentNetwork.chainId === routeNetwork.chainId &&
    currentNetwork.apiUrl === routeNetwork.apiUrl &&
    currentNetwork.rpcUrl === routeNetwork.rpcUrl &&
    currentNetwork.indexerUrl === routeNetwork.indexerUrl &&
    (currentNetwork.gnoWebUrl || null) === routeNetwork.gnoWebUrl;

  useEffect(() => {
    setChainData(chains);
  }, [chains, setChainData]);

  useEffect(() => {
    if (routeNetwork && !isNetworkReady) {
      setCurrentNetwork(routeNetwork);
    }
  }, [routeNetwork, isNetworkReady, setCurrentNetwork]);

  useEffect(() => {
    if (
      router.isReady &&
      networkType !== "custom" &&
      requestedChainId &&
      selectedChain &&
      requestedChainId !== selectedChain.chainId
    ) {
      console.warn(`Invalid ChainId: ${requestedChainId}, using default chain: ${selectedChain.chainId}`);
    }
  }, [router.isReady, networkType, requestedChainId, selectedChain]);

  const currentNetworkModel: ChainModel | null = useMemo(() => {
    // Keep the layout mounted, but never expose the previous route's network.
    if (!isNetworkReady || !routeNetwork) return null;
    if (routeNetwork.isCustom) {
      return {
        name: "Custom Network",
        chainId: "",
        apiUrl: null,
        rpcUrl: decodeURIComponent(routeNetwork.rpcUrl) || null,
        // A user-supplied endpoint has no fallback to rotate to.
        fallbackRpcUrl: null,
        indexerUrl: decodeURIComponent(routeNetwork.indexerUrl) || null,
      };
    }
    return selectedChain || null;
  }, [isNetworkReady, routeNetwork, selectedChain]);

  const isCustomNetwork = useMemo(() => {
    if (!currentNetworkModel) {
      return false;
    }

    if (!currentNetworkModel.apiUrl) {
      return true;
    }

    return false;
  }, [currentNetworkModel]);

  const nodeRPCClient = useMemo(() => {
    if (!currentNetworkModel) {
      return null;
    }
    const chainSupportType = getChainSupportType(currentNetworkModel);
    if (!["ALL", "RPC_WITH_INDEXER", "RPC"].includes(chainSupportType)) {
      return null;
    }

    const rpcUrl = currentNetworkModel.rpcUrl || currentNetworkModel.apiUrl || "";
    // The fallback stands in for `rpcUrl`, so it does not apply once `apiUrl` is the primary.
    const fallbackRpcUrl = currentNetworkModel.rpcUrl ? currentNetworkModel.fallbackRpcUrl : null;
    return new NodeRPCClient(rpcUrl, currentNetworkModel.chainId, fallbackRpcUrl);
  }, [currentNetworkModel]);

  const indexerQueryClient = useMemo(() => {
    if (!currentNetworkModel) {
      return null;
    }
    const chainSupportType = getChainSupportType(currentNetworkModel);
    if (!["ALL", "RPC_WITH_INDEXER"].includes(chainSupportType)) {
      return null;
    }

    const indexerQueryUrl = currentNetworkModel.indexerUrl + "/graphql/query";
    return new IndexerClient(indexerQueryUrl);
  }, [currentNetworkModel]);

  const onblocAPIClient = useMemo(() => {
    if (!currentNetworkModel) {
      return null;
    }
    const chainSupportType = getChainSupportType(currentNetworkModel);
    if (!["ALL"].includes(chainSupportType)) {
      return null;
    }

    const apiUrl = currentNetworkModel.apiUrl || "";
    return new AxiosClient(apiUrl, () => {});
  }, [currentNetworkModel]);

  const onblocRPCClient = useMemo(() => {
    if (!currentNetworkModel) {
      return null;
    }
    const chainSupportType = getChainSupportType(currentNetworkModel);
    if (!["RPC"].includes(chainSupportType)) {
      return null;
    }

    const rpcUrl = `${currentNetworkModel.apiUrl || ""}/gno`;
    return new HttpRPCClient(rpcUrl);
  }, [currentNetworkModel]);

  const mainNodeRPCClient = useMemo(() => {
    if (!currentNetworkModel) return null;
    const mainNetwork = chains.find(chain => chain.chainId === "staging");
    if (!mainNetwork) {
      return null;
    }

    return new NodeRPCClient(mainNetwork.rpcUrl || "", mainNetwork.chainId, mainNetwork.fallbackRpcUrl);
  }, [chains, currentNetworkModel]);

  const apolloClient = useMemo(() => {
    if (!indexerQueryClient) {
      return new ApolloClient({ cache: new InMemoryCache() });
    }

    return indexerQueryClient.apolloClient;
  }, [indexerQueryClient]);

  return (
    <NetworkContext.Provider
      value={{
        chains,
        isCustomNetwork,
        currentNetwork: currentNetworkModel,
        nodeRPCClient,
        indexerQueryClient,
        onblocAPIClient,
        onblocRPCClient,
        mainNodeRPCClient,
      }}
    >
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </NetworkContext.Provider>
  );
};

export default NetworkProvider;
