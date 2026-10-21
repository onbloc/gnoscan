import React from "react";

import * as S from "./NftCollectionsLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import TokenResourceLink from "@/components/ui/token-resource-link/TokenResourceLink";

interface NftCollectionsLayoutProps {
  nftCollectionList: React.ReactNode;
}

const NftCollectionsLayout = ({ nftCollectionList }: NftCollectionsLayoutProps) => {
  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <S.TitleWrap>
            <PageTitle title="NFTs" type="h2" />
            <TokenResourceLink label="Gno.land Token Resources" />
          </S.TitleWrap>
          {nftCollectionList}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default NftCollectionsLayout;
