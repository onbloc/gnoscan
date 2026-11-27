import {
  GetGovernanceMembersRequest,
  GetGovernanceProposalsRequest,
  GetGovernanceProposalVotesRequest,
} from "./request";
import {
  GetGovernanceMembersResponse,
  GetGovernanceProposalResponse,
  GetGovernanceProposalsResponse,
  GetGovernanceProposalVotesResponse,
  GetGovernanceSummaryResponse,
} from "./response";

export interface ApiGovernanceRepository {
  getGovernanceSummary(): Promise<GetGovernanceSummaryResponse>;
  getGovernanceProposals(params: GetGovernanceProposalsRequest): Promise<GetGovernanceProposalsResponse>;
  getGovernanceMembers(params: GetGovernanceMembersRequest): Promise<GetGovernanceMembersResponse>;
  getGovernanceProposal(id: string): Promise<GetGovernanceProposalResponse>;
  getGovernanceProposalVotes(params: GetGovernanceProposalVotesRequest): Promise<GetGovernanceProposalVotesResponse>;
}
