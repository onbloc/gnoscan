import React from "react";

import { ListPageSize } from "@/common/values/list-page-size.constant";
import { ListPagination, ListPaginationProps } from "../list-pagination/ListPagination";
import { PageSizeSelect } from "./PageSizeSelect";
import * as S from "./ListFooter.styles";

interface ListFooterProps extends Omit<ListPaginationProps, "pageSize"> {
  pageSize: ListPageSize;
  onChangePageSize: (pageSize: ListPageSize) => void;
}

/** Footer of a paged list: the rows per page, and the pagination. */
export const ListFooter = ({ onChangePageSize, ...pagination }: ListFooterProps) => (
  <S.Footer>
    <PageSizeSelect pageSize={pagination.pageSize} onChange={onChangePageSize} />

    <S.PageArea>
      <ListPagination {...pagination} />
    </S.PageArea>
  </S.Footer>
);
