export type CsvCell = string | number | boolean | null | undefined;

// A spreadsheet runs a cell that starts with one of these as a formula.
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

const escapeCell = (cell: CsvCell): string => {
  if (cell === null || cell === undefined) return "";
  // Only text can be a formula; a number is written as is.
  const text = typeof cell === "string" && FORMULA_PREFIX.test(cell) ? `'${cell}` : String(cell);

  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/** Builds RFC 4180 CSV text (CRLF rows). Text starting with a formula character is prefixed with `'`. */
export const toCsv = (header: string[], rows: CsvCell[][]): string =>
  [header, ...rows].map(row => row.map(escapeCell).join(",")).join("\r\n") + "\r\n";

// Lets Excel read the file as UTF-8.
const UTF8_BOM = "\uFEFF";

/** Saves CSV text as a file through the browser. */
export const downloadCsv = (filename: string, csv: string) => {
  const url = URL.createObjectURL(new Blob([UTF8_BOM, csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
