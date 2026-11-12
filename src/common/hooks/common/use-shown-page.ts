import { useState } from "react";

/**
 * Page of the rows on screen. `page` moves at once, but the rows of the previous page stay until the next one loads,
 * so anything numbered by page (rank, message number) must use this instead of `page`.
 */
export const useShownPage = (page: number, isPreviousData: boolean) => {
  const [shown, setShown] = useState(page);
  if (!isPreviousData && shown !== page) setShown(page);

  return isPreviousData ? shown : page;
};
