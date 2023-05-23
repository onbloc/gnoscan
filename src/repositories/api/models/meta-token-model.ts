export interface TokenModel {
  type: 'gno-native' | 'grc20' | 'ibc-native' | 'ibc-tokens';
  name: string;
  symbol: string;
  decimals: string;
  description: string;
  website_url: string;
  image: string;
}

export interface GRC20TokenModel extends TokenModel {
  pkg_path: string;
}

export interface NativeTokenModel extends TokenModel {
  denom: string;
}

export function isGRC20TokenModel(model: TokenModel): model is GRC20TokenModel {
  return model.type === 'grc20';
}
