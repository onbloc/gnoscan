import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { useRealms } from "@/common/hooks/realms/use-realms";
import { useUsername } from "@/common/hooks/account/use-username";

import { RealmListTable } from "@/components/view/realms/realm-list-table/RealmListTable";

const RealmListContainer = () => {
  const { breakpoint } = useWindowSize();

  const [sortOption, setSortOption] = React.useState<{ field: string; order: string }>({
    field: "none",
    order: "none",
  });

  const { isFetched: isFetchedUsername, getName } = useUsername();
  const {
    realms,
    isFetched: isFetchedRealms,
    hasNextPage,
    nextPage: fetchNextPage,
    isDefault,
    defaultFromHeight,
  } = useRealms(true, sortOption);

  return (
    <RealmListTable
      breakpoint={breakpoint}
      sortOption={sortOption}
      setSortOption={setSortOption}
      realms={realms}
      isFetched={isFetchedUsername && isFetchedRealms}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isDefault={isDefault}
      defaultFromHeight={defaultFromHeight}
      getName={getName}
    />
  );
};

export default RealmListContainer;
