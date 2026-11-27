import React from "react";

import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import {
  useGetGovernanceMembers,
  useGetGovernanceProposals,
  useGetGovernanceSummary,
  useGetLiveGovernanceProposals,
} from "@/common/react-query/governance/queries";
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

interface GovernanceListState {
  network: string | undefined;
  tab: "proposals" | "members";
  proposalsSort: GovernanceSort<"id" | "status"> | null;
  membersSort: GovernanceSort<"tier" | "power"> | null;
}

const GovernanceList = () => {
  const { currentNetwork } = useNetworkProvider();
  const network = currentNetwork?.chainId;
  const initialState = React.useMemo<GovernanceListState>(
    () => ({ network, tab: "proposals", proposalsSort: null, membersSort: null }),
    [network],
  );
  const [listState, setListState] = useHistoryEntryState("governance:list", initialState);
  const networkChanged = network !== undefined && listState.network !== network;
  const { tab, proposalsSort, membersSort } = networkChanged ? initialState : listState;
  const search = useListKeyword();
  const proposalScope = `${proposalsSort?.field ?? "none"}:${proposalsSort?.order ?? "none"}:${search.keyword ?? ""}`;
  const memberScope = `${membersSort?.field ?? "none"}:${membersSort?.order ?? "none"}`;
  const [proposalPage, setProposalPage] = useListPagination("governance-proposals", proposalScope);
  const [memberPage, setMemberPage] = useListPagination("governance-members", memberScope);
  if (networkChanged) {
    setListState(initialState);
    setProposalPage(1);
    setMemberPage(1);
  }
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
      ...(proposalsSort ? { sort: proposalsSort.field, order: proposalsSort.order } : {}),
      ...(search.keyword ? { q: search.keyword } : {}),
    },
    { enabled: tab === "proposals", keepPreviousData: true },
  );
  const members = useGetGovernanceMembers(
    {
      page: memberPage,
      limit: DEFAULT_LIST_ITEMS_SIZE,
      ...(membersSort ? { sort: membersSort.field, order: membersSort.order } : {}),
    },
    { enabled: tab === "members", keepPreviousData: true },
  );

  return (
    <>
      <div>
        <PageTitle title="Governance" type="h2" />
        <S.Subtitle>GovDAO proposals and tiered membership</S.Subtitle>
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
              onClick={() => setListState(previous => ({ ...previous, tab: "proposals" }))}
            >
              Proposals <S.Count>{summary.data ? formatGovernanceNumber(summary.data.proposals.total) : "-"}</S.Count>
            </S.Tab>
            <S.Tab
              type="button"
              $active={tab === "members"}
              aria-pressed={tab === "members"}
              onClick={() => setListState(previous => ({ ...previous, tab: "members" }))}
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
                sort={proposalsSort ?? undefined}
                onSort={sort => {
                  setProposalPage(1);
                  setListState(previous => ({ ...previous, proposalsSort: sort ?? null }));
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
                sort={membersSort ?? undefined}
                onSort={sort => {
                  setMemberPage(1);
                  setListState(previous => ({ ...previous, membersSort: sort ?? null }));
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
