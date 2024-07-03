export interface IChainRepository {
  getTokenSupply(): Promise<TokenSupplyInfo>;

  getValidators(height: number): Promise<string[]>;
}

export interface TokenSupplyInfo {
  totalSupplyAmount: number;
  airdropSupplyAmount: number;
  airdropHolder: number;
}
