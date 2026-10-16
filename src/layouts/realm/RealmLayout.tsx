import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { isApiNotFound } from "@/common/utils/common.utility";
import { useGetRealmByPath } from "@/common/react-query/realm/api";

import * as S from "./Realmlayout.styles";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import NotFound from "@/components/view/search/not-found/NotFound";

interface RealmLayoutProps {
  path: string;
  realmSummary: React.ReactNode;
  realmInfo: React.ReactNode;
}

const RealmLayout = ({ path, realmSummary, realmInfo }: RealmLayoutProps) => {
  const { isCustomNetwork } = useNetworkProvider();
  // Same query as the summary, so this reads the shared cache instead of sending another request.
  const realmQuery = useGetRealmByPath(path, { enabled: !isCustomNetwork && !!path });

  if (!isCustomNetwork && isApiNotFound(realmQuery))
    return (
      <S.InnerLayout>
        <NotFound keyword={path} />
      </S.InnerLayout>
    );

  return (
    <S.Container>
      <S.InnerLayout>
        <S.Wrapper>
          <PageTitle type="p2" desktopType="h2" title="Realm Details" />
          {realmSummary}
          {realmInfo}
        </S.Wrapper>
      </S.InnerLayout>
    </S.Container>
  );
};

export default RealmLayout;
