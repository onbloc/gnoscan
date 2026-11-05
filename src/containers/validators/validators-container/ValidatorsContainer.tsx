import React from "react";

import { usePagedList } from "@/common/hooks/common/use-paged-list";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useGetValidators } from "@/common/react-query/validator/api/use-get-validators";
import { useGetValidatorCommits } from "@/common/react-query/validator/api/use-get-validator-commits";
import { VALIDATORS_LIST_PAGE_SIZE } from "@/common/values/query.constant";
import { ListPagination } from "@/components/view/common/list-pagination/ListPagination";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";
import ValidatorTable from "@/components/view/validator/validator-table/ValidatorTable";

const COMMIT_SIZE = 20;

const ValidatorsList = () => {
  const validators = usePagedList("validators", "", useGetValidators, { limit: VALIDATORS_LIST_PAGE_SIZE });
  const { data: commitsData } = useGetValidatorCommits({ size: COMMIT_SIZE });

  // Show skeleton only on initial load; keep previous rows while paging
  if (!validators.isFetched) return <TableSkeleton />;

  return (
    <ValidatorTable
      validators={validators.items}
      commits={commitsData?.validatorCommits ?? []}
      fromHeight={commitsData?.fromHeight ?? null}
      toHeight={commitsData?.toHeight ?? null}
      commitSize={COMMIT_SIZE}
      footer={<ListPagination {...validators.pagination} />}
    />
  );
};

const ValidatorsContainer = () => {
  const { currentNetwork } = useNetworkProvider();

  // Remount on network change so keepPreviousData does not show the previous network's rows
  return <ValidatorsList key={currentNetwork?.chainId} />;
};

export default ValidatorsContainer;
