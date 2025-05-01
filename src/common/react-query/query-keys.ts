export enum QUERY_KEY {
  // block
  getBlocks = "api_get_blocks",
  getBlockByHeight = "api_get_block_by_height",
  getBlockEventsByHeight = "api_get_block_events_by_height",
  getBlockTransactionsByHeight = "api_get_block_transactions_by_height",

  // transaction
  getTransactions = "api_get_transactions",
  getTransactionByHash = "api_get_transaction_by_hash",
  getTransactionEventsByHash = "api_get_transaction_events_by_hash",
  getTransactionContractsByHash = "api_get_transaction_contracts_by_hash",

  // realm
  getRealms = "api_get_realms",
  getRealmByPath = "api_get_realm_by_path",
  getRealmEventsByPath = "api_get_realm_events_by_path",
  getRealmTransactionsByPath = "api_get_realm_transactions_by_path",

  // token
  getTokens = "api_get_tokens",
  getTokenById = "api_get_token_by_id",
  getTokenTransactionsById = "api_get_token_transactions_by_id",
}
