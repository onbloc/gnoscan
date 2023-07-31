import NotFound from '@/components/view/not-found/not-found';
import {searchHistory} from '@/repositories/api/fetchers/api-search-history';
import {searchKeyword} from '@/repositories/api/fetchers/api-search-keyword';
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
    const result = await searchKeyword(keyword);
    const data = result.data;
    searchHistory({
      keyword: keyword,
      type: data.type,
      value: data.value,
      memo1: data.type === 'username' ? data.extra_value : '',
    });

    if (data.type === 'username') {
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/accounts/${data.extra_value}`,
        },
      };
    }

    if (data.type === 'address') {
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/accounts/${data.value}`,
        },
      };
    }

    if (data.type === 'pkg_path') {
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/realms/details?path=${data.value}`,
        },
      };
    }

    if (data.type === 'pkg_name') {
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/realms/details?path=${data.extra_value}`,
        },
      };
    }

    if (data.type === 'block') {
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/blocks/${data.value}`,
        },
      };
    }

    if (data.type === 'tx') {
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/transactions/details?txhash=${data.value}`,
        },
      };
    }

    if (data.type === 'tokens') {
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/tokens/${data.value}`,
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
