import React from "react";

import { useListPagination } from "@/common/hooks/common/use-list-pagination";
import { useHistoryEntryState } from "@/common/hooks/detail-tabs/use-history-entry-state";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useDebounce } from "@/common/hooks/use-debounce";
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
import { ListSearch } from "@/components/view/list-summary/ListSearch";
import { Message as ErrorMessage } from "@/layouts/governance/ProposalLayout.styles";

interface GovernanceListState {
  network: string | undefined;
  tab: "proposals" | "members";
  proposalsSort: GovernanceSort<"id" | "status"> | null;
  membersSort: GovernanceSort<"tier" | "power"> | null;
  searchValue: string;
  keyword: string;
}

const GovernanceList = () => {
  const { currentNetwork } = useNetworkProvider();
  const network = currentNetwork?.chainId;
  const initialState = React.useMemo<GovernanceListState>(
    () => ({ network, tab: "proposals", proposalsSort: null, membersSort: null, searchValue: "", keyword: "" }),
    [network],
  );
  const [listState, setListState] = useHistoryEntryState("governance:list", initialState);
  const networkChanged = network !== undefined && listState.network !== network;
  const { tab, proposalsSort, membersSort, searchValue = "", keyword = "" } = networkChanged ? initialState : listState;
  // Seed the restored query while a pending search resumes its debounce.
  const debouncedKeyword = useDebounce(searchValue.trim(), 300, keyword);
  const proposalScope = `${proposalsSort?.field ?? "none"}:${proposalsSort?.order ?? "none"}:${keyword}`;
  const memberScope = `${membersSort?.field ?? "none"}:${membersSort?.order ?? "none"}`;
  const [proposalPage, setProposalPage] = useListPagination("governance-proposals", proposalScope);
  const [memberPage, setMemberPage] = useListPagination("governance-members", memberScope);
  if (networkChanged) {
    setListState(initialState);
    setProposalPage(1);
    setMemberPage(1);
  }
  React.useEffect(() => {
    if (debouncedKeyword === searchValue.trim() && debouncedKeyword !== keyword) {
      setProposalPage(1);
      setListState(previous => ({ ...previous, keyword: debouncedKeyword }));
    }
  }, [debouncedKeyword, searchValue, keyword, setProposalPage, setListState]);
  const summary = useGetGovernanceSummary();
  const live = useGetLiveGovernanceProposals();
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
      ...(keyword ? { q: keyword } : {}),
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
              Proposals{" "}
              <S.TabCount>{summary.data ? formatGovernanceNumber(summary.data.proposals.total) : "-"}</S.TabCount>
            </S.Tab>
            <S.Tab
              type="button"
              $active={tab === "members"}
              aria-pressed={tab === "members"}
              onClick={() => setListState(previous => ({ ...previous, tab: "members" }))}
            >
              Members <S.TabCount>{summary.data ? formatGovernanceNumber(summary.data.members.total) : "-"}</S.TabCount>
            </S.Tab>
          </S.Tabs>
          {tab === "proposals" && (
            <S.Search>
              <ListSearch
                value={searchValue}
                onChange={value => setListState(previous => ({ ...previous, searchValue: value }))}
                placeholder="Search proposals"
              />
            </S.Search>
          )}
        </S.Toolbar>
        {tab === "proposals" ? (
          <>
            {proposals.isError ? (
              <ErrorMessage role="alert">
                Unable to load proposals.
                <button type="button" onClick={() => proposals.refetch()}>
                  Try again
                </button>
              </ErrorMessage>
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
              <ErrorMessage role="alert">
                Unable to load members.
                <button type="button" onClick={() => members.refetch()}>
                  Try again
                </button>
              </ErrorMessage>
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
