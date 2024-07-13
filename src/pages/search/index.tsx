import React from 'react';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';

import {isBech32Address} from '@/common/utils/bech32.utility';
import {isHash} from '@/common/utils/transaction.utility';
import NotFound from '@/components/view/not-found/not-found';
import {makeQueryString} from '@/common/utils/string-util';

interface Props {
  keyword: string;
  redirectUrl: string;
}

function parseSearchString(search: string) {
  if (!search || search.length === 1) {
    return {};
  }

  return search
    .replace('?', '')
    .split('&')
    .reduce<{[key in string]: string}>((accum, value) => {
      const keySeparatorIndex = value.lastIndexOf('.json');
      const current =
        keySeparatorIndex > -1
          ? value.substring(keySeparatorIndex + '.json'.length, value.length)
          : value;
      const separatorIndex = current.indexOf('=');
      if (separatorIndex < 0 || separatorIndex + 1 >= current.length) {
        return accum;
      }

      const values = [
        current.substring(0, separatorIndex),
        decodeURIComponent(current.substring(separatorIndex + 1, current.length)).replaceAll(
          ' ',
          '+',
        ),
      ];
      if (values.length === 0) {
        return accum;
      }

      accum[values[0]] = values.length > 0 ? values[1] : '';
      return accum;
    }, {});
}

const Search = ({keyword}: Props) => {
  return (
    <Container>
      <NotFound keyword={`${keyword}`} />
    </Container>
  );
};

export async function getServerSideProps({req}: any) {
  const params = parseSearchString(req.url);
  const networkParams = Object.entries(params).reduce<{[key in string]: string}>((acc, current) => {
    if (['type', 'rpcUrl', 'indexerUrl', 'chainId'].includes(current[0])) {
      acc[current[0]] = current[1];
    }
    return acc;
  }, {});

  const keyword = params?.keyword;
  if (!keyword) {
    return {
      props: {
        keyword: '',
        redirectUrl: null,
      },
    };
  }

  try {
    const isNumber = !BigNumber(keyword).isNaN();
    if (isNumber) {
      const queryString = makeQueryString(networkParams);
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/blocks/${keyword}?${queryString}`,
        },
      };
    }

    const isRealm = keyword.startsWith('gno.land');
    if (isRealm) {
      const queryString = makeQueryString({
        ...networkParams,
        path: encodeURIComponent(keyword),
      });
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/realms/details?${queryString}`,
        },
      };
    }

    const isAddress = isBech32Address(keyword);
    if (isAddress) {
      const queryString = makeQueryString(networkParams);
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/accounts/${keyword}?${queryString}`,
        },
      };
    }

    const isTxHash = isHash(keyword);
    if (isTxHash) {
      const queryString = makeQueryString({
        ...networkParams,
        txhash: encodeURIComponent(keyword),
      });
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/transactions/details?${queryString}`,
        },
      };
    }

    const isCommon = keyword.length > 2 && !keyword.includes(' ');
    if (isCommon) {
      const queryString = makeQueryString(networkParams);
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/accounts/${keyword}?${queryString}`,
        },
      };
    }
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      keyword,
      redirectUrl: null,
    },
  };
}

const Container = styled.main`
  width: 100%;
  flex: 1;
`;

export default Search;
