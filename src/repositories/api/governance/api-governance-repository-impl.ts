import { makeEncodedQueryParameter } from "@/common/utils/string-util";
import { ApiRepository } from "../api-repository";
import { ApiGovernanceRepository } from "./api-governance-repository";
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

export class ApiGovernanceRepositoryImpl extends ApiRepository implements ApiGovernanceRepository {
  getGovernanceSummary(): Promise<GetGovernanceSummaryResponse> {
    return this.get("governance/summary");
  }

  getGovernanceProposals(params: GetGovernanceProposalsRequest): Promise<GetGovernanceProposalsResponse> {
    return this.get(`governance/proposals${makeEncodedQueryParameter({ ...params })}`);
  }

  getGovernanceMembers(params: GetGovernanceMembersRequest): Promise<GetGovernanceMembersResponse> {
    return this.get(`governance/members${makeEncodedQueryParameter({ ...params })}`);
  }

  getGovernanceProposal(id: string): Promise<GetGovernanceProposalResponse> {
    return this.get(`governance/proposals/${encodeURIComponent(id)}`);
  }

  getGovernanceProposalVotes({
    id,
    ...params
  }: GetGovernanceProposalVotesRequest): Promise<GetGovernanceProposalVotesResponse> {
    return this.get(`governance/proposals/${encodeURIComponent(id)}/votes${makeEncodedQueryParameter(params)}`);
  }
}
