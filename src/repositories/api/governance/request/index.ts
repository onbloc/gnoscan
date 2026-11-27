import { GovernanceStatus } from "@/models/api/governance";

export interface GetGovernanceProposalsRequest {
  page?: number;
  limit?: number;
  sort?: "id" | "status";
  order?: "asc" | "desc";
  q?: string;
  status?: GovernanceStatus;
}

export interface GetGovernanceMembersRequest {
  page?: number;
  limit?: number;
  sort?: "tier" | "power";
  order?: "asc" | "desc";
}

export interface GetGovernanceProposalVotesRequest {
  id: string;
  page?: number;
  limit?: number;
}
