export interface GovernanceAccount {
  address: string | null;
  nameTag: string | null;
}

export interface GovernanceVoteTally {
  percent: number | null;
  count: number;
  power: number;
}

export interface GovernanceVotes {
  yes: GovernanceVoteTally;
  no: GovernanceVoteTally;
  abstain: GovernanceVoteTally;
}

export type GovernanceStatus = "ACTIVE" | "ACCEPTED" | "REJECTED";

export interface GovernanceProposal {
  id: number;
  title: string;
  type: "VALIDATOR_SET" | "PARAMETER" | "MEMBER_CHANGE" | "OTHER";
  status: GovernanceStatus;
  proposer: GovernanceAccount;
  votes: GovernanceVotes;
}

export interface GovernanceSummary {
  syncedAt: string | null;
  proposals: { total: number; active: number; accepted: number; rejected: number };
  members: {
    total: number;
    totalPower: number;
    tiers: { tier: string; count: number; power: number; powerShare: number }[];
  };
}

export interface GovernanceProposalDetail extends GovernanceProposal {
  description: string;
  eligibleTiers: string[];
  executorPackagePath: string | null;
  newMember: { address: string; tier: string } | null;
  createdTx: { hash: string; height: number | null; time: string | null } | null;
  turnout: { castMembers: number; eligibleMembers: number | null; castPowerPercent: number | null };
  prevId: number | null;
  nextId: number | null;
}

export interface GovernanceVote {
  voter: GovernanceAccount;
  tier: string;
  choice: "YES" | "NO" | "ABSTAIN";
  power: number;
  txHash: string | null;
  votedAt: string | null;
}

export interface GovernanceMember {
  tier: string;
  address: string;
  power: number;
  votes: { yes: number; no: number; abstain: number; total: number };
  proposalsAuthored: number;
}

export interface GovernancePage<T> {
  items: T[];
  page: { hasNext: boolean; totalCount: number };
}
