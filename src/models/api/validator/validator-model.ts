export type ValidatorStatus = "ACTIVE" | "INACTIVE" | "JAILED" | "PENDING";

export interface ValidatorModel {
  id: number;

  monikerName: string;

  status: ValidatorStatus;

  address: string;

  votingPower: string;

  shareRate: string;

  firstCommittedHeight: number;

  inActivatedHeight: number | null;

  firstCommittedTime: string;

  proposalId: string | null;
}

export interface ValidatorCommitItem {
  height: number;

  signed: boolean;

  proposed: boolean;
}

export interface ValidatorCommitModel {
  validatorAddress: string;

  commits: ValidatorCommitItem[];
}
