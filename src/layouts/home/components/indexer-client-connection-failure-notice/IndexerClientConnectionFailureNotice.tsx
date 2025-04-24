import React from "react";

import * as S from "./IndexerClientConnectionFailureNotice.styles";
import Card from "@/components/ui/card";

const IndexerClientConnectionFailureNotice = () => {
  return (
    <Card>
      <S.Wrapper>
        <S.Title>Something went wrong</S.Title>
        <S.Content>Indexer Client initialization failed: Unable to connect to service</S.Content>
      </S.Wrapper>
    </Card>
  );
};

export default React.memo(IndexerClientConnectionFailureNotice);
