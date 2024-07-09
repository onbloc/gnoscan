import {useMemo} from 'react';
import {useGetBefore30DBlock} from '../common/use-get-before-30d-block';
import {useGetSimpleTransactions} from '../common/use-get-simple-transactions';

export const useMonthlyActiveAccounts = () => {
  const {data: blockHeightOfBefor30d} = useGetBefore30DBlock();
  const {data, isFetched} = useGetSimpleTransactions(blockHeightOfBefor30d);

  const activeUsers = useMemo(() => {
    if (!data) {
      return [];
    }
    const accountTransactionMap: {
      [key in string]: {
        totalTxs: number;
        nonTransferTxs: number;
      };
    } = {};

    data?.forEach(tx => {
      const matchedMessage = tx.messages.find(message => {
        const account =
          message.value.caller || message.value.creator || message.value.from_address || null;
        return !!account;
      });

      if (matchedMessage) {
        const account =
          matchedMessage.value.caller ||
          matchedMessage.value.creator ||
          matchedMessage.value.from_address ||
          '';
        const isTransfer = !!matchedMessage.value.from_address;

        accountTransactionMap[account] = {
          totalTxs: (accountTransactionMap?.[account]?.totalTxs || 0) + 1,
          nonTransferTxs:
            (accountTransactionMap?.[account]?.nonTransferTxs || 0) + (isTransfer ? 0 : 1),
        };
      }
    });

    return Object.entries(accountTransactionMap)
      .map(entry => ({
        account: entry[0],
        totalTxs: entry[1].totalTxs,
        nonTransferTxs: entry[1].nonTransferTxs,
      }))
      .sort((t1, t2) => t2.totalTxs - t1.totalTxs)
      .filter((_, index) => index < 10);
  }, [data]);

  return {
    isFetched,
    data: activeUsers,
  };
};
