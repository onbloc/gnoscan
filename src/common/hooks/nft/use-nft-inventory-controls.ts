import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useGetNftCollectionItems, useGetNftCollectionItemsInfinite } from "@/common/react-query/token/api";
import { getAddressDisplayText } from "@/common/utils/address-label.utility";
import { remapNftInventoryPage } from "@/common/utils/nft-inventory.utility";
import { ADDRESS_LABEL_TYPE } from "@/common/values/address-label.constant";
import { GetNftCollectionItemsResponse, NftCollectionItemModel } from "@/repositories/api/token/response";

export type NftInventorySortOrder = "asc" | "desc" | null;

export interface NftInventoryToolbarProps {
  search: string;
  ownerSuggestions: readonly { address: string; label: string }[];
  owner: string;
  sortOrder: NftInventorySortOrder;
  owners: readonly { address: string; label: string }[];
  isLoadingOwners: boolean;
  ownerError: Error | null;
  onSearchChange: (search: string) => void;
  onOwnerChange: (owner: string) => void;
  onOwnerOpen: () => void;
  onSortToggle: () => void;
}

interface InventoryControlState {
  identity: string;
  search: string;
  owner: string;
  sortOrder: NftInventorySortOrder;
  ownersRequested: boolean;
}

interface InventoryPagination {
  scope: string;
  page: number;
  pageSize: number;
  anchorIndex?: number;
}

const initialControls = (identity: string): InventoryControlState => ({
  identity,
  search: "",
  owner: "",
  sortOrder: null,
  ownersRequested: false,
});

const OWNER_SUGGESTION_LIMIT = 5;

// Owners are searchable by address and by the label shown in the grid (realm path without its gno.land/ prefix).
function matchesOwnerSearch(item: NftCollectionItemModel, search: string): boolean {
  const { ownerAddress, ownerLabel } = item;
  return (
    ownerAddress.toLowerCase().includes(search) ||
    !!ownerLabel?.toLowerCase().includes(search) ||
    !!getAddressDisplayText({ address: ownerAddress, label: ownerLabel })?.toLowerCase().includes(search)
  );
}

const tokenIdCollator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

// Compare decimal IDs without converting them to Number (or losing large-ID precision).
export function compareNftTokenIds(left: string, right: string): number {
  if (/^\d+$/.test(left) && /^\d+$/.test(right)) {
    const leftDigits = left.replace(/^0+/, "") || "0";
    const rightDigits = right.replace(/^0+/, "") || "0";
    if (leftDigits.length !== rightDigits.length) return leftDigits.length - rightDigits.length;
    return leftDigits === rightDigits ? 0 : leftDigits < rightDigits ? -1 : 1;
  }
  return tokenIdCollator.compare(left, right);
}

/**
 * Keep the default view lazy. Search, owner selection, sorting, or opening the owner
 * picker resolves every remaining page before exposing global results/options.
 * A linked NFT outside the visible page resolves only enough pages to locate its row.
 * Changing sort starts at the first result page without closing the selected NFT detail.
 * Sorted/filtered detail navigation follows the full result and moves the display page with the selection.
 * collectionIdentity should be the tokenKey used by the collection-items query.
 */
export function useNftInventoryControls(collectionIdentity: string, pageSize: number, selectedNftId: string | null) {
  const { currentNetwork } = useNetworkProvider();
  const identity = JSON.stringify([currentNetwork?.chainId ?? "", collectionIdentity]);
  const [savedControls, setControls] = React.useState(() => initialControls(identity));
  if (savedControls.identity !== identity) setControls(initialControls(identity));
  const controls = savedControls.identity === identity ? savedControls : initialControls(identity);
  const [completion, setCompletion] = React.useState(0);
  const flight = React.useRef<{ identity: string } | null>(null);
  const mounted = React.useRef(false);
  const currentIdentity = React.useRef(identity);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  React.useEffect(() => {
    currentIdentity.current = identity;
  }, [identity]);

  const updateControls = React.useCallback(
    (update: Partial<Omit<InventoryControlState, "identity">>) => {
      setControls(previous => ({
        ...(previous.identity === identity ? previous : initialControls(identity)),
        ...update,
      }));
    },
    [identity],
  );
  const onSearchChange = React.useCallback((search: string) => updateControls({ search }), [updateControls]);
  const onOwnerChange = React.useCallback((owner: string) => updateControls({ owner }), [updateControls]);
  const onOwnerOpen = React.useCallback(() => updateControls({ ownersRequested: true }), [updateControls]);
  const onSortToggle = React.useCallback(() => {
    setControls(previous => {
      const current = previous.identity === identity ? previous : initialControls(identity);
      return { ...current, sortOrder: current.sortOrder === "asc" ? "desc" : "asc" };
    });
  }, [identity]);

  const search = controls.search.trim().toLowerCase();
  const hasActiveControls = !!search || !!controls.owner || controls.sortOrder !== null;
  const needsAllPages = hasActiveControls || controls.ownersRequested;
  const pageScope = JSON.stringify([identity, search, controls.owner, controls.sortOrder]);
  const [pagination, setPagination] = React.useState<InventoryPagination>(() => ({
    scope: pageScope,
    page: 1,
    pageSize,
  }));
  const currentPagination =
    pagination.scope !== pageScope
      ? { scope: pageScope, page: 1, pageSize }
      : pagination.pageSize !== pageSize
      ? {
          ...pagination,
          pageSize,
          page: remapNftInventoryPage(pagination.page, pagination.pageSize, pageSize, pagination.anchorIndex),
        }
      : pagination;
  if (currentPagination !== pagination) setPagination(currentPagination);
  const page = currentPagination.page;
  const firstPageQuery = useGetNftCollectionItems(
    { tokenKey: collectionIdentity, limit: pageSize, page: 1 },
    { enabled: !hasActiveControls },
  );
  const pageQuery = useGetNftCollectionItems(
    { tokenKey: collectionIdentity, limit: pageSize, page },
    { enabled: !hasActiveControls },
  );
  // Keep the displayed page/count during a 20/22-card layout fetch, never across collections or filters.
  const [previousPage, setPreviousPage] = React.useState<{
    scope: string;
    page: number;
    pageSize: number;
    data: GetNftCollectionItemsResponse;
  } | null>(null);
  if (pageQuery.data && (previousPage?.scope !== pageScope || previousPage.data !== pageQuery.data)) {
    setPreviousPage({ scope: pageScope, page, pageSize, data: pageQuery.data });
  }
  const isResizing = pageQuery.isLoading && previousPage?.scope === pageScope && previousPage.pageSize !== pageSize;
  const pageData = pageQuery.data ?? (isResizing ? previousPage?.data : undefined);
  const selectionScope = JSON.stringify([identity, selectedNftId]);
  const [resolvedSelection, setResolvedSelection] = React.useState<string | null>(null);
  if (!selectedNftId && resolvedSelection !== null) setResolvedSelection(null);
  const selectionOnPage = !!selectedNftId && !!pageData?.items.some(item => item.nftId === selectedNftId);
  const locatingSelection =
    !!selectedNftId && !hasActiveControls && resolvedSelection !== selectionScope && !!pageData && !selectionOnPage;
  const [previousCount, setPreviousCount] = React.useState<{ identity: string; count: number } | null>(null);
  const firstPageCount = firstPageQuery.data?.page.totalCount;
  if (
    firstPageCount !== undefined &&
    (previousCount?.identity !== identity || previousCount.count !== firstPageCount)
  ) {
    setPreviousCount({ identity, count: firstPageCount });
  }
  const query = useGetNftCollectionItemsInfinite(
    // Keep complete search/filter data cached across 20/22-card display modes.
    { tokenKey: collectionIdentity, limit: 20 },
    { enabled: needsAllPages || locatingSelection },
  );
  const incomplete = !query.data || !!query.hasNextPage;
  const allItems = React.useMemo(() => query.data?.pages.flatMap(page => page.items) ?? [], [query.data]);
  const linkedIndex = selectedNftId ? allItems.findIndex(item => item.nftId === selectedNftId) : -1;
  const needsMorePages = needsAllPages || (locatingSelection && linkedIndex < 0);
  // Adjust selection and pagination together before painting a different inventory page.
  if (selectedNftId && !hasActiveControls && resolvedSelection !== selectionScope) {
    if (selectionOnPage) {
      setResolvedSelection(selectionScope);
    } else if (locatingSelection && linkedIndex >= 0) {
      setResolvedSelection(selectionScope);
      setPagination({
        scope: pageScope,
        page: Math.floor(linkedIndex / pageSize) + 1,
        pageSize,
        anchorIndex: linkedIndex,
      });
    } else if (locatingSelection && !incomplete) {
      // An absent ID must not repeatedly scan the collection or select a different NFT.
      setResolvedSelection(selectionScope);
    }
  }
  // Query errors clear on successful refetch; a separate saved failure would keep recovery blocked.
  const globalError = query.error;
  const error = hasActiveControls || locatingSelection ? globalError : pageQuery.error;
  const isResolving = ((hasActiveControls && incomplete) || locatingSelection) && !globalError;
  const { hasNextPage, isFetching, fetchNextPage } = query;

  React.useEffect(() => {
    if (!needsMorePages || !hasNextPage || isFetching || globalError || flight.current?.identity === identity) {
      return;
    }

    const request = { identity };
    flight.current = request;
    // One page at a time; the next effect waits for this request to finish.
    void fetchNextPage({ cancelRefetch: false, throwOnError: false }).finally(() => {
      if (flight.current !== request) return;
      flight.current = null;
      if (mounted.current && currentIdentity.current === identity) {
        setCompletion(previous => previous + 1);
      }
    });
  }, [identity, needsMorePages, hasNextPage, isFetching, fetchNextPage, globalError, completion]);

  // Keep the located owner available while the corresponding display page is loading.
  const loadedItems = hasActiveControls || (!selectionOnPage && linkedIndex >= 0) ? allItems : pageData?.items ?? [];
  const owners = React.useMemo(() => {
    if (incomplete) return [];
    const itemsByOwner = new Map<string, NftCollectionItemModel>();
    for (const item of allItems) {
      if (!itemsByOwner.has(item.ownerAddress)) itemsByOwner.set(item.ownerAddress, item);
    }
    return Array.from(itemsByOwner.keys())
      .sort((left, right) => {
        const leftItem = itemsByOwner.get(left);
        const rightItem = itemsByOwner.get(right);
        const leftIsRealm = leftItem?.ownerLabelType === ADDRESS_LABEL_TYPE.REALM && !!leftItem.ownerLabel;
        const rightIsRealm = rightItem?.ownerLabelType === ADDRESS_LABEL_TYPE.REALM && !!rightItem.ownerLabel;
        if (leftIsRealm !== rightIsRealm) return leftIsRealm ? -1 : 1;
        return left < right ? -1 : left > right ? 1 : 0;
      })
      .map(address => ({
        address,
        label: getAddressDisplayText({ address, label: itemsByOwner.get(address)?.ownerLabel }) ?? address,
      }));
  }, [allItems, incomplete]);
  // Matching owners for the search box, like the global search suggestions.
  const ownerSuggestions = React.useMemo(() => {
    if (!search || incomplete) return [];
    const matched = new Set<string>();
    for (const item of allItems) {
      if (matchesOwnerSearch(item, search)) matched.add(item.ownerAddress);
    }
    return owners.filter(({ address }) => matched.has(address)).slice(0, OWNER_SUGGESTION_LIMIT);
  }, [allItems, incomplete, owners, search]);
  const filteredItems = React.useMemo(() => {
    // Never show a filtered/sorted subset as though it were the whole collection.
    if (hasActiveControls && incomplete) return [];
    let visibleItems: NftCollectionItemModel[] = allItems;
    if (search || controls.owner) {
      visibleItems = visibleItems.filter(
        item =>
          (!controls.owner || item.ownerAddress === controls.owner) &&
          (!search ||
            item.nftId.toLowerCase().includes(search) ||
            item.tokenId.toLowerCase().includes(search) ||
            matchesOwnerSearch(item, search)),
      );
    }
    if (controls.sortOrder) {
      const direction = controls.sortOrder === "asc" ? 1 : -1;
      visibleItems = [...visibleItems].sort((left, right) => direction * compareNftTokenIds(left.nftId, right.nftId));
    }
    return visibleItems;
  }, [allItems, hasActiveControls, incomplete, search, controls.owner, controls.sortOrder]);

  const totalCount = hasActiveControls
    ? filteredItems.length
    : firstPageCount ?? (previousCount?.identity === identity ? previousCount.count : 0);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const items = React.useMemo(
    () => (hasActiveControls ? filteredItems.slice((page - 1) * pageSize, page * pageSize) : pageData?.items ?? []),
    [hasActiveControls, filteredItems, page, pageSize, pageData],
  );
  const navigationItems = hasActiveControls ? filteredItems : items;
  const selectedIndex = selectedNftId ? navigationItems.findIndex(item => item.nftId === selectedNftId) : -1;
  const previousNftId = selectedIndex > 0 ? navigationItems[selectedIndex - 1].nftId : null;
  const nextNftId =
    selectedIndex >= 0 && selectedIndex < navigationItems.length - 1 ? navigationItems[selectedIndex + 1].nftId : null;
  const onChangePage = (nextPage: number) => {
    setPagination({
      scope: pageScope,
      page: Math.min(Math.max(nextPage, 1), totalPages),
      pageSize,
      anchorIndex: undefined,
    });
  };
  const onSelectItem = (nftId: string) => {
    const index = navigationItems.findIndex(item => item.nftId === nftId);
    if (index < 0) return;
    if (hasActiveControls) {
      setPagination({
        scope: pageScope,
        page: Math.floor(index / pageSize) + 1,
        pageSize,
        anchorIndex: index,
      });
      return;
    }
    const anchorIndex =
      isResizing && previousPage
        ? (previousPage.page - 1) * previousPage.pageSize + index
        : (page - 1) * pageSize + index;
    setPagination(previous => ({
      ...previous,
      anchorIndex,
      page:
        isResizing && previousPage
          ? remapNftInventoryPage(previousPage.page, previousPage.pageSize, pageSize, anchorIndex)
          : previous.page,
    }));
  };

  const toolbarProps: NftInventoryToolbarProps = {
    search: controls.search,
    ownerSuggestions,
    owner: controls.owner,
    sortOrder: controls.sortOrder,
    owners,
    isLoadingOwners: controls.ownersRequested && incomplete && !globalError,
    ownerError: controls.ownersRequested && incomplete ? globalError : null,
    onSearchChange,
    onOwnerChange,
    onOwnerOpen,
    onSortToggle,
  };

  return {
    items,
    loadedItems,
    toolbarProps,
    isResolving,
    error,
    isFetched: hasActiveControls ? query.isFetched : pageQuery.isFetched || !!pageData,
    page,
    totalPages,
    onChangePage,
    onSelectItem,
    previousNftId,
    nextNftId,
    hasNext: hasActiveControls ? page < totalPages : pageData?.page.hasNext,
  };
}
