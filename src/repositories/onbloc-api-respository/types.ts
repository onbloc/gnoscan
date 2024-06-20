export interface IOnblocAPIRepository {
  getGRC20Tokens(): Promise<OnblocAPIResultGRC20Token[]>;

  getUsernames(): Promise<Record<string, OnblocAPIResultUsername>>;
}

export interface OnblocAPIResultGRC20Token {
  name: string;

  symbol: string;

  packagePath: string;

  decimals: number;
}

export interface OnblocAPIResultUsername {
  address: string;

  name: string;

  height: string;
}
