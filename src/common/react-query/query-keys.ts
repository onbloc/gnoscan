export enum QUERY_KEY {
  // account
  getAccount = "api_get_account",
  getAccountDirectTransactions = "api_get_account_direct_transactions",
  getAccountNativeTransfers = "api_get_account_native_transfers",
  getAccountTokenTransfers = "api_get_account_token_transfers",

  // block
  getBlocks = "api_get_blocks",
  getBlockByHeight = "api_get_block_by_height",
  getBlockEventsByHeight = "api_get_block_events_by_height",
  getBlockTransactionsByHeight = "api_get_block_transactions_by_height",
  getBlockTransactionsCountByHeight = "api_get_block_transactions_count_by_height",

  // transaction
  getTransactions = "api_get_transactions",
  getTransactionByHash = "api_get_transaction_by_hash",
  getTransactionPendingByHash = "api_get_transaction_pending_by_hash",
  getTransactionEventsByHash = "api_get_transaction_events_by_hash",
  getTransactionContractsByHash = "api_get_transaction_contracts_by_hash",

  // realm
  getRealms = "api_get_realms",
  getRealmByPath = "api_get_realm_by_path",
  getRealmEventsByPath = "api_get_realm_events_by_path",
  getRealmDirectTransactionsByPath = "api_get_realm_direct_transactions_by_path",
  getRealmNativeTransfersByPath = "api_get_realm_native_transfers_by_path",
  getRealmTokenTransfersByPath = "api_get_realm_token_transfers_by_path",
  getRealmInternalTransactionsByPath = "api_get_realm_internal_transactions_by_path",
  getRealmStorageDepositByPath = "get_realm_storage_deposit_by_path",

  // token
  getTokens = "api_get_tokens",
  getTokenById = "api_get_token_by_id",
  getTokenTransfersById = "api_get_token_transfers_by_id",
  getTokenHoldersById = "api_get_token_holders_by_id",
  getTokenMetaByPath = "api_get_token_meta_by_path",
  getTokenMetaTransactionsById = "api_get_token_meta_transactions_by_id",
  getTokenMetaInternalTransactionsById = "api_get_token_meta_internal_transactions_by_id",
  getTokenEventsById = "api_get_token_events_by_id",

  // statistics
  getLatestBlogs = "api_get_latest_blogs",
  getMonthlyActiveAccounts = "api_get_monthly_active_accounts",
  getNewestRealms = "api_get_newest_realms",
  getSummaryAccounts = "api_get_summary_accounts",
  getSummaryBlocks = "api_get_summary_blocks",
  getSummarySupply = "api_get_summary_supply",
  getSummaryTransactions = "api_get_summary_transactions",
  getTotalDailyFees = "api_get_total_daily_fees",
  getTotalDailyTransactions = "api_get_total_daily_transactions",
  getTotalGasShare = "api_get_total_gas_share",
  getTotalStorageDeposit = "get_total_storage_deposit",
  getStoragePrice = "get_storage_price",
  getStorageDeposit = "api_get_storage_deposit",
  getTotalDailyRealmStorageDeposit = "api_get_total_daily_realm_storage_deposit",
  getTotalDailyStorageDeposit = "api_get_total_daily_storage_deposit",

  // search
  getSearch = "api_get_search",
  getSearchAutocomplete = "api_get_search_autocomplete",

  // validator
  getValidators = "api_get_validators",
  getValidatorCommits = "api_get_validator_commits",
  getValidatorByAddress = "api_get_validator_by_address",
}
