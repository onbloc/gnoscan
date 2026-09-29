import React from "react";
import styled from "styled-components";

import Text from "@/components/ui/text";

interface Props {
  eventType: string;
  onEventTypeChange: (value: string) => void;
  includeStorage: boolean;
  onIncludeStorageChange: (value: boolean) => void;
}

/**
 * Events tab filter controls: a free-text Event Type filter plus an explicit
 * "Show storage events" opt-in - StorageDeposit/StorageUnlock stay hidden until
 * the caller turns this on (backend default includeStorage=false).
 */
export const ActivityEventsFilterBar = ({
  eventType,
  onEventTypeChange,
  includeStorage,
  onIncludeStorageChange,
}: Props) => {
  return (
    <FilterBarWrapper>
      <label className="filter-field">
        <Text type="p4" color="tertiary">
          Event Type
        </Text>
        <input
          className="event-type-input"
          type="text"
          value={eventType}
          placeholder="Filter by event type"
          onChange={event => onEventTypeChange(event.target.value)}
        />
      </label>
      <label className="filter-toggle">
        <input
          type="checkbox"
          checked={includeStorage}
          onChange={event => onIncludeStorageChange(event.target.checked)}
        />
        <Text type="p4" color="tertiary">
          Show storage events
        </Text>
      </label>
    </FilterBarWrapper>
  );
};

const FilterBarWrapper = styled.div`
  & {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 24px;
    width: 100%;
    padding: 16px 0;

    .filter-field {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 8px;
      min-width: 0;
      max-width: 100%;
    }

    .event-type-input {
      flex: 1;
      min-width: 0;
      width: 180px;
      height: 32px;
      padding: 0 10px;
      border-radius: 6px;
      border: 1px solid ${({ theme }) => theme.colors.dimmed50};
      background-color: ${({ theme }) => theme.colors.surface};
      color: ${({ theme }) => theme.colors.primary};
    }

    .filter-toggle {
      display: flex;
      flex-direction: row;
      flex-shrink: 0;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
  }
`;
