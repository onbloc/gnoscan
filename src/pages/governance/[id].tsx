import React from "react";
import { useRouter } from "next/router";

import ProposalContainer from "@/containers/governance/proposal-container/ProposalContainer";

export default function Page() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : "";

  return <ProposalContainer id={id} isReady={router.isReady} />;
}
