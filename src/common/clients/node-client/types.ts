/* eslint-disable @typescript-eslint/no-explicit-any */
export interface NodeClient {
  health(): Promise<boolean>;

  status(): Promise<NodeResponseStatus>;

  genesis(): Promise<NodeResponseGenesis>;

  block(height: number): Promise<NodeResponseBlock>;

  blockResults(height: number): Promise<NodeResponseBlockResults>;

  blockchain(minHeight: number, maxHeight: number): Promise<NodeResponseBlockchainInfo>;

  validators(height: number): Promise<NodeResponseValidators>;

  abciQuery(path: string, data: string): Promise<NodeResponseABCIQuery>;

  abciQueryAuthAccount(address: string): Promise<NodeResponseABCIQuery>;

  abciQueryBankBalances(address: string): Promise<NodeResponseABCIQuery>;

  abciQueryVMQueryFuncs(packagePath: string): Promise<NodeResponseABCIQuery>;

  abciQueryVMQueryFile(packagePath: string): Promise<NodeResponseABCIQuery>;

  abciQueryVMQueryRender(packagePath: string, data: string[]): Promise<NodeResponseABCIQuery>;

  abciQueryVMQueryEvaluation(packagePath: string, funcName: string, args: string[]): Promise<NodeResponseABCIQuery>;
}

export interface NodeResponseStatus {
  node_info: NodeInfo;
  sync_info: SyncInfo;
  validator_info: ValidatorInfo;
}

export interface NodeResponseGenesis {
  genesis: Genesis;
}

export interface NodeResponseBlock {
  block_meta: BlockMeta;
  block: Block;
}

export interface NodeResponseBlockResults {
  height: string;
  results: BlockResults;
}

export interface NodeResponseBlockchainInfo {
  last_height: string;
  block_metas: BlockMeta[];
}

export interface NodeResponseValidators {
  block_height: string;
  validators: ValidatorInfo[];
}

export interface NodeResponseTx {
  hash: string;
  height: string;
  index: number;
  tx_result: ABCIResponse;
  tx: string;
}

export interface NodeResponseABCIInfo {
  response: ABCIResponse;
}

export interface NodeResponseABCIQuery {
  response: ABCIResponse;
}

interface Block {
  header: Header;
  data: Data;
  last_commit: LastCommit;
}
interface LastCommit {
  block_id: BlockId;
  preCommit: PreCommit | null;
}
interface Data {
  txs: string[] | null;
}
export interface BlockMeta {
  block_id: BlockId;
  header: Header;
}
interface Header {
  version: string;
  chain_id: string;
  height: string;
  time: string;
  num_txs: string;
  total_txs: string;
  app_version: string;
  last_block_id: BlockId;
  last_commit_hash?: any;
  data_hash?: any;
  validators_hash: string;
  next_validators_hash: string;
  consensus_hash: string;
  app_hash?: any;
  last_results_hash?: any;
  proposer_address: number[] | string;
}
interface BlockId {
  hash: string;
  parts: Parts;
}
interface Parts {
  total: string;
  hash: string | null;
}
interface PreCommit {
  type: number;
  height: string;
  round: string;
  block_id: BlockId;
  timestamp: string;
  validator_address: string;
  validator_index: string;
  signature: string;
}

export interface BlockResults {
  deliver_tx: DeliverTx[];
  end_block: Endblock;
  begin_block: BeginBlock;
}

interface BeginBlock {
  ResponseBase: ResponseBase;
}

interface Endblock {
  ResponseBase: ResponseBase;
  ValidatorUpdates?: any;
  ConsensusParams?: any;
  Events: Event[] | null;
}

interface DeliverTx {
  ResponseBase: ResponseBase;
  GasWanted: string;
  GasUsed: string;
}

interface ResponseBase {
  Error: any;
  Data: string | null;
  Events: Event[] | null;
  Log: string;
  Info: string;
}

interface Event {
  "@type": string;
  type: string;
  pkg_path: string;
  func: string;
  attrs:
    | {
        key: string;
        value: string;
      }[]
    | null;
}

interface ValidatorInfo {
  address: string;
  pub_key: Pubkey;
  voting_power: string;
}

interface Pubkey {
  "@type": string;
  value: string;
}

interface SyncInfo {
  latest_block_hash: string;
  latest_app_hash: string;
  latest_block_height: string;
  latest_block_time: string;
  catching_up: boolean;
}

interface NodeInfo {
  version_set: VersionSet[];
  net_address: string;
  network: string;
  software: string;
  version: string;
  channels: string;
  moniker: string;
  other: Other;
}

interface Other {
  tx_index: string;
  rpc_address: string;
}

interface VersionSet {
  Name: string;
  Version: string;
  Optional: boolean;
}

interface Genesis {
  genesis_time: string;
  chain_id: string;
  consensus_params: ConsensusParams;
  validators: Validator[];
  app_hash?: any;
  app_state: AppState;
}
interface AppState {
  "@type": string;
  balances: string[];
  txs: Tx[];
}

interface Tx {
  msg: Msg[];
  fee: Fee;
  signatures: Signature[];
  memo: string;
}

interface Signature {
  pub_key?: Pubkey;
  signature?: string;
}

interface Fee {
  gas_wanted: string;
  gas_fee: string;
}

interface Msg {
  "@type": string;
  creator?: string;
  package?: Package;
  deposit?: string;
  caller?: string;
  send?: string;
  pkg_path?: string;
  func?: string;
  args?: string[];
}

interface Package {
  Name?: string;
  Path?: string;
  Files?: File[];
  name?: string;
  path?: string;
  files?: File[];
}

interface File {
  Name?: string;
  Body?: string;
  name?: string;
  body?: string;
}
interface Validator {
  address: string;
  pub_key: Pubkey;
  power: string;
  name: string;
}
interface Pubkey {
  "@type": string;
  value: string;
}
interface ConsensusParams {
  Block: {
    MaxTxBytes: string;
    MaxDataBytes: string;
    MaxBlockBytes: string;
    MaxGas: string;
    TimeIotaMS: string;
  };
  Validator: {
    PubKeyTypeURLs: string[];
  };
}
interface ABCIResponse {
  ResponseBase: ResponseBase;
  ABCIVersion: string;
  AppVersion: string;
  LastBlockHeight: string;
  LastBlockAppHash: string;
}
