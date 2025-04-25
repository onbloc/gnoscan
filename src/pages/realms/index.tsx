import React from "react";

import RealmsLayout from "@/layouts/realms/RealmsLayout";
const RealmListContainer = React.lazy(() => import("@/containers/realms/realm-list-container/RealmListContainer"));

export default function Page() {
  return (
    <>
      <RealmsLayout realmList={<RealmListContainer />} />
    </>
  );
}
