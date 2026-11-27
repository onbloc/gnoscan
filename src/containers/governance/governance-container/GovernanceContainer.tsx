import React from "react";

import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import {
  useGetGovernanceMembers,
  useGetGovernanceProposals,
  useGetGovernanceSummary,
  useGetLiveGovernanceProposals,
} from "@/common/react-query/governance/queries";
import { formatDate, getDateDiff } from "@/common/utils/date-util";
import { formatGovernanceNumber } from "@/common/utils/governance-util";
import { DEFAULT_LIST_ITEMS_SIZE, LIST_SUMMARY_REFETCH_INTERVAL } from "@/common/values/query.constant";
import { ListPagination } from "@/components/view/common/list-pagination/ListPagination";
import { PageTitle } from "@/components/view/common/page-title/PageTitle";
import TableSkeleton from "@/components/view/common/table-skeleton/TableSkeleton";
import {
  GovernanceMemberTable,
  GovernanceProposalTable,
  GovernanceSort,
  GovernanceSummaryCards,
} from "@/components/view/governance/governance-list";
import * as S from "@/components/view/governance/governance-list.styles";
import { ListSearch, useListKeyword } from "@/components/view/list-summary/ListSearch";

const useGovernanceSort = <Field extends string>() => {
  const [sort, setSort] = React.useState<GovernanceSort<Field>>();
  const onSort = (field: Field) => {
    setSort(previous =>
      previous?.field !== field
        ? { field, order: "desc" }
        : previous.order === "desc"
        ? { field, order: "asc" }
        : undefined,
    );
  };
  return { sort, onSort };
};

const GovernanceList = () => {
  const [tab, setTab] = React.useState<"proposals" | "members">("proposals");
  const search = useListKeyword();
  const proposalsSort = useGovernanceSort<"id" | "status">();
  const membersSort = useGovernanceSort<"tier" | "power">();
  const proposalScope = `${proposalsSort.sort?.field ?? "none"}:${proposalsSort.sort?.order ?? "none"}:${
    search.keyword ?? ""
  }`;
  const memberScope = `${membersSort.sort?.field ?? "none"}:${membersSort.sort?.order ?? "none"}`;
  const [proposalPage, setProposalPage] = useListPagination("governance-proposals", proposalScope);
  const [memberPage, setMemberPage] = useListPagination("governance-members", memberScope);
  const previousKeyword = React.useRef(search.keyword);
  React.useEffect(() => {
    if (previousKeyword.current !== search.keyword) {
      setProposalPage(1);
      previousKeyword.current = search.keyword;
    }
  }, [search.keyword, setProposalPage]);
  const summary = useGetGovernanceSummary({ refetchInterval: LIST_SUMMARY_REFETCH_INTERVAL });
  const live = useGetLiveGovernanceProposals({ refetchInterval: LIST_SUMMARY_REFETCH_INTERVAL });
  const latest = useGetGovernanceProposals(
    { page: 1, limit: 1 },
    {
      enabled: live.isSuccess && live.data.length === 0,
      refetchInterval: LIST_SUMMARY_REFETCH_INTERVAL,
    },
  );
  const proposals = useGetGovernanceProposals(
    {
      page: proposalPage,
      limit: DEFAULT_LIST_ITEMS_SIZE,
      ...(proposalsSort.sort ? { sort: proposalsSort.sort.field, order: proposalsSort.sort.order } : {}),
      ...(search.keyword ? { q: search.keyword } : {}),
    },
    { enabled: tab === "proposals", keepPreviousData: true },
  );
  const members = useGetGovernanceMembers(
    {
      page: memberPage,
      limit: DEFAULT_LIST_ITEMS_SIZE,
      ...(membersSort.sort ? { sort: membersSort.sort.field, order: membersSort.sort.order } : {}),
    },
    { enabled: tab === "members", keepPreviousData: true },
  );
  const syncedAt = summary.data?.syncedAt;

  return (
    <>
      <div>
        <PageTitle title="Governance" type="h2" />
        <S.Subtitle>
          GovDAO proposals and tiered membership · Synced{" "}
          {syncedAt && formatDate(syncedAt) !== "-" ? getDateDiff(syncedAt) : "unknown"}
        </S.Subtitle>
      </div>
      <GovernanceSummaryCards
        summary={summary.data}
        summaryError={summary.isError}
        live={live.data}
        liveError={live.isError}
        latest={latest.data?.items}
        latestError={latest.isError}
      />
      <S.Panel>
        <S.Toolbar>
          <S.Tabs role="group" aria-label="Governance lists">
            <S.Tab
              type="button"
              $active={tab === "proposals"}
              aria-pressed={tab === "proposals"}
              onClick={() => setTab("proposals")}
            >
              Proposals <S.Count>{summary.data ? formatGovernanceNumber(summary.data.proposals.total) : "-"}</S.Count>
            </S.Tab>
            <S.Tab
              type="button"
              $active={tab === "members"}
              aria-pressed={tab === "members"}
              onClick={() => setTab("members")}
            >
              Members <S.Count>{summary.data ? formatGovernanceNumber(summary.data.members.total) : "-"}</S.Count>
            </S.Tab>
          </S.Tabs>
          {tab === "proposals" && (
            <S.Search>
              <ListSearch value={search.value} onChange={search.setValue} placeholder="Search proposals" />
            </S.Search>
          )}
        </S.Toolbar>
        {tab === "proposals" ? (
          <>
            {proposals.isError ? (
              <S.Message role="alert">Unable to load proposals.</S.Message>
            ) : proposals.data === undefined ? (
              <TableSkeleton />
            ) : (
              <GovernanceProposalTable
                proposals={proposals.data.items}
                sort={proposalsSort.sort}
                onSort={field => {
                  setProposalPage(1);
                  proposalsSort.onSort(field);
                }}
              />
            )}
            <ListPagination
              page={proposalPage}
              pageSize={DEFAULT_LIST_ITEMS_SIZE}
              totalCount={proposals.isPreviousData ? undefined : proposals.data?.page.totalCount}
              hasNext={proposals.isPreviousData ? undefined : proposals.data?.page.hasNext}
              isSettled={proposals.isSuccess && !proposals.isPreviousData}
              scope={proposalScope}
              onChangePage={setProposalPage}
            />
          </>
        ) : (
          <>
            {members.isError ? (
              <S.Message role="alert">Unable to load members.</S.Message>
            ) : members.data === undefined ? (
              <TableSkeleton />
            ) : (
              <GovernanceMemberTable
                members={members.data.items}
                sort={membersSort.sort}
                onSort={field => {
                  setMemberPage(1);
                  membersSort.onSort(field);
                }}
              />
            )}
            <ListPagination
              page={memberPage}
              pageSize={DEFAULT_LIST_ITEMS_SIZE}
              totalCount={members.isPreviousData ? undefined : members.data?.page.totalCount}
              hasNext={members.isPreviousData ? undefined : members.data?.page.hasNext}
              isSettled={members.isSuccess && !members.isPreviousData}
              scope={memberScope}
              onChangePage={setMemberPage}
            />
          </>
        )}
      </S.Panel>
    </>
  );
};

const GovernanceContainer = () => {
  const { currentNetwork, isCustomNetwork } = useNetworkProvider();

  if (isCustomNetwork) {
    return (
      <>
        <PageTitle title="Governance" type="h2" />
        <S.Message>Governance is not supported on custom networks.</S.Message>
      </>
    );
  }

  return <GovernanceList key={currentNetwork?.chainId} />;
};

export default GovernanceContainer;
