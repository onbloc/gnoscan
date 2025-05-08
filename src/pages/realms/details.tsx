/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import RealmLayout from "@/layouts/realm/RealmLayout";
import RealmSummaryContainer from "@/containers/realm/realm-summary-container/RealmSummaryContainer";
import RealmInfoContainer from "@/containers/realm/realm-info-container/RealmInfoContainer";

interface RealmsDetailsPageProps {
  path: string;
  redirectUrl: string | null;
}

export async function getServerSideProps({ query }: any) {
  const keyword = query?.path;
  return {
    props: {
      path: keyword,
      redirectUrl: null,
    },
  };
}

export default function Page({ path }: RealmsDetailsPageProps) {
  return (
    <>
      <RealmLayout
        realmSummary={<RealmSummaryContainer path={path} />}
        realmInfo={<RealmInfoContainer path={path} />}
      />
    </>
  );
}
