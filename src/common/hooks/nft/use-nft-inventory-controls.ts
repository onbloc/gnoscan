import React from "react";
import { UseInfiniteQueryResult } from "react-query";

import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
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
export function useNftInventoryControls(
  collectionIdentity: string,
  query: UseInfiniteQueryResult<GetNftCollectionItemsResponse, Error>,
) {
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
  const incomplete = !query.data || !!query.hasNextPage;
  const error = query.error ?? (failure?.identity === identity ? failure.error : null);
  const isResolving = needsAllPages && incomplete && !error;
  const { hasNextPage, isFetching, fetchNextPage } = query;

  React.useEffect(() => {
    if (!needsAllPages || !hasNextPage || isFetching || error || flight.current?.identity === identity) {
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
  }, [identity, needsAllPages, hasNextPage, isFetching, fetchNextPage, error, completion]);

  const loadedItems = React.useMemo(() => query.data?.pages.flatMap(page => page.items) ?? [], [query.data]);
  const owners = React.useMemo(
    () => (incomplete ? [] : Array.from(new Set(loadedItems.map(item => item.ownerAddress))).sort()),
    [loadedItems, incomplete],
  );
  const items = React.useMemo(() => {
    // Never show a filtered/sorted subset as though it were the whole collection.
    if (hasActiveControls && incomplete) return [];
    let visibleItems: NftCollectionItemModel[] = loadedItems;
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
  }, [loadedItems, hasActiveControls, incomplete, search, controls.owner, controls.sortOrder]);

  const toolbarProps: NftInventoryToolbarProps = {
    search: controls.search,
    owner: controls.owner,
    sortOrder: controls.sortOrder,
    owners,
    isLoadingOwners: controls.ownersRequested && incomplete && !error,
    ownerError: controls.ownersRequested && incomplete ? error : null,
    onSearchChange,
    onOwnerChange,
    onOwnerOpen,
    onSortToggle,
  };

  return { items, owners, toolbarProps, isResolving, error, hasActiveControls };
}
