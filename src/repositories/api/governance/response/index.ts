import {
  GovernanceMember,
  GovernancePage,
  GovernanceProposal,
  GovernanceProposalDetail,
  GovernanceSummary,
  GovernanceVote,
} from "@/models/api/governance";

export type GetGovernanceSummaryResponse = GovernanceSummary;
export type GetGovernanceProposalsResponse = GovernancePage<GovernanceProposal>;
export type GetGovernanceMembersResponse = GovernancePage<GovernanceMember>;
export type GetGovernanceProposalResponse = GovernanceProposalDetail;
export type GetGovernanceProposalVotesResponse = GovernancePage<GovernanceVote>;
