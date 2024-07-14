import {useMemo} from 'react';
import {useGetBefore30DBlock} from '../common/use-get-before-30d-block';
import {useGetSimpleTransactions} from '../common/use-get-simple-transactions';
import {useGetBoard} from '../common/use-get-board';

export const useMonthlyActiveBoards = () => {
  const {data: boards, isFetched: isFetchedBoards} = useGetBoard();
  const {data: blockHeightOfBefor30d} = useGetBefore30DBlock();
  const {data, isFetched} = useGetSimpleTransactions(blockHeightOfBefor30d);

  const activeBoards = useMemo(() => {
    if (!data || !boards) {
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
        return message.value.pkg_path === 'gno.land/r/demo/boards';
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

    const activeBoards = Object.entries(boardInfoMap)
      .map(entry => ({
        boardId: boards.find(board => `${board.index}` === `${entry[0]}`)?.name || entry[0],
        replies: entry[1].replies,
        reposts: entry[1].reposts,
        uniqueUsers: entry[1].uniqueUsers.length,
      }))
      .sort((t1, t2) => t2.uniqueUsers - t1.uniqueUsers)
      .filter((_, index) => index < 10);

    const defaultBoards =
      boards
        ?.filter(board => !activeBoards.some(activeBoard => activeBoard.boardId === board.name))
        .filter((_, index) => activeBoards.length + index < 10)
        .map(board => ({
          boardId: board.name,
          replies: 0,
          reposts: 0,
          uniqueUsers: 0,
        })) || [];

    return [...activeBoards, ...defaultBoards];
  }, [boards, data]);

  return {
    isFetched: isFetched && isFetchedBoards,
    data: activeBoards,
  };
};
