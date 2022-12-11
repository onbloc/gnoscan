import useLoading from '@/common/hooks/use-loading';
import {API_URI} from '@/common/values/constant-value';
import Text from '@/components/ui/text';
import {TokenDatatable} from '@/components/view/datatable/token';
import LoadingPage from '@/components/view/loading/page';
import axios from 'axios';
import {useRouter} from 'next/router';
import React from 'react';
import {QueryClient} from 'react-query';
import styled from 'styled-components';

interface Props {
  isResult: boolean;
  data: {
    type: string;
    value: string | number;
    extra_value: any;
  } | null;
}

const Search = ({data}: Props) => {
  const {loading} = useLoading();

  return <Container></Container>;
};

export async function getStaticProps({params}: any) {
  const keyword = params?.keyword ?? '';
  let isResult = false;
  let data = null;

  try {
    const result = await axios.get(API_URI + `/latest/info/result/${keyword}`);
    data = result.data;
    isResult = true;
  } catch (e) {}

  return {
    props: {
      data,
      isResult,
    },
  };
}

const Container = styled.main`
  width: 100%;
  flex: 1;
`;

const Wrapper = styled.div<{visible?: boolean}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 40px 0;
  padding: 24px;
  background-color: ${({theme}) => theme.colors.surface};
  border-radius: 10px;
  ${({visible}) => !visible && 'display: none;'}
`;

export default Search;
