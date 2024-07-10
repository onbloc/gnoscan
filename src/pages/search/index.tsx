import {isBech32Address} from '@/common/utils/bech32.utility';
import {isHash} from '@/common/utils/transaction.utility';
import NotFound from '@/components/view/not-found/not-found';
import BigNumber from 'bignumber.js';
import React from 'react';
import styled from 'styled-components';

interface Props {
  keyword: string;
  redirectUrl: string;
}

function parseKeyword(url: string) {
  if (!url.includes('keyword=')) {
    return '';
  }
  const params = url.split('keyword=');
  if (params.length < 2) return '';

  const keyword = decodeURIComponent(params[1].split('&')[0]);
  return keyword;
}

const Search = ({keyword}: Props) => {
  return (
    <Container>
      <NotFound keyword={`${keyword}`} />
    </Container>
  );
};

export async function getServerSideProps({req}: any) {
  const keyword = parseKeyword(req.url);
  if (keyword === '') {
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
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/blocks/${keyword}`,
        },
      };
    }

    const isRealm = keyword.startsWith('gno.land/');
    if (isRealm) {
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/realms/details?path=${keyword}`,
        },
      };
    }

    const isAddress = isBech32Address(keyword);
    if (isAddress) {
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/accounts/${keyword}`,
        },
      };
    }

    const isTxHash = isHash(keyword);
    if (isTxHash) {
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/transactions/details?txhash=${keyword}`,
        },
      };
    }

    const isCommon = keyword.length > 2 && !keyword.includes(' ');
    if (isCommon) {
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/accounts/${keyword}`,
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
