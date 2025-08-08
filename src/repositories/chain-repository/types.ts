import { Amount } from "@/types";
import { StorageDeposit } from "@/models/storage-deposit-model";

export interface IChainRepository {
  getTokenSupply(): Promise<TokenSupplyInfo>;

  getValidators(height: number): Promise<string[]>;

  getValidatorInfos(chainId: string): Promise<ValidatorInfo[]>;

  getStoragePrice(): Promise<Amount | null>;

  getTotalStorageDeposit(): Promise<StorageDeposit | null>;
}

export interface TokenSupplyInfo {
  totalSupplyAmount: number;
  airdropSupplyAmount: number;
  airdropHolder: number;
}

export interface ValidatorInfo {
  address: string;
  name: string;
  power: string;
}
