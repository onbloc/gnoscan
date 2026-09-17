import React from "react";

import * as S from "./TokensLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import IconLink from "@/assets/svgs/icon-link.svg";
import Text from "@/components/ui/text";

const GNO_TOKEN_RESOURCE_URL = process.env.NEXT_PUBLIC_GNO_TOKEN_RESOURCE_URL?.trim();

interface TokensLayoutProps {
  tokenList: React.ReactNode;
}

const TokensLayout = ({ tokenList }: TokensLayoutProps) => {
  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <S.TitleWrap>
            <PageTitle title="Tokens" type="h2" />
            {GNO_TOKEN_RESOURCE_URL && (
              <S.TokenResourceLink href={GNO_TOKEN_RESOURCE_URL} target="_blank" rel="noreferrer">
                <Text type="p4" className="ellipsis">
                  Gno.land Token Resources
                </Text>
                <IconLink className="icon-link" />
              </S.TokenResourceLink>
            )}
          </S.TitleWrap>
          {tokenList}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default TokensLayout;
