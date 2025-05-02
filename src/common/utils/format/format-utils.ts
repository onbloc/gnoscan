export const safeString = (value: string | number | null | undefined): string => {
  if (value == null) return "";
  return String(value);
};
