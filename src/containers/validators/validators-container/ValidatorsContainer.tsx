import React from "react";

import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useGetValidators } from "@/common/react-query/validator/api/use-get-validators";
import { useGetValidatorCommits } from "@/common/react-query/validator/api/use-get-validator-commits";
import { VALIDATORS_LIST_PAGE_SIZE } from "@/common/values/query.constant";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";
import ValidatorTable from "@/components/view/validator/validator-table/ValidatorTable";
import { Pagination } from "@/components/ui/pagination";

const COMMIT_SIZE = 20;

const ValidatorsContainer = () => {
  const { currentNetwork } = useNetworkProvider();
  // A network switch keeps the history entry, so the network is part of the name to start each network on page 1.
  const [page, setPage] = useHistoryEntryState(`validators:${currentNetwork?.chainId}:page`, 1);

  const { data, isFetched, isPreviousData } = useGetValidators({ page, limit: VALIDATORS_LIST_PAGE_SIZE });
  const { data: commitsData } = useGetValidatorCommits({ size: COMMIT_SIZE });

  // Show skeleton only on initial load; keep previous rows while paging
  if (!isFetched && !isPreviousData) return <TableSkeleton />;

  const totalPages = Math.max(1, Math.ceil((data?.page.totalCount ?? 0) / VALIDATORS_LIST_PAGE_SIZE));

  return (
    <ValidatorTable
      validators={data?.items ?? []}
      commits={commitsData?.validatorCommits ?? []}
      fromHeight={commitsData?.fromHeight ?? null}
      toHeight={commitsData?.toHeight ?? null}
      commitSize={COMMIT_SIZE}
      footer={
        <Pagination
          page={page}
          totalPages={totalPages}
          hasNext={data?.page.hasNext}
          hideFirstPageButtonWhenDisabled
          hideLastPageButtonWhenCurrent
          onChangePage={nextPage => setPage(Math.min(Math.max(nextPage, 1), totalPages))}
        />
      }
    />
  );
};

export default ValidatorsContainer;
