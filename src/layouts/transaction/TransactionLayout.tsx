import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useTransaction } from "@/common/hooks/transactions/use-transaction";

import * as S from "./TransactionLayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import NotFound from "@/components/view/search/not-found/NotFound";

interface TransactionLayoutProps {
  txHash: string;
  transactionSummary: React.ReactNode;
  transactionInfo: React.ReactNode;
}

const TransactionLayout = ({ txHash, transactionInfo, transactionSummary }: TransactionLayoutProps) => {
  const { breakpoint, isDesktop } = useWindowSize();

  const { isFetched, isError } = useTransaction(txHash);

  if (isFetched && isError) return <NotFound keyword={txHash} breakpoint={breakpoint} />;

  return (
    <S.Container breakpoint={breakpoint}>
      <S.InnerLayout>
        <S.Wrapper breakpoint={breakpoint}>
          <PageTitle type={isDesktop ? "h2" : "p2"} title="Transaction Details" />
          {transactionSummary}
          {transactionInfo}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default TransactionLayout;
