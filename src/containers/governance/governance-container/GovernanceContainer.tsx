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
import { ListPagination, ListPaginationProps } from "@/components/view/common/list-pagination/ListPagination";
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

interface GovernanceTableProps<Field extends string>
  extends Pick<ListPaginationProps, "page" | "scope" | "onChangePage"> {
  sort: GovernanceSort<Field> | null;
  onSort: (sort: GovernanceSort<Field> | undefined) => void;
}

// A pending scope must not claim data retained from the previous query.
const useScopedData = <Data,>(scope: string, data: Data | undefined, isPreviousData: boolean) => {
  const [dataScope, setDataScope] = React.useState(scope);
  if (data !== undefined && !isPreviousData && dataScope !== scope) {
    setDataScope(scope);
  }
  return isPreviousData && dataScope !== scope ? undefined : data;
};

const GovernanceProposals = ({
  page,
  scope,
  sort,
  keyword,
  onSort,
  onChangePage,
}: GovernanceTableProps<"id" | "status"> & { keyword: string }) => {
  const proposals = useGetGovernanceProposals({
    page,
    limit: DEFAULT_LIST_ITEMS_SIZE,
    ...(sort ? { sort: sort.field, order: sort.order } : {}),
    ...(keyword ? { q: keyword } : {}),
  });
  const data = useScopedData(scope, proposals.data, proposals.isPreviousData);

  return (
    <>
      <GovernanceProposalTable
        proposals={data?.items}
        sort={sort ?? undefined}
        onSort={onSort}
        error={
          proposals.isError ? (
            <ErrorMessage role="alert">
              Unable to load proposals.
              <button type="button" onClick={() => proposals.refetch()}>
                Try again
              </button>
            </ErrorMessage>
          ) : undefined
        }
      />
      <ListPagination
        page={page}
        pageSize={DEFAULT_LIST_ITEMS_SIZE}
        totalCount={proposals.isPreviousData ? undefined : proposals.data?.page.totalCount}
        hasNext={proposals.isPreviousData ? undefined : proposals.data?.page.hasNext}
        isSettled={proposals.isSuccess && !proposals.isPreviousData}
        scope={scope}
        onChangePage={onChangePage}
      />
    </>
  );
};

const GovernanceMembers = ({ page, scope, sort, onSort, onChangePage }: GovernanceTableProps<"tier" | "power">) => {
  const members = useGetGovernanceMembers({
    page,
    limit: DEFAULT_LIST_ITEMS_SIZE,
    ...(sort ? { sort: sort.field, order: sort.order } : {}),
  });
  const data = useScopedData(scope, members.data, members.isPreviousData);

  return (
    <>
      <GovernanceMemberTable
        members={data?.items}
        sort={sort ?? undefined}
        onSort={onSort}
        error={
          members.isError ? (
            <ErrorMessage role="alert">
              Unable to load members.
              <button type="button" onClick={() => members.refetch()}>
                Try again
              </button>
            </ErrorMessage>
          ) : undefined
        }
      />
      <ListPagination
        page={page}
        pageSize={DEFAULT_LIST_ITEMS_SIZE}
        totalCount={members.isPreviousData ? undefined : members.data?.page.totalCount}
        hasNext={members.isPreviousData ? undefined : members.data?.page.hasNext}
        isSettled={members.isSuccess && !members.isPreviousData}
        scope={scope}
        onChangePage={onChangePage}
      />
    </>
  );
};

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

  return (
    <>
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
          <GovernanceProposals
            page={proposalPage}
            scope={proposalScope}
            sort={proposalsSort}
            keyword={keyword}
            onSort={sort => {
              setProposalPage(1);
              setListState(previous => ({ ...previous, proposalsSort: sort ?? null }));
            }}
            onChangePage={setProposalPage}
          />
        ) : (
          <GovernanceMembers
            page={memberPage}
            scope={memberScope}
            sort={membersSort}
            onSort={sort => {
              setMemberPage(1);
              setListState(previous => ({ ...previous, membersSort: sort ?? null }));
            }}
            onChangePage={setMemberPage}
          />
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

  return (
    <>
      <div>
        <PageTitle title="Governance" type="h2" />
        <S.Subtitle>GovDAO proposals and tiered membership</S.Subtitle>
      </div>
      {currentNetwork ? (
        <GovernanceList key={currentNetwork.chainId} />
      ) : (
        <>
          <GovernanceSummaryCards summaryError={false} liveError={false} latestError={false} />
          <S.Panel aria-busy="true">
            <TableSkeleton />
          </S.Panel>
        </>
      )}
    </>
  );
};

export default GovernanceContainer;
