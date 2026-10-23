import React from "react";
import styled from "styled-components";
import { isStatisticsNotReady, StatisticsQuery } from "@/common/react-query/statistics/statistics-query-policy";
import Text from "@/components/ui/text";

interface StatisticsErrorNoticeProps {
  query: StatisticsQuery;
  // Centers the notice over the nearest positioned ancestor, like the chart loading spinner.
  centered?: boolean;
}

// Explains why a statistic is missing. Renders nothing unless the query failed without any data.
export const StatisticsErrorNotice = ({ query, centered = false }: StatisticsErrorNoticeProps) => {
  if (!query.isError) return null;

  const Container = centered ? CenteredNotice : Notice;

  return (
    <Container role="status">
      <Text type="p4" color="tertiary">
        {isStatisticsNotReady(query.error) ? "Statistics are not available yet." : "Statistics could not be loaded."}
      </Text>
    </Container>
  );
};

const Notice = styled.div`
  margin: 12px 0;
`;

const CenteredNotice = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;
