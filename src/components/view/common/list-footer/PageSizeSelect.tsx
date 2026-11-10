import React, { useRef, useState } from "react";

import IconChevron from "@/assets/svgs/icon-chevron.svg";
import useOutSideClick from "@/common/hooks/use-outside-click";
import { useMenuKeyboard } from "@/common/hooks/use-menu-keyboard";
import { LIST_PAGE_SIZES, ListPageSize } from "@/common/values/list-page-size.constant";
import * as S from "./ListFooter.styles";

interface PageSizeSelectProps {
  pageSize: ListPageSize;
  onChange: (pageSize: ListPageSize) => void;
}

/** "Show 50" dropdown of the rows per page; its menu opens upward, as it sits at the bottom of a list. */
export const PageSizeSelect = ({ pageSize, onChange }: PageSizeSelectProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useOutSideClick<HTMLDivElement>(() => setOpen(false));
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const { onKeyDown, onBlur } = useMenuKeyboard({ open, setOpen, triggerRef, menuRef });

  return (
    <S.SizeArea ref={wrapperRef} onKeyDown={onKeyDown} onBlur={onBlur}>
      <S.SizeLabel>Show:</S.SizeLabel>
      <S.SizeSelect>
        <S.SizeTrigger
          ref={triggerRef}
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`Rows per page, ${pageSize}`}
          onClick={() => setOpen(current => !current)}
        >
          {pageSize}
          <S.SizeChevron $open={open}>
            <IconChevron aria-hidden="true" />
          </S.SizeChevron>
        </S.SizeTrigger>
        {open && (
          <S.SizeMenu ref={menuRef} role="menu" aria-label="Rows per page">
            {LIST_PAGE_SIZES.map(size => (
              <li key={size} role="none">
                <S.SizeOption
                  type="button"
                  role="menuitemradio"
                  aria-checked={size === pageSize}
                  data-menu-item
                  $selected={size === pageSize}
                  onClick={() => {
                    setOpen(false);
                    if (size !== pageSize) onChange(size);
                  }}
                >
                  {size}
                </S.SizeOption>
              </li>
            ))}
          </S.SizeMenu>
        )}
      </S.SizeSelect>
    </S.SizeArea>
  );
};
