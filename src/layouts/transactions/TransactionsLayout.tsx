import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";

import * as S from "./TransactionsLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";

interface TransactionsLayoutProps {
  transactionList: React.ReactNode;
  transactionSearch: React.ReactNode;
  // Controls at the right end of the title line; standard networks only.
  transactionActions: React.ReactNode;
}

const TransactionsLayout = ({ transactionList, transactionSearch, transactionActions }: TransactionsLayoutProps) => {
  const { indexerQueryClient, isCustomNetwork } = useNetworkProvider();
  const hasIndexerClient = Boolean(indexerQueryClient);

  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <S.TitleRow>
            <PageTitle title="Transactions" type="h2" />
            {hasIndexerClient && !isCustomNetwork && <S.Actions>{transactionActions}</S.Actions>}
          </S.TitleRow>
          {hasIndexerClient ? transactionList : transactionSearch}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default TransactionsLayout;
