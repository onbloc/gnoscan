import React from "react";

import IconDownload from "@/assets/svgs/icon-download.svg";
import { ListCsv } from "@/common/hooks/common/use-publish-list-csv";
import { downloadCsv, toCsv } from "@/common/utils/csv.utility";
import * as S from "./ListCsvButton.styles";

interface ListCsvButtonProps {
  // The page on screen; null until the list reports it.
  csv: ListCsv | null;
}

/** Button that downloads the rows of the list page on screen as a CSV file. */
export const ListCsvButton = ({ csv }: ListCsvButtonProps) => {
  const canDownload = csv !== null && csv.isSettled && csv.rows.length > 0;

  return (
    <S.CsvButton
      type="button"
      disabled={!canDownload}
      onClick={() => csv && downloadCsv(`${csv.name}_page-${csv.page}.csv`, toCsv(csv.header, csv.rows))}
    >
      <IconDownload aria-hidden="true" />
      Download CSV
    </S.CsvButton>
  );
};
