import React from "react";

import * as S from "./BlocksLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";

interface BlocksLayoutProps {
  blockList: React.ReactNode;
}

const BlocksLayout = ({ blockList }: BlocksLayoutProps) => {
  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <PageTitle title="Blocks" type="h2" />
          {blockList}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default BlocksLayout;
