import { UseQueryOptions } from "@tanstack/react-query";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useServiceProvider } from "@/common/hooks/provider/use-service-provider";
import { useApiRepositoryPageQuery, useApiRepositoryQuery } from "@/common/react-query/hoc/api";
import { QUERY_KEY } from "@/common/react-query/query-keys";
import { API_REPOSITORY_KEY, LIST_SUMMARY_REFETCH_INTERVAL } from "@/common/values/query.constant";
import {
  GovernanceMember,
  GovernancePage,
  GovernanceProposal,
  GovernanceProposalDetail,
  GovernanceSummary,
  GovernanceVote,
} from "@/models/api/governance";
import {
  GetGovernanceMembersRequest,
  GetGovernanceProposalsRequest,
  GetGovernanceProposalVotesRequest,
} from "@/repositories/api/governance/request";

function useGovernanceRepository() {
  const { apiGovernanceRepository } = useServiceProvider();
  const { isCustomNetwork } = useNetworkProvider();
  return isCustomNetwork ? null : apiGovernanceRepository;
}

export function useGetGovernanceSummary(options?: UseQueryOptions<GovernanceSummary, Error>) {
  const repository = useGovernanceRepository();
  return useApiRepositoryQuery(
    [QUERY_KEY.getGovernanceSummary],
    repository,
    API_REPOSITORY_KEY.GOVERNANCE_REPOSITORY,
    repository => repository.getGovernanceSummary(),
    { refetchInterval: LIST_SUMMARY_REFETCH_INTERVAL, ...options },
  );
}

export function useGetGovernanceProposals(
  params: GetGovernanceProposalsRequest = {},
  options?: UseQueryOptions<GovernancePage<GovernanceProposal>, Error>,
) {
  const repository = useGovernanceRepository();
  const request = { ...params, page: params.page ?? 1 };
  return useApiRepositoryPageQuery(
    [QUERY_KEY.getGovernanceProposals],
    request,
    repository,
    API_REPOSITORY_KEY.GOVERNANCE_REPOSITORY,
    (repository, request) => repository.getGovernanceProposals(request),
    options,
  );
}

export function useGetGovernanceMembers(
  params: GetGovernanceMembersRequest = {},
  options?: UseQueryOptions<GovernancePage<GovernanceMember>, Error>,
) {
  const repository = useGovernanceRepository();
  const request = { ...params, page: params.page ?? 1 };
  return useApiRepositoryPageQuery(
    [QUERY_KEY.getGovernanceMembers],
    request,
    repository,
    API_REPOSITORY_KEY.GOVERNANCE_REPOSITORY,
    (repository, request) => repository.getGovernanceMembers(request),
    options,
  );
}

export function useGetGovernanceProposal(id: string, options?: UseQueryOptions<GovernanceProposalDetail, Error>) {
  const repository = useGovernanceRepository();
  return useApiRepositoryQuery(
    [QUERY_KEY.getGovernanceProposal, id],
    repository,
    API_REPOSITORY_KEY.GOVERNANCE_REPOSITORY,
    repository => repository.getGovernanceProposal(id),
    { ...options, enabled: !!id && options?.enabled !== false },
  );
}

export function useGetGovernanceProposalVotes(
  params: GetGovernanceProposalVotesRequest,
  options?: UseQueryOptions<GovernancePage<GovernanceVote>, Error>,
) {
  const repository = useGovernanceRepository();
  const request = { ...params, page: params.page ?? 1 };
  return useApiRepositoryPageQuery(
    [QUERY_KEY.getGovernanceProposalVotes],
    request,
    repository,
    API_REPOSITORY_KEY.GOVERNANCE_REPOSITORY,
    (repository, request) => repository.getGovernanceProposalVotes(request),
    { ...options, enabled: !!params.id && options?.enabled !== false },
  );
}

export function useGetLiveGovernanceProposals(options?: UseQueryOptions<GovernanceProposal[], Error>) {
  const repository = useGovernanceRepository();
  return useApiRepositoryQuery(
    [QUERY_KEY.getLiveGovernanceProposals],
    repository,
    API_REPOSITORY_KEY.GOVERNANCE_REPOSITORY,
    async repository => {
      const proposals: GovernanceProposal[] = [];
      let page = 1;
      let hasNext = true;
      while (hasNext) {
        const response = await repository.getGovernanceProposals({
          status: "ACTIVE",
          sort: "id",
          order: "desc",
          page,
          limit: 100,
        });
        proposals.push(...response.items);
        hasNext = response.page.hasNext;
        page += 1;
      }
      return proposals;
    },
    { refetchInterval: LIST_SUMMARY_REFETCH_INTERVAL, ...options },
  );
}
