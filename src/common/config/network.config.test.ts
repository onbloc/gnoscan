import { getNetworksFromEnv, getNetworkConfig, applyNetworkOrder, getDefaultChain } from "./network.config";
import { ChainModel } from "@/models/chain-model";

const originalEnv = { ...process.env };

describe("Network configuration", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_NETWORK1_NAME;
    delete process.env.NEXT_PUBLIC_NETWORK1_CHAIN_ID;
    delete process.env.NEXT_PUBLIC_NETWORK1_API_URL;
    delete process.env.NEXT_PUBLIC_NETWORK1_RPC_URL;
    delete process.env.NEXT_PUBLIC_NETWORK1_INDEXER_URL;
    delete process.env.NEXT_PUBLIC_NETWORK1_GNO_WEB_URL;
    delete process.env.NEXT_PUBLIC_NETWORK2_NAME;
    delete process.env.NEXT_PUBLIC_NETWORK2_CHAIN_ID;
    delete process.env.NEXT_PUBLIC_NETWORK2_API_URL;
    delete process.env.NEXT_PUBLIC_NETWORK2_RPC_URL;
    delete process.env.NEXT_PUBLIC_NETWORK2_INDEXER_URL;
    delete process.env.NEXT_PUBLIC_NETWORK2_GNO_WEB_URL;
    delete process.env.NEXT_PUBLIC_NETWORK3_NAME;
    delete process.env.NEXT_PUBLIC_NETWORK3_CHAIN_ID;
    delete process.env.NEXT_PUBLIC_NETWORK3_API_URL;
    delete process.env.NEXT_PUBLIC_NETWORK3_RPC_URL;
    delete process.env.NEXT_PUBLIC_NETWORK3_INDEXER_URL;
    delete process.env.NEXT_PUBLIC_NETWORK3_GNO_WEB_URL;
    delete process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID;
    delete process.env.NEXT_PUBLIC_NETWORK_ORDER;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getNetworksFromEnv", () => {
    it("should return both networks when network 1 and 2 environment variables are set", () => {
      // Default Network
      process.env.NEXT_PUBLIC_NETWORK1_NAME = "Test Network 1";
      process.env.NEXT_PUBLIC_NETWORK1_CHAIN_ID = "test-chain-1";
      process.env.NEXT_PUBLIC_NETWORK1_API_URL = "https://api.test1.com";
      process.env.NEXT_PUBLIC_NETWORK1_RPC_URL = "https://rpc.test1.com";
      process.env.NEXT_PUBLIC_NETWORK1_INDEXER_URL = "https://indexer.test1.com";
      process.env.NEXT_PUBLIC_NETWORK1_GNO_WEB_URL = "https://gno.test1.com";

      // Secondary Network
      process.env.NEXT_PUBLIC_NETWORK2_NAME = "Test Network 2";
      process.env.NEXT_PUBLIC_NETWORK2_CHAIN_ID = "test-chain-2";
      process.env.NEXT_PUBLIC_NETWORK2_API_URL = "https://api.test2.com";
      process.env.NEXT_PUBLIC_NETWORK2_RPC_URL = "https://rpc.test2.com";
      process.env.NEXT_PUBLIC_NETWORK2_INDEXER_URL = "https://indexer.test2.com";
      process.env.NEXT_PUBLIC_NETWORK2_GNO_WEB_URL = "https://gno.test2.com";

      const networks = getNetworksFromEnv();

      expect(networks.length).toBe(2);
      expect(networks[0]).toEqual({
        name: "Test Network 1",
        chainId: "test-chain-1",
        apiUrl: "https://api.test1.com",
        rpcUrl: "https://rpc.test1.com",
        indexerUrl: "https://indexer.test1.com",
        gnoWebUrl: "https://gno.test1.com",
      });
      expect(networks[1]).toEqual({
        name: "Test Network 2",
        chainId: "test-chain-2",
        apiUrl: "https://api.test2.com",
        rpcUrl: "https://rpc.test2.com",
        indexerUrl: "https://indexer.test2.com",
        gnoWebUrl: "https://gno.test2.com",
      });
    });

    it("should not include network if required environment variables are missing", () => {
      // Default Network
      process.env.NEXT_PUBLIC_NETWORK1_NAME = "Test Network 1";
      process.env.NEXT_PUBLIC_NETWORK1_CHAIN_ID = "test-chain-1";
      process.env.NEXT_PUBLIC_NETWORK1_API_URL = "https://api.test1.com";
      process.env.NEXT_PUBLIC_NETWORK1_RPC_URL = "https://rpc.test1.com";
      process.env.NEXT_PUBLIC_NETWORK1_INDEXER_URL = "https://indexer.test1.com";
      process.env.NEXT_PUBLIC_NETWORK1_GNO_WEB_URL = "https://gno.test1.com";

      // Secondary Network - Set only some of the required environment variables
      // Missing NETWORK2_NAME
      // Missing NETWORK2_CHAIN_ID
      // Missing NETWORK2_API_URL
      process.env.NEXT_PUBLIC_NETWORK2_RPC_URL = "https://rpc.test2.com";
      process.env.NEXT_PUBLIC_NETWORK2_INDEXER_URL = "https://indexer.test2.com";
      process.env.NEXT_PUBLIC_NETWORK2_GNO_WEB_URL = "https://gno.test2.com";

      const networks = getNetworksFromEnv();

      expect(networks.length).toBe(1);
      expect(networks[0]).toEqual({
        name: "Test Network 1",
        chainId: "test-chain-1",
        apiUrl: "https://api.test1.com",
        rpcUrl: "https://rpc.test1.com",
        indexerUrl: "https://indexer.test1.com",
        gnoWebUrl: "https://gno.test1.com",
      });
      expect(networks[1]).toEqual(undefined);
    });

    it("should return all three networks when network 1, 2, and 3 environment variables are set", () => {
      process.env.NEXT_PUBLIC_NETWORK1_NAME = "Test Network 1";
      process.env.NEXT_PUBLIC_NETWORK1_CHAIN_ID = "test-chain-1";
      process.env.NEXT_PUBLIC_NETWORK1_API_URL = "https://api.test1.com";
      process.env.NEXT_PUBLIC_NETWORK1_RPC_URL = "https://rpc.test1.com";
      process.env.NEXT_PUBLIC_NETWORK1_INDEXER_URL = "https://indexer.test1.com";
      process.env.NEXT_PUBLIC_NETWORK1_GNO_WEB_URL = "https://gno.test1.com";

      process.env.NEXT_PUBLIC_NETWORK2_NAME = "Test Network 2";
      process.env.NEXT_PUBLIC_NETWORK2_CHAIN_ID = "test-chain-2";
      process.env.NEXT_PUBLIC_NETWORK2_API_URL = "https://api.test2.com";
      process.env.NEXT_PUBLIC_NETWORK2_RPC_URL = "https://rpc.test2.com";
      process.env.NEXT_PUBLIC_NETWORK2_INDEXER_URL = "https://indexer.test2.com";
      process.env.NEXT_PUBLIC_NETWORK2_GNO_WEB_URL = "https://gno.test2.com";

      process.env.NEXT_PUBLIC_NETWORK3_NAME = "Test Network 3";
      process.env.NEXT_PUBLIC_NETWORK3_CHAIN_ID = "test-chain-3";
      process.env.NEXT_PUBLIC_NETWORK3_API_URL = "https://api.test3.com";
      process.env.NEXT_PUBLIC_NETWORK3_RPC_URL = "https://rpc.test3.com";
      process.env.NEXT_PUBLIC_NETWORK3_INDEXER_URL = "https://indexer.test3.com";
      process.env.NEXT_PUBLIC_NETWORK3_GNO_WEB_URL = "https://gno.test3.com";

      const networks = getNetworksFromEnv();

      expect(networks.length).toBe(3);
      expect(networks[2]).toEqual({
        name: "Test Network 3",
        chainId: "test-chain-3",
        apiUrl: "https://api.test3.com",
        rpcUrl: "https://rpc.test3.com",
        indexerUrl: "https://indexer.test3.com",
        gnoWebUrl: "https://gno.test3.com",
      });
    });

    it("should not include NETWORK3 if its required environment variables are missing", () => {
      process.env.NEXT_PUBLIC_NETWORK1_NAME = "Test Network 1";
      process.env.NEXT_PUBLIC_NETWORK1_CHAIN_ID = "test-chain-1";
      process.env.NEXT_PUBLIC_NETWORK1_API_URL = "https://api.test1.com";
      process.env.NEXT_PUBLIC_NETWORK1_RPC_URL = "https://rpc.test1.com";
      process.env.NEXT_PUBLIC_NETWORK1_INDEXER_URL = "https://indexer.test1.com";

      // NETWORK3 partially set: missing NAME and CHAIN_ID
      process.env.NEXT_PUBLIC_NETWORK3_API_URL = "https://api.test3.com";
      process.env.NEXT_PUBLIC_NETWORK3_RPC_URL = "https://rpc.test3.com";
      process.env.NEXT_PUBLIC_NETWORK3_INDEXER_URL = "https://indexer.test3.com";

      const networks = getNetworksFromEnv();

      expect(networks.length).toBe(1);
      expect(networks[0].chainId).toBe("test-chain-1");
    });

    it("should return environment networks when available", () => {
      process.env.NEXT_PUBLIC_NETWORK1_NAME = "Test Network 1";
      process.env.NEXT_PUBLIC_NETWORK1_CHAIN_ID = "test-chain-1";
      process.env.NEXT_PUBLIC_NETWORK1_API_URL = "https://api.test1.com";
      process.env.NEXT_PUBLIC_NETWORK1_RPC_URL = "https://rpc.test1.com";
      process.env.NEXT_PUBLIC_NETWORK1_INDEXER_URL = "https://indexer.test1.com";

      const defaultChains: ChainModel[] = [
        {
          name: "Default Network",
          chainId: "default-chain",
          apiUrl: "https://api.default.com",
          rpcUrl: "https://rpc.default.com",
          indexerUrl: "https://indexer.default.com",
          gnoWebUrl: null,
        },
      ];

      const networks = getNetworkConfig(defaultChains);
      expect(networks.length).toBe(1);
      expect(networks[0].name).toBe("Test Network 1");
    });

    it("should return default chains when no environment networks are available", () => {
      delete process.env.NEXT_PUBLIC_NETWORK1_NAME;
      delete process.env.NEXT_PUBLIC_NETWORK1_CHAIN_ID;
      delete process.env.NEXT_PUBLIC_NETWORK2_NAME;
      delete process.env.NEXT_PUBLIC_NETWORK2_CHAIN_ID;

      const defaultChains: ChainModel[] = [
        {
          name: "Default Network",
          chainId: "default-chain",
          apiUrl: "https://api.default.com",
          rpcUrl: "https://rpc.default.com",
          indexerUrl: "https://indexer.default.com",
          gnoWebUrl: null,
        },
        {
          name: "Secondary Network",
          chainId: "secondary-chain",
          apiUrl: "https://api.secondary.com",
          rpcUrl: "https://rpc.secondary.com",
          indexerUrl: "https://indexer.secondary.com",
          gnoWebUrl: null,
        },
      ];

      const networks = getNetworkConfig(defaultChains);
      expect(networks.length).toBe(2);
      expect(networks[0].name).toBe("Default Network");
      expect(networks[1].name).toBe("Secondary Network");
    });
  });

  describe("applyNetworkOrder", () => {
    const sampleChains: ChainModel[] = [
      { name: "A", chainId: "a", apiUrl: null, rpcUrl: null, indexerUrl: null, gnoWebUrl: null },
      { name: "B", chainId: "b", apiUrl: null, rpcUrl: null, indexerUrl: null, gnoWebUrl: null },
      { name: "C", chainId: "c", apiUrl: null, rpcUrl: null, indexerUrl: null, gnoWebUrl: null },
    ];

    it("should return chains unchanged when NEXT_PUBLIC_NETWORK_ORDER is unset", () => {
      const result = applyNetworkOrder(sampleChains);
      expect(result.map(c => c.chainId)).toEqual(["a", "b", "c"]);
    });

    it("should reorder chains according to NEXT_PUBLIC_NETWORK_ORDER", () => {
      process.env.NEXT_PUBLIC_NETWORK_ORDER = "c,a,b";
      const result = applyNetworkOrder(sampleChains);
      expect(result.map(c => c.chainId)).toEqual(["c", "a", "b"]);
    });

    it("should append chains missing from order at the end in original order", () => {
      process.env.NEXT_PUBLIC_NETWORK_ORDER = "c";
      const result = applyNetworkOrder(sampleChains);
      expect(result.map(c => c.chainId)).toEqual(["c", "a", "b"]);
    });

    it("should ignore unknown chainIds in NEXT_PUBLIC_NETWORK_ORDER", () => {
      process.env.NEXT_PUBLIC_NETWORK_ORDER = "unknown, b , c";
      const result = applyNetworkOrder(sampleChains);
      expect(result.map(c => c.chainId)).toEqual(["b", "c", "a"]);
    });

    it("should treat empty or whitespace-only order as unset", () => {
      process.env.NEXT_PUBLIC_NETWORK_ORDER = "  ,  ";
      const result = applyNetworkOrder(sampleChains);
      expect(result.map(c => c.chainId)).toEqual(["a", "b", "c"]);
    });
  });

  describe("getDefaultChain", () => {
    const sampleChains: ChainModel[] = [
      { name: "A", chainId: "a", apiUrl: null, rpcUrl: null, indexerUrl: null, gnoWebUrl: null },
      { name: "B", chainId: "b", apiUrl: null, rpcUrl: null, indexerUrl: null, gnoWebUrl: null },
    ];

    it("should return the first chain when NEXT_PUBLIC_DEFAULT_CHAIN_ID is unset", () => {
      expect(getDefaultChain(sampleChains)?.chainId).toBe("a");
    });

    it("should return the matching chain when NEXT_PUBLIC_DEFAULT_CHAIN_ID matches", () => {
      process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID = "b";
      expect(getDefaultChain(sampleChains)?.chainId).toBe("b");
    });

    it("should fall back to the first chain when NEXT_PUBLIC_DEFAULT_CHAIN_ID does not match", () => {
      process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID = "missing";
      expect(getDefaultChain(sampleChains)?.chainId).toBe("a");
    });

    it("should return undefined when chains array is empty", () => {
      process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID = "a";
      expect(getDefaultChain([])).toBeUndefined();
    });
  });
});
