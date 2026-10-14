import React from "react";

import IconSearch from "@/assets/svgs/icon-nft-search.svg";
import { NftInventoryToolbarProps } from "@/common/hooks/nft/use-nft-inventory-controls";
import useOutSideClick from "@/common/hooks/use-outside-click";

import * as S from "./NftInventoryToolbar.styles";

const NftInventoryToolbar = ({
  search,
  owner,
  sortOrder,
  owners,
  isLoadingOwners,
  ownerError,
  onSearchChange,
  onOwnerChange,
  onOwnerOpen,
  onSortToggle,
}: NftInventoryToolbarProps) => {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [menuWidth, setMenuWidth] = React.useState(440);
  // OwnerControl always renders a div; the shared hook exposes the broader HTMLElement ref.
  const controlRef = useOutSideClick(() => setOpen(false)) as React.RefObject<HTMLDivElement>;
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const menuId = React.useId();
  const options = [{ address: "", label: "All" }, ...owners];
  const ownerLabel = owners.find(option => option.address === owner)?.label || owner;

  const openMenu = () => {
    setActiveIndex(
      Math.max(
        0,
        options.findIndex(option => option.address === owner),
      ),
    );
    setOpen(true);
    onOwnerOpen();
  };
  const closeMenu = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };
  const selectOwner = (address: string) => {
    onOwnerChange(address);
    closeMenu();
  };

  React.useEffect(() => {
    if (open) menuRef.current?.focus({ preventScroll: true });
    if (!open) return;
    const updateWidth = () => {
      const left = buttonRef.current?.getBoundingClientRect().left ?? 0;
      setMenuWidth(Math.max(0, window.innerWidth - left - 16));
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const option = menu?.querySelector<HTMLElement>(`[data-owner-index="${activeIndex}"]`);
    if (!menu || !option) return;
    // Scroll only the list, never its ancestors or the document.
    const top = option.offsetTop - menu.clientTop;
    const bottom = top + option.offsetHeight;
    if (top < menu.scrollTop) menu.scrollTop = top;
    else if (bottom > menu.scrollTop + menu.clientHeight) menu.scrollTop = bottom - menu.clientHeight;
  }, [open, activeIndex, menuWidth]);

  return (
    <S.Toolbar role="search" aria-label="NFT inventory controls">
      <S.SearchBox>
        <input
          type="search"
          aria-label="Search by Token ID or Owner’s Address"
          placeholder="Search by Token ID or Owner’s Address"
          value={search}
          onChange={event => onSearchChange(event.target.value)}
        />
        <IconSearch aria-hidden="true" />
      </S.SearchBox>
      <S.FilterButtons>
        <S.OwnerControl
          ref={controlRef}
          aria-busy={isLoadingOwners}
          onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
          }}
        >
          <S.OwnerButton
            ref={buttonRef}
            type="button"
            aria-label="Filter by owner"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={open ? menuId : undefined}
            title={ownerLabel || "All owners"}
            onClick={() => (open ? closeMenu() : openMenu())}
            onKeyDown={event => {
              if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                openMenu();
              }
            }}
          >
            {ownerLabel || "Owner: All"}
          </S.OwnerButton>
          {open && (
            <S.OwnerMenu
              ref={menuRef}
              style={{ maxWidth: menuWidth }}
              id={menuId}
              role="listbox"
              aria-label="Owners"
              aria-activedescendant={`${menuId}-${activeIndex}`}
              tabIndex={-1}
              onKeyDown={event => {
                switch (event.key) {
                  case "ArrowDown":
                  case "ArrowUp":
                    event.preventDefault();
                    setActiveIndex(index =>
                      Math.max(0, Math.min(options.length - 1, index + (event.key === "ArrowDown" ? 1 : -1))),
                    );
                    break;
                  case "Home":
                  case "End":
                    event.preventDefault();
                    setActiveIndex(event.key === "Home" ? 0 : options.length - 1);
                    break;
                  case "Enter":
                  case " ":
                    event.preventDefault();
                    selectOwner(options[activeIndex]?.address ?? "");
                    break;
                  case "Escape":
                    event.preventDefault();
                    event.stopPropagation();
                    closeMenu();
                    break;
                }
              }}
            >
              {options.map(({ address, label }, index) => (
                <S.OwnerOption
                  key={address}
                  id={`${menuId}-${index}`}
                  role="option"
                  aria-selected={owner === address}
                  data-owner-index={index}
                  $active={activeIndex === index}
                  onClick={() => selectOwner(address)}
                >
                  {label}
                </S.OwnerOption>
              ))}
              {isLoadingOwners && <S.Status role="status">Loading owners…</S.Status>}
              {ownerError && <S.Status role="alert">Could not load owners</S.Status>}
            </S.OwnerMenu>
          )}
        </S.OwnerControl>
        <S.SortButton
          type="button"
          aria-label={`Sort Token ID ${sortOrder === "asc" ? "descending" : "ascending"}`}
          aria-pressed={sortOrder !== null}
          onClick={onSortToggle}
        >
          Token ID <span aria-hidden="true">{sortOrder === "asc" ? "↑" : "↓"}</span>
        </S.SortButton>
      </S.FilterButtons>
      {isLoadingOwners && <S.Status role="status">Loading all collection owners…</S.Status>}
      {ownerError && <S.Status role="alert">Could not load all owners: {ownerError.message}</S.Status>}
    </S.Toolbar>
  );
};

export default NftInventoryToolbar;
