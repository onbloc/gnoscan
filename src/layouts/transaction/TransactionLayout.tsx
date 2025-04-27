import React from "react";

import * as S from "./TransactionLayout.styles";
import { useWindowSize } from "@/common/hooks/use-window-size";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";

interface TransactionLayoutProps {
  transactionSummary: React.ReactNode;
  transactionInfo: React.ReactNode;
}

const TransactionLayout = ({ transactionInfo, transactionSummary }: TransactionLayoutProps) => {
  const { breakpoint, isDesktop } = useWindowSize();

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
