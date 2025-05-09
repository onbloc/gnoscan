/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useRouter } from "next/router";

import { parseRealmPath } from "@/common/utils/realm.utility";

import RealmLayout from "@/layouts/realm/RealmLayout";
import RealmSummaryContainer from "@/containers/realm/realm-summary-container/RealmSummaryContainer";
import RealmInfoContainer from "@/containers/realm/realm-info-container/RealmInfoContainer";

export default function Page() {
  const { asPath } = useRouter();
  const path = parseRealmPath(asPath);

  return (
    <>
      <RealmLayout
        realmSummary={<RealmSummaryContainer path={path} />}
        realmInfo={<RealmInfoContainer path={path} />}
      />
    </>
  );
}
