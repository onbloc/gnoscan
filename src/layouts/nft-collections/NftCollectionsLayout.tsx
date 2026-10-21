import React from "react";

import * as S from "./NftCollectionsLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import IconLink from "@/assets/svgs/icon-link.svg";
import Text from "@/components/ui/text";
import { GNO_TOKEN_RESOURCE_URL } from "@/common/values/constant-value";

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
            <S.TokenResourceLink href={GNO_TOKEN_RESOURCE_URL} target="_blank" rel="noreferrer">
              <Text type="p4" className="ellipsis">
                Gno.land Token Resources
              </Text>
              <IconLink className="icon-link" />
            </S.TokenResourceLink>
          </S.TitleWrap>
          {nftCollectionList}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default NftCollectionsLayout;
