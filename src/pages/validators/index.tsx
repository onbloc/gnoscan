import React from "react";

import ValidatorsLayout from "@/layouts/validators/ValidatorsLayout";
import ValidatorsContainer from "@/containers/validators/validators-container/ValidatorsContainer";

export default function Page() {
  return <ValidatorsLayout validators={<ValidatorsContainer />} />;
}
