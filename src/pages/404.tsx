import React from 'react';
import NotFound from '@/components/view/not-found/not-found';
import {useRouter} from 'next/router';

const NotFoundPage = () => {
  const {asPath} = useRouter();

  return <NotFound keyword={asPath} />;
};

export default NotFoundPage;
