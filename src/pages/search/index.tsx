import NotFound from '@/components/view/not-found/not-found';
import {searchHistory} from '@/repositories/api/fetchers/api-search-history';
import {searchKeyword} from '@/repositories/api/fetchers/api-search-keyword';
import {useRouter} from 'next/router';
import React from 'react';
import styled from 'styled-components';

interface Props {
  redirectUrl: string;
}

const Search = (params: Props) => {
  const router = useRouter();
  const {keyword} = router.query;

  return (
    <Container>
      <NotFound keyword={`${keyword}`} />
    </Container>
  );
};

export async function getServerSideProps({query}: any) {
  const keyword = query?.keyword ?? '';
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
          permanent: false,
          destination: `/accounts/${data.extra_value}`,
        },
      };
    }

    if (data.type === 'address') {
      return {
        redirect: {
          permanent: false,
          destination: `/accounts/${data.value}`,
        },
      };
    }

    if (data.type === 'pkg_path') {
      return {
        redirect: {
          permanent: false,
          destination: `/realms/details?path=${data.value}`,
        },
      };
    }

    if (data.type === 'pkg_name') {
      return {
        redirect: {
          permanent: false,
          destination: `/realms/details?path=${data.extra_value}`,
        },
      };
    }

    if (data.type === 'block') {
      return {
        redirect: {
          permanent: false,
          destination: `/blocks/${data.value}`,
        },
      };
    }

    if (data.type === 'tx') {
      return {
        redirect: {
          permanent: false,
          destination: `/transactions/${data.value}`,
        },
      };
    }

    if (data.type === 'tokens') {
      return {
        redirect: {
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
      redirectUrl: null,
    },
  };
}

const Container = styled.main`
  width: 100%;
  flex: 1;
`;

export default Search;
