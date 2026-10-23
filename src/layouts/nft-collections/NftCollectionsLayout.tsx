import React from "react";

import * as S from "./NftCollectionsLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import TokenResourceLink from "@/components/ui/token-resource-link/TokenResourceLink";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { NftsSummary } from "@/components/view/list-summary/NftsSummary";

interface NftCollectionsLayoutProps {
  nftCollectionList: React.ReactNode;
}

const NftCollectionsLayout = ({ nftCollectionList }: NftCollectionsLayoutProps) => {
  // Summaries come from the API, which custom networks do not have.
  const { isCustomNetwork } = useNetworkProvider();

  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <S.TitleWrap>
            <PageTitle
              title="NFTs"
              type="h2"
              description="GRC721 collections on gno.land — fresh mints, rising collections, and who's collecting."
            />
            <TokenResourceLink label="Gno.land Token Resources" />
          </S.TitleWrap>
          {!isCustomNetwork && <NftsSummary />}
          {nftCollectionList}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default NftCollectionsLayout;
