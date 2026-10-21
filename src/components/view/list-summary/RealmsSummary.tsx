import React from "react";

import { LIST_SUMMARY_REFETCH_INTERVAL } from "@/common/values/query.constant";
import { useNetwork } from "@/common/hooks/use-network";
import { useGetNewestRealms, useGetSummaryRealms } from "@/common/react-query/statistics";
import { formatNftRelativeTime } from "@/common/utils/nft-time.utility";
import { makeDisplayNumber, textEllipsis } from "@/common/utils/string-util";
import { stripGnoLandPrefix } from "@/common/utils/token.utility";
import { getAddressDisplayText } from "@/common/utils/address-label.utility";
import { SummaryCard, SummaryCount, SummaryGrid, SummaryItemList, SummaryValue } from "./ListSummary";

// Same name, label, address precedence as other address displays, with a long address shortened.
const publisherText = (address: string, name?: string, label?: string | null) => {
  const text = getAddressDisplayText({ address, name, label }) ?? "";
  return text === address ? textEllipsis(address) : text;
};

export const RealmsCount = () => {
  const { data, isFetched } = useGetSummaryRealms();
  return <SummaryCount total={data?.data.total} new24h={data?.data.new24h} isFetched={isFetched} unit="realms" />;
};

export const RealmsSummary = () => {
  const { getUrlWithNetwork } = useNetwork();
  const summary = useGetSummaryRealms();
  const newest = useGetNewestRealms({ refetchInterval: LIST_SUMMARY_REFETCH_INTERVAL });

  const recentItems = (newest.data?.items ?? []).slice(0, 3).map(realm => ({
    key: realm.path,
    href: getUrlWithNetwork(`/realms/details?path=${realm.path}`),
    title: stripGnoLandPrefix(realm.path),
    subtitle: publisherText(realm.publisher, realm.publisherName, realm.publisherLabel),
    // Deploy time once the API sends it, the deploy block until then.
    meta: realm.publishedAt ? formatNftRelativeTime(realm.publishedAt) : `#${makeDisplayNumber(realm.block)}`,
  }));

  const trendingItems = (summary.data?.data.trending ?? []).slice(0, 3).map((realm, index) => {
    const path = stripGnoLandPrefix(realm.path);
    return {
      key: realm.path,
      href: getUrlWithNetwork(`/realms/details?path=${realm.path}`),
      title: index === 0 ? path : `#${index + 1} ${path}`,
      subtitle: publisherText(realm.publisher, realm.publisherName),
      meta: `${makeDisplayNumber(realm.calls24h)} calls`,
    };
  });

  const stats = summary.data?.data;

  return (
    <SummaryGrid>
      <SummaryCard title="Recently Deployed" live>
        <SummaryItemList items={recentItems} isFetched={newest.isFetched} emptyText="No realms deployed yet" />
      </SummaryCard>
      <SummaryCard title="Trending Realm" caption="Most called in 24h">
        <SummaryItemList
          items={trendingItems}
          isFetched={summary.isFetched}
          emptyText="No realm calls in the last 24h"
        />
      </SummaryCard>
      <SummaryCard title="24h Calls" caption="Realm calls in the last 24h">
        <SummaryValue value={stats?.calls24h} isFetched={summary.isFetched} />
      </SummaryCard>
      <SummaryCard title="Active Callers (24h)" caption="Unique callers in the last 24h">
        <SummaryValue value={stats?.activeCallers24h} isFetched={summary.isFetched} />
      </SummaryCard>
    </SummaryGrid>
  );
};
