import React from "react";

import * as S from "./BlocksLayout.styles";
import Text from "@/components/ui/text";

interface BlocksLayoutProps {
  blockList: React.ReactNode;
}

const BlocksLayout = ({ blockList }: BlocksLayoutProps) => {
  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <Text type="h2" color="primary">
            {"Blocks"}
          </Text>
          {blockList}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default BlocksLayout;
