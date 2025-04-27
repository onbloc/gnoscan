import React from "react";

import * as S from "./Error404Layout.styles";

interface Error404LayoutProps {
  notFound: React.ReactNode;
}

const Error404Layout = ({ notFound }: Error404LayoutProps) => {
  return (
    <S.Container>
      <S.InnerLayout>{notFound}</S.InnerLayout>
    </S.Container>
  );
};

export default Error404Layout;
