import { NodeRPCClient } from "@/common/clients/node-client";
import { IChainRepository, TokenSupplyInfo, ValidatorInfo } from "./types";

import { ChainType } from "@/common/values/constant-value";
import ValidatorStagingData from "../../assets/meta/staging/validators.json";
import ValidatorTest6Data from "../../assets/meta/test6/validators.json";
import { Amount } from "@/types";
import { CommonError } from "@/common/errors";
import { parseABCI } from "@gnolang/tm2-js-client";

export class ChainRepository implements IChainRepository {
  constructor(private nodeRPCClient: NodeRPCClient | null) {}

  async getTokenSupply(): Promise<TokenSupplyInfo> {
    return {
      totalSupplyAmount: 1_000_000_000_000_000,
      airdropSupplyAmount: 700_000_000_000_000,
      airdropHolder: 656_740,
    };
  }

  async getValidators(height: number): Promise<string[]> {
    if (!this.nodeRPCClient) {
      return [];
    }

    return this.nodeRPCClient.validators(height).then(response => response.validators.map(v => v.address));
  }

  async getValidatorInfos(chainId: string): Promise<ValidatorInfo[]> {
    if (chainId === ChainType.STAGING) {
      return ValidatorStagingData;
    }
    if (chainId === ChainType.TESTNET6) {
      return ValidatorTest6Data;
    }
    return [];
  }

  async getStoragePrice(): Promise<Amount | null> {
    if (!this.nodeRPCClient) {
      throw new CommonError("FAILED_INITIALIZE_PROVIDER", "NodeRPCClient");
    }

    const response = await this.nodeRPCClient.abciQueryVMStoragePrice().catch(() => null);
    if (!response || !response?.response?.ResponseBase?.Data) {
      return null;
    }

    try {
      const rawResult = parseABCI(response.response.ResponseBase.Data);

      if (typeof rawResult !== "string") {
        return null;
      }

      // ex) "100ugnot"
      const priceRegex = /^(\d+)([a-zA-Z]+)$/;
      const match = rawResult.match(priceRegex);

      if (!match) {
        return null;
      }

      const [, amount, denomination] = match;

      return {
        value: amount,
        denom: denomination,
      };
    } catch (error) {
      return null;
    }
  }
}
