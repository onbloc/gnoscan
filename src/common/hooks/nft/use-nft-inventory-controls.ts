import React from "react";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useGetNftCollectionItems, useGetNftCollectionItemsInfinite } from "@/common/react-query/token/api";
import { remapNftInventoryPage } from "@/common/utils/nft-inventory.utility";
import { GetNftCollectionItemsResponse, NftCollectionItemModel } from "@/repositories/api/token/response";

export type NftInventorySortOrder = "asc" | "desc" | null;

export interface NftInventoryToolbarProps {
  search: string;
  owner: string;
  sortOrder: NftInventorySortOrder;
  owners: readonly string[];
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
 * collectionIdentity should be the tokenKey used by the collection-items query.
 */
export function useNftInventoryControls(collectionIdentity: string, pageSize: number) {
  const { currentNetwork } = useNetworkProvider();
  const identity = JSON.stringify([currentNetwork?.chainId ?? "", collectionIdentity]);
  const [savedControls, setControls] = React.useState(() => initialControls(identity));
  if (savedControls.identity !== identity) setControls(initialControls(identity));
  const controls = savedControls.identity === identity ? savedControls : initialControls(identity);
  const [failure, setFailure] = React.useState<{ identity: string; error: Error } | null>(null);
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
    { enabled: needsAllPages },
  );
  const incomplete = !query.data || !!query.hasNextPage;
  const globalError = query.error ?? (failure?.identity === identity ? failure.error : null);
  const error = hasActiveControls ? globalError : pageQuery.error;
  const isResolving = hasActiveControls && incomplete && !globalError;
  const { hasNextPage, isFetching, fetchNextPage } = query;

  React.useEffect(() => {
    if (!needsAllPages || !hasNextPage || isFetching || globalError || flight.current?.identity === identity) {
      return;
    }

    const request = { identity };
    flight.current = request;
    const recordError = (cause: unknown) => {
      if (!mounted.current || currentIdentity.current !== identity) return;
      setFailure({ identity, error: cause instanceof Error ? cause : new Error(String(cause)) });
    };
    // One page at a time; the next effect waits for this request to finish.
    void fetchNextPage({ cancelRefetch: false })
      .then(result => {
        if (result.isError && result.error) recordError(result.error);
      })
      .catch(recordError)
      .finally(() => {
        if (flight.current !== request) return;
        flight.current = null;
        if (mounted.current && currentIdentity.current === identity) {
          setCompletion(previous => previous + 1);
        }
      });
  }, [identity, needsAllPages, hasNextPage, isFetching, fetchNextPage, globalError, completion]);

  const allItems = React.useMemo(() => query.data?.pages.flatMap(page => page.items) ?? [], [query.data]);
  const loadedItems = hasActiveControls ? allItems : pageData?.items ?? [];
  const owners = React.useMemo(
    () => (incomplete ? [] : Array.from(new Set(allItems.map(item => item.ownerAddress))).sort()),
    [allItems, incomplete],
  );
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
            item.ownerAddress.toLowerCase().includes(search)),
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
  const onChangePage = (nextPage: number) => {
    setPagination({
      scope: pageScope,
      page: Math.min(Math.max(nextPage, 1), totalPages),
      pageSize,
      anchorIndex: undefined,
    });
  };
  const onSelectItem = (nftId: string) => {
    const index = items.findIndex(item => item.nftId === nftId);
    if (index < 0) return;
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
    hasNext: hasActiveControls ? page < totalPages : pageData?.page.hasNext,
  };
}
