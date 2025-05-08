import React from "react";

import RealmsLayout from "@/layouts/realms/RealmsLayout";
import RealmListContainer from "@/containers/realms/realm-list-container/RealmListContainer";

export default function Page() {
  return (
    <>
      <RealmsLayout realmList={<RealmListContainer />} />
    </>
  );
}
