import { useEffect } from "react";

import { CsvCell } from "@/common/utils/csv.utility";

/** The page of a list on screen, as the CSV its download button writes. */
export interface ListCsv {
  // File name prefix; the page number follows it.
  name: string;
  header: string[];
  rows: CsvCell[][];
  page: number;
  // False while the rows are those of the previous page, which are not the `page` yet.
  isSettled: boolean;
}

/**
 * Hands the CSV of the page on screen to `onChange`, so a button outside the list (the title line) can download it.
 * Hands over null once the list unmounts.
 */
export const usePublishListCsv = (csv: ListCsv, onChange?: (csv: ListCsv | null) => void) => {
  useEffect(() => {
    onChange?.(csv);
  }, [csv, onChange]);

  useEffect(() => () => onChange?.(null), [onChange]);
};
