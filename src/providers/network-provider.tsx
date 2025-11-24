import { useRecoilState } from "recoil";
import { useRouter } from "@/common/hooks/common/use-router";
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

interface NetworkContextProps {
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

  useEffect(() => {
    setChainData(chains);
  }, [chains, setChainData]);

  useEffect(() => {
    // Wait until the router is ready (before query parameter parsing is complete)
    if (!router.isReady) return;

    // If the network is already configured, prevent duplicate execution
    if (currentNetwork) return;

    // Custom Network Type Handling
    if (router.query?.type === "custom") {
      setCurrentNetwork({
        isCustom: true,
        chainId: "",
        apiUrl: "",
        rpcUrl: router.query?.rpcUrl?.toString() || "",
        indexerUrl: router.query?.indexerUrl?.toString() || "",
        gnoWebUrl: null,
      });
      return;
    }

    // Extract the requested chainId from the URL
    const requestedChainId = router.query?.chainId?.toString();
    // Find the chain matching the requested chainId
    const chain = requestedChainId ? chains.find(chain => chain.chainId === requestedChainId) : null;

    // If no valid chain exists, use the default chain (first one)
    const selectedChain = chain || chains[0];

    // Warning log when an invalid chainId is entered
    if (requestedChainId && !chain) {
      console.warn(`Invalid ChainId: ${requestedChainId}, using default chain: ${chains[0].chainId}`);
    }

    // Network settings for the selected chain
    setCurrentNetwork({
      isCustom: false,
      chainId: selectedChain.chainId,
      apiUrl: selectedChain.apiUrl || "",
      rpcUrl: selectedChain.rpcUrl || "",
      indexerUrl: selectedChain.indexerUrl || "",
      gnoWebUrl: selectedChain?.gnoWebUrl || null,
    });
  }, [router.isReady, router.query, chains]);

  const currentNetworkModel: ChainModel | null = useMemo(() => {
    if (!currentNetwork) {
      return null;
    }

    if (currentNetwork?.isCustom) {
      return {
        name: "Custom Network",
        chainId: "",
        apiUrl: null,
        rpcUrl: decodeURIComponent(currentNetwork.rpcUrl) || null,
        indexerUrl: decodeURIComponent(currentNetwork.indexerUrl) || null,
      };
    }
    const chain = chains.find(chain => chain.chainId === currentNetwork?.chainId?.toString()) || chains[0];
    return chain;
  }, [currentNetwork]);

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
    return new NodeRPCClient(rpcUrl, currentNetworkModel.chainId);
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
    const mainNetwork = chains.find(chain => chain.chainId === "staging");
    if (!mainNetwork) {
      return null;
    }

    return new NodeRPCClient(mainNetwork.rpcUrl || "", mainNetwork.chainId);
  }, [chains]);

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
