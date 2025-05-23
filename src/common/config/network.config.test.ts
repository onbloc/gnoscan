import { getNetworksFromEnv, getNetworkConfig } from "./network.config";
import { ChainModel } from "@/models/chain-model";

const originalEnv = { ...process.env };

describe("Network configuration", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
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
});
