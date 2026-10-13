import React from "react";

import IconSearch from "@/assets/svgs/icon-nft-search.svg";
import { NftInventoryToolbarProps } from "@/common/hooks/nft/use-nft-inventory-controls";

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
}: NftInventoryToolbarProps) => (
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
      <S.OwnerControl aria-busy={isLoadingOwners}>
        <S.OwnerSelect
          aria-label="Filter by owner"
          title={owner || "All owners"}
          value={owner}
          onFocus={onOwnerOpen}
          onPointerDown={onOwnerOpen}
          onChange={event => onOwnerChange(event.target.value)}
        >
          <option value="">Owner: All</option>
          {isLoadingOwners && <option disabled>Loading owners…</option>}
          {ownerError && <option disabled>Could not load owners</option>}
          {owners.map(address => (
            <option key={address} value={address}>
              Owner: {address}
            </option>
          ))}
        </S.OwnerSelect>
        <span aria-hidden="true">▾</span>
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

export default NftInventoryToolbar;
