import {useMemo} from 'react';
import {useGetBefore30DBlock} from '../common/use-get-before-30d-block';
import {useGetSimpleTransactions} from '../common/use-get-simple-transactions';

export const useMonthlyActiveBoards = () => {
  const {data: blockHeightOfBefor30d} = useGetBefore30DBlock();
  const {data, isFetched} = useGetSimpleTransactions(blockHeightOfBefor30d);

  const activeBoards = useMemo(() => {
    if (!data) {
      return [];
    }
    const boardInfoMap: {
      [key in string]: {
        replies: number;
        reposts: number;
        uniqueUsers: string[];
      };
    } = {};

    data?.forEach(tx => {
      const matchedMessage = tx.messages.find(message => {
        return message.value.func === 'gno.land/r/demo/boards';
      });

      if (matchedMessage) {
        const boardId = matchedMessage.value.args?.[0] || null;
        const account = matchedMessage.value.caller || null;

        if (!boardId || !account) {
          return;
        }

        const functionName = matchedMessage.value.func;

        const replies =
          (boardInfoMap[boardId]?.replies || 0) + (functionName === 'CreateRepost' ? 1 : 0);
        const reposts =
          (boardInfoMap[boardId]?.reposts || 0) + (functionName === 'CreateReply' ? 1 : 0);
        const previousUsers = boardInfoMap[boardId]?.uniqueUsers || [];
        boardInfoMap[boardId] = {
          replies,
          reposts,
          uniqueUsers: previousUsers.includes(account)
            ? previousUsers
            : [...previousUsers, account],
        };
      }
    });

    return Object.entries(boardInfoMap)
      .map(entry => ({
        boardId: entry[0],
        replies: entry[1].replies,
        reposts: entry[1].reposts,
        uniqueUsers: entry[1].uniqueUsers.length,
      }))
      .sort((t1, t2) => t2.uniqueUsers - t1.uniqueUsers)
      .filter((_, index) => index < 10);
  }, [data]);

  return {
    isFetched,
    data: activeBoards,
  };
};
