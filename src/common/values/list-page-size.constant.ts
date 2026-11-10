/** Rows per page a list offers; the list APIs accept up to 100. */
export const LIST_PAGE_SIZES = [10, 25, 50, 100] as const;

export type ListPageSize = (typeof LIST_PAGE_SIZES)[number];

export const DEFAULT_LIST_PAGE_SIZE: ListPageSize = 50;
