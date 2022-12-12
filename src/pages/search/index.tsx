import useLoading from '@/common/hooks/use-loading';
import {API_URI} from '@/common/values/constant-value';
import Text from '@/components/ui/text';
import {TokenDatatable} from '@/components/view/datatable/token';
import LoadingPage from '@/components/view/loading/page';
import NotFound from '@/components/view/not-found/not-found';
import axios from 'axios';
import {useRouter} from 'next/router';
import React, {useEffect} from 'react';
import {QueryClient} from 'react-query';
import styled from 'styled-components';

interface Props {
  redirectUrl: string;
}

const Search = (params: Props) => {
  const router = useRouter();
  const {keyword} = router.query;
  useEffect(() => {}, [params]);

  return (
    <Container>
      <NotFound keyword={`${keyword}`} />
    </Container>
  );
};

export async function getServerSideProps({query}: any) {
  const keyword = query?.keyword ?? '';

  try {
    const result = await axios.get(API_URI + `/latest/info/result/${keyword}`);
    const data = result.data;

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
