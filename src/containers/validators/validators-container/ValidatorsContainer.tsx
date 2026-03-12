import React from "react";

import { useGetValidators } from "@/common/react-query/validator/api/use-get-validators";
import { useGetValidatorCommits } from "@/common/react-query/validator/api/use-get-validator-commits";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";
import ValidatorTable from "@/components/view/validator/validator-table/ValidatorTable";

const COMMIT_SIZE = 20;

const ValidatorsContainer = () => {
  const {
    data: validatorsData,
    isLoading: isValidatorsLoading,
    isFetched: isValidatorsFetched,
  } = useGetValidators({ limit: 100 });

  const { data: commitsData } = useGetValidatorCommits({ size: COMMIT_SIZE });

  if (isValidatorsLoading || !isValidatorsFetched) return <TableSkeleton />;

  return (
    <ValidatorTable
      validators={validatorsData?.items ?? []}
      commits={commitsData?.validatorCommits ?? []}
      fromHeight={commitsData?.fromHeight ?? null}
      toHeight={commitsData?.toHeight ?? null}
      commitSize={COMMIT_SIZE}
    />
  );
};

export default ValidatorsContainer;
