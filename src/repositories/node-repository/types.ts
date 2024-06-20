export interface INodeRepository {
  health(): Promise<boolean>;

  status(): Promise<NodeResultStatus>;

  netInfo(): Promise<NodeResultNetInfo>;

  genesis(): Promise<NodeResultGenesis>;

  consensusParams(height: number): Promise<NodeResultConsensusParams>;

  consensusState(): Promise<NodeResultConsensusState>;

  commit(height: number): Promise<NodeResultCommit>;

  block(height: number): Promise<NodeResultBlock>;

  blockResults(height: number): Promise<NodeResultBlockResults>;

  blockchain(minHeight: number, maxHeight: number): Promise<NodeResultBlockchainInfo>;

  validators(height: number): Promise<NodeResultValidators>;

  abciInfo(): Promise<NodeResultABCIInfo>;

  abciQuery(path: string, data: string): Promise<NodeResultABCIQuery>;

  abciQueryAuthAccount(address: string): Promise<NodeResultABCIQuery>;

  abciQueryBankBalances(address: string): Promise<NodeResultABCIQuery>;

  abciQueryVMQueryFuncs(packagePath: string): Promise<NodeResultABCIQuery>;

  abciQueryVMQueryFile(packagePath: string): Promise<NodeResultABCIQuery>;

  abciQueryVMQueryRender(packagePath: string, data: string[]): Promise<NodeResultABCIQuery>;

  abciQueryVMQueryEvaluation(
    packagePath: string,
    funcName: string,
    args: string[],
  ): Promise<NodeResultABCIQuery>;
}

export interface NodeResultStatus {}

export interface NodeResultNetInfo {}

export interface NodeResultGenesis {}

export interface NodeResultConsensusParams {}

export interface NodeResultConsensusState {}

export interface NodeResultCommit {}

export interface NodeResultBlock {}

export interface NodeResultBlockResults {}

export interface NodeResultBlockchainInfo {}

export interface NodeResultValidators {}

export interface NodeResultABCIInfo {}

export interface NodeResultABCIQuery {}

export interface NodeResultABCIQuery {}

export interface NodeResultABCIQuery {}

export interface NodeResultABCIQuery {}

export interface NodeResultABCIQuery {}

export interface NodeResultABCIQuery {}

export interface NodeResultABCIQuery {}
