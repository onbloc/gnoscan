import axios from 'axios';
import {GRC20TokenModel, NativeTokenModel, TokenModel} from '../models/meta-token-model';

export const NATIVE_TOKEN_URI =
  'https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/assets.json';

export const GRC20_TOKEN_URI =
  'https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/assets.json';

export const IMAGE_URI = 'https://raw.githubusercontent.com/onbloc/gno-token-resource/main/';

export const getNativeTokens = async (): Promise<NativeTokenModel> => {
  return await axios.get(NATIVE_TOKEN_URI).then(res =>
    res.data.map((token: any) => ({
      ...token,
      type: 'gno-native',
      image: `${IMAGE_URI}${token.image}`,
    })),
  );
};

export const getGRC20Tokens = async (): Promise<GRC20TokenModel> => {
  return await axios.get(GRC20_TOKEN_URI).then(res =>
    res.data.map((token: any) => ({
      ...token,
      type: 'grc20',
      image: `${IMAGE_URI}${token.image}`,
    })),
  );
};

export const getAllTokens = (): Promise<TokenModel[]> => {
  return Promise.all([getNativeTokens(), getGRC20Tokens()]).then(res => res.flat());
};
