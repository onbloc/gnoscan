import React from "react";
import { UseQueryResult } from "react-query";
import styled from "styled-components";
import { isStatisticsNotReady } from "@/common/react-query/statistics/statistics-query-policy";
import { Button } from "@/components/ui/button";
import Text from "@/components/ui/text";

type StatisticsQueryStateProps = React.PropsWithChildren<{
  query: Pick<UseQueryResult, "data" | "error" | "isError" | "isFetching" | "refetch">;
}>;

export const StatisticsQueryState = ({ query, children }: StatisticsQueryStateProps) => {
  if (!query.isError) return <>{children}</>;

  const hasData = query.data !== undefined;
  const message = hasData
    ? "Refresh failed. Showing previously loaded data."
    : isStatisticsNotReady(query.error)
    ? "Statistics are not available yet."
    : "Unable to load statistics.";

  return (
    <>
      <Notice role="status">
        <Text type="p4" color="tertiary">
          {message}
        </Text>
        <RetryButton onClick={() => query.refetch()} disabled={query.isFetching} bgColor="surface">
          {query.isFetching ? "Retrying…" : "Retry"}
        </RetryButton>
      </Notice>
      {hasData ? children : null}
    </>
  );
};

const Notice = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
`;

const RetryButton = styled(Button)`
  padding: 6px 12px;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.dimmed50};

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
`;
