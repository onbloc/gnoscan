import {AccountDetailsModel, AssetsDataType} from '@/models/account-details-model';
import {allTokenSelector} from './select-meta-token';
import {TokenModel} from '../models/meta-token-model';

export const accountDetailSelector = (
  data: AccountDetailsModel,
  tokens: TokenModel[],
): AccountDetailsModel => {
  console.log('Tokens ; ', tokens);
  const assets = allTokenSelector(data.assets, tokens);
  return {
    ...data,
    assets,
  };
};
