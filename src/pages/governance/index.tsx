import React from "react";

import GovernanceContainer from "@/containers/governance/governance-container/GovernanceContainer";
import GovernanceLayout from "@/layouts/governance/GovernanceLayout";

export default function Page() {
  return <GovernanceLayout governance={<GovernanceContainer />} />;
}
