import React from "react";
import Link from "next/link";

import { useNetwork } from "@/common/hooks/use-network";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import * as Navigation from "@/components/view/common/title-option/TitleOption.styles";
import IconArrow from "@/assets/svgs/icon-arrow.svg";
import * as S from "./ProposalLayout.styles";

interface ProposalLayoutProps {
  id: string;
  prevId?: number | null;
  nextId?: number | null;
  children: React.ReactNode;
}

export const ProposalNavigation = ({ prevId, nextId }: Pick<ProposalLayoutProps, "prevId" | "nextId">) => {
  const { getUrlWithNetwork } = useNetwork();

  return (
    <Navigation.TitleWrap as="nav" aria-label="Proposal navigation">
      {(
        [
          { id: prevId, label: "Previous proposal", icon: "icon-arrow-right" },
          { id: nextId, label: "Next proposal", icon: "icon-arrow-left" },
        ] as const
      ).map(({ id, label, icon }) =>
        id == null ? (
          <Navigation.ArrowButton
            key={label}
            as="button"
            type="button"
            disabled
            aria-disabled="true"
            aria-label={label}
          >
            <IconArrow className={icon} />
          </Navigation.ArrowButton>
        ) : (
          <Navigation.ArrowButton
            key={label}
            as={Link}
            href={getUrlWithNetwork(`/governance/${id}`)}
            aria-label={label}
          >
            <IconArrow className={icon} />
          </Navigation.ArrowButton>
        ),
      )}
    </Navigation.TitleWrap>
  );
};

const ProposalLayout = ({ id, prevId, nextId, children }: ProposalLayoutProps) => (
  <S.Container>
    <S.InnerLayout>
      <S.Wrapper>
        <S.TitleWrapper>
          <PageTitle type="p2" desktopType="h2" title={id ? `Proposal #${id}` : "Proposal"} />
          <ProposalNavigation prevId={prevId} nextId={nextId} />
        </S.TitleWrapper>
        {children}
      </S.Wrapper>
    </S.InnerLayout>
  </S.Container>
);

export default ProposalLayout;
