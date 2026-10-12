import React from "react";

interface UseInfiniteScrollParams {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => unknown;
  // Starts loading this far before the sentinel scrolls into view
  rootMargin?: string;
}

/**
 * Loads the next page when the returned sentinel ref nears the viewport.
 * Attach the ref to an element placed after the list.
 */
export function useInfiniteScroll<T extends Element>({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = "400px",
}: UseInfiniteScrollParams) {
  const sentinelRef = React.useRef<T>(null);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isFetchingNextPage || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) fetchNextPage();
      },
      { rootMargin },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, rootMargin]);

  return sentinelRef;
}
