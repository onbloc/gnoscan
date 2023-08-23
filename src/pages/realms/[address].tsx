import React from 'react';
import {DetailsPageLayout} from '@/components/core/layout';
import {searchKeyword} from '@/repositories/api/fetchers/api-search-keyword';
interface RealmsDetailsPageProps {
  path: string;
  redirectUrl: string | null;
}

const RealmsAddressDetails = ({path}: RealmsDetailsPageProps) => (
  <DetailsPageLayout title={'Realm Details'} visible={false} keyword={`${path}`} error={true}>
    <div></div>
  </DetailsPageLayout>
);

export async function getServerSideProps({params}: any) {
  const keyword = params.address;
  try {
    const result = await searchKeyword(keyword);
    const data = result.data;
    if (data?.type === 'pkg_path') {
      return {
        redirect: {
          keyword,
          permanent: false,
          destination: `/realms/details?path=${data.value}`,
        },
      };
    }
  } catch {}
  return {
    props: {
      path: keyword,
      redirectUrl: null,
    },
  };
}

export default RealmsAddressDetails;
