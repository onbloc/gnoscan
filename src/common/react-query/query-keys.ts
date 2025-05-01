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
}
