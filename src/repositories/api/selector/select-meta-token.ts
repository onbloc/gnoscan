import {TokenModel, isGRC20TokenModel} from '../models/meta-token-model';
import {AssetsDataType} from '@/models/account-details-model';

export const allTokenSelector = (assets: AssetsDataType[], tokens: TokenModel[]) => {
  return assets.map((asset, _) => {
    return {...asset, image: tokens.find(token => equalsToken(asset, token))?.image};
  });
};

const equalsToken = (asset: AssetsDataType, token: TokenModel) => {
  if (asset.type === 'native') {
    return (
      token.type === 'gno-native' &&
      (token?.symbol || '').toUpperCase() === (asset?.denom || '').toUpperCase()
    );
  }
  if (asset.type === 'grc20') {
    return isGRC20TokenModel(token) && token.pkg_path === asset.pkg_path;
  }
  return false;
};
