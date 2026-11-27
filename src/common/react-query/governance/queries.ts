import { UseQueryOptions } from "@tanstack/react-query";
import { isAxiosError } from "axios";
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

export function useGetGovernanceSummary(options?: UseQueryOptions<GovernanceSummary, Error>) {
  const { apiGovernanceRepository: repository } = useServiceProvider();
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
  const { apiGovernanceRepository: repository } = useServiceProvider();
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
  const { apiGovernanceRepository: repository } = useServiceProvider();
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
  const { apiGovernanceRepository: repository } = useServiceProvider();
  return useApiRepositoryQuery(
    [QUERY_KEY.getGovernanceProposal, id],
    repository,
    API_REPOSITORY_KEY.GOVERNANCE_REPOSITORY,
    repository => repository.getGovernanceProposal(id),
    {
      retry: (failureCount, error) => {
        const status = isAxiosError(error) ? error.response?.status : undefined;
        return status !== 400 && status !== 404 && failureCount < 3;
      },
      ...options,
      enabled: !!id && options?.enabled !== false,
    },
  );
}

export function useGetGovernanceProposalVotes(
  params: GetGovernanceProposalVotesRequest,
  options?: UseQueryOptions<GovernancePage<GovernanceVote>, Error>,
) {
  const { apiGovernanceRepository: repository } = useServiceProvider();
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
  const { apiGovernanceRepository: repository } = useServiceProvider();
  return useApiRepositoryQuery(
    [QUERY_KEY.getLiveGovernanceProposals],
    repository,
    API_REPOSITORY_KEY.GOVERNANCE_REPOSITORY,
    async repository => {
      const proposals: GovernanceProposal[] = [];
      let page = 1;
      let hasNext = true;
      let previousId: number | undefined;
      while (hasNext) {
        const response = await repository.getGovernanceProposals({
          status: "ACTIVE",
          sort: "id",
          order: "desc",
          page,
          limit: 100,
        });
        if (response.items.length === 0 && response.page.hasNext) {
          throw new Error("Governance pagination returned an empty page with more pages");
        }
        // Strictly descending nonnegative safe IDs bound pagination without a page cap.
        for (const proposal of response.items) {
          if (!Number.isSafeInteger(proposal.id) || proposal.id < 0) {
            throw new Error("Governance pagination returned an invalid proposal ID");
          }
          if (previousId !== undefined && !(proposal.id < previousId)) {
            throw new Error("Governance pagination did not advance in descending ID order");
          }
          previousId = proposal.id;
          proposals.push(proposal);
        }
        hasNext = response.page.hasNext;
        page += 1;
      }
      return proposals;
    },
    { refetchInterval: LIST_SUMMARY_REFETCH_INTERVAL, ...options },
  );
}
