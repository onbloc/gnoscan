import {NetworkState} from '@/states';
import {useMemo} from 'react';
import {useRecoilState} from 'recoil';
import ChainData from 'public/resource/chains.json';
import {useRouter} from 'next/router';

function parseSearchString(search: string) {
  if (!search || search.length === 1) {
    return {};
  }

  return search
    .replace('?', '')
    .split('&')
    .reduce<{[key in string]: string}>((accum, current) => {
      const values = current.split('=');
      if (values.length === 0) {
        return accum;
      }

      if (['type', 'rpcUrl', 'indexerUrl', 'chainId'].includes(values[0])) {
        return accum;
      }

      accum[values[0]] = values.length > 1 ? values[1] : '';
      return accum;
    }, {});
}

function makeQueryString(params: {[key in string]: string} | null) {
  if (!params) {
    return '';
  }

  return Object.entries(params)
    .map(entry => `${entry[0]}=${entry[1]}`)
    .join('&');
}

export const useNetwork = () => {
  const {replace} = useRouter();
  const [currentNetwork, setCurrentNetwork] = useRecoilState(NetworkState.currentNetwork);

  const networkParams = useMemo(() => {
    if (!currentNetwork) {
      return null;
    }

    if (currentNetwork.isCustom) {
      return {
        type: 'custom',
        rpcUrl: currentNetwork.rpcUrl,
        indexerUrl: currentNetwork.indexerUrl,
      };
    }

    return {
      chainId: currentNetwork.chainId,
    };
  }, [currentNetwork]);

  const getUrlWithNetwork = (uri: string) => {
    return getUrlWithNetworkData(uri, networkParams);
  };

  const getUrlWithNetworkData = (uri: string, networkParamData: any) => {
    try {
      const origin = window.location.origin;
      const urlData = new URL(origin + uri);
      const params = {...parseSearchString(urlData.search), ...networkParamData};
      const queryString = makeQueryString(params);

      if (!queryString) {
        return uri;
      }

      return `${urlData.pathname}?${queryString}`;
    } catch {}
    return uri;
  };

  const changeNetwork = (chainId: string) => {
    const chain = ChainData.find(chain => chain.chainId === chainId) || ChainData[0];

    setCurrentNetwork({
      isCustom: false,
      chainId: chain.chainId,
      rpcUrl: chain.rpcUrl,
      indexerUrl: chain.indexerUrl,
    });

    const uri = window.location.pathname + window.location.search;
    replace(
      getUrlWithNetworkData(uri, {
        chainId,
      }),
    );
  };

  const changeCustomNetwork = (rpcUrl: string, indexerUrl: string) => {
    setCurrentNetwork({
      isCustom: true,
      chainId: '',
      rpcUrl,
      indexerUrl,
    });

    const uri = window.location.pathname + window.location.search;
    replace(
      getUrlWithNetworkData(uri, {
        type: 'custom',
        rpcUrl,
        indexerUrl,
      }),
    );
  };

  return {
    currentNetwork,
    getUrlWithNetwork,
    setCurrentNetwork,
    changeNetwork,
    changeCustomNetwork,
  };
};
