import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import * as S from "./TransactionsLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";

interface TransactionsLayoutProps {
  transactionList: React.ReactNode;
  transactionSearch: React.ReactNode;
}

const TransactionsLayout = ({ transactionList, transactionSearch }: TransactionsLayoutProps) => {
  const { indexerQueryClient } = useNetworkProvider();
  const hasIndexerClient = Boolean(indexerQueryClient);

  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <PageTitle title="Transactions" type="h2" />
          {hasIndexerClient ? transactionList : transactionSearch}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default TransactionsLayout;
