export interface IChainRepository {
  getTokenSupply(): Promise<TokenSupplyInfo>;

  getValidators(height: number): Promise<string[]>;

  getValidatorInfos(chainId: string): Promise<ValidatorInfo[]>;
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
