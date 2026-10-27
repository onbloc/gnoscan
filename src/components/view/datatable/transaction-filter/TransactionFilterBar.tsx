import React from "react";
import styled from "styled-components";

import Text from "@/components/ui/text";
import { EMPTY_TRANSACTION_FILTER, TransactionFilterInput } from "@/common/hooks/transactions/use-transaction-filter";

const MESSAGE_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "exec", label: "Call" },
  { value: "send", label: "Send" },
  { value: "add_package", label: "Add Package" },
  { value: "run", label: "Run" },
];

interface Props {
  value: TransactionFilterInput;
  onChange: (value: TransactionFilterInput) => void;
  // Transfer lists only support the date range; they already hold successful transactions.
  dateOnly?: boolean;
  // Matching transactions, shown when the list has no other place for the count.
  resultCount?: number;
}

/**
 * Filter controls for transaction lists: a UTC date range plus, unless dateOnly,
 * status, message type and an exact function name.
 */
export const TransactionFilterBar = ({ value, onChange, dateOnly = false, resultCount }: Props) => {
  const update = <K extends keyof TransactionFilterInput>(key: K, next: TransactionFilterInput[K]) =>
    onChange({ ...value, [key]: next });

  const isFiltered = Object.entries(value).some(([key, field]) =>
    dateOnly ? (key === "fromDate" || key === "toDate") && field !== "" : field !== "",
  );

  return (
    <FilterBarWrapper>
      <label className="filter-field">
        <Text type="p4" color="tertiary">
          From
        </Text>
        <input
          className="filter-input"
          type="date"
          aria-label="From date (UTC)"
          value={value.fromDate}
          max={value.toDate || undefined}
          onChange={event => update("fromDate", event.target.value)}
        />
      </label>
      <label className="filter-field">
        <Text type="p4" color="tertiary">
          To
        </Text>
        <input
          className="filter-input"
          type="date"
          aria-label="To date (UTC)"
          value={value.toDate}
          min={value.fromDate || undefined}
          onChange={event => update("toDate", event.target.value)}
        />
        {/* The API matches whole UTC days; local time zones are not converted. */}
        <Text type="p4" color="tertiary">
          UTC
        </Text>
      </label>
      {!dateOnly && (
        <>
          <label className="filter-field">
            <Text type="p4" color="tertiary">
              Status
            </Text>
            <select
              className="filter-input"
              value={value.status}
              onChange={event => update("status", event.target.value as TransactionFilterInput["status"])}
            >
              <option value="">All</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </label>
          <label className="filter-field">
            <Text type="p4" color="tertiary">
              Type
            </Text>
            <select
              className="filter-input"
              value={value.messageType}
              onChange={event => update("messageType", event.target.value)}
            >
              {MESSAGE_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-field">
            <Text type="p4" color="tertiary">
              Function
            </Text>
            <input
              className="filter-input function-input"
              type="text"
              value={value.function}
              placeholder="Exact function name"
              onChange={event => update("function", event.target.value)}
            />
          </label>
        </>
      )}
      {isFiltered && (
        <button type="button" className="filter-reset" onClick={() => onChange(EMPTY_TRANSACTION_FILTER)}>
          <Text type="p4" color="blue">
            Reset
          </Text>
        </button>
      )}
      {resultCount !== undefined && (
        <Text type="p4" color="tertiary" className="filter-count">
          {resultCount.toLocaleString()} {resultCount === 1 ? "transaction" : "transactions"} found
        </Text>
      )}
    </FilterBarWrapper>
  );
};

const FilterBarWrapper = styled.div`
  & {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px 24px;
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

    .filter-input {
      min-width: 0;
      height: 32px;
      padding: 0 10px;
      border-radius: 6px;
      border: 1px solid ${({ theme }) => theme.colors.dimmed50};
      background-color: ${({ theme }) => theme.colors.surface};
      color: ${({ theme }) => theme.colors.primary};
    }

    /* The native arrow hugs the right border, so it is replaced with an inset chevron. */
    select.filter-input {
      appearance: none;
      min-width: 104px;
      padding-right: 34px;
      cursor: pointer;
      background-image: ${({ theme }) =>
        `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'><path d='M2.5 4.5 6 8l3.5-3.5' fill='none' stroke='${theme.colors.tertiary}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>`,
        )}")`};
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 12px;
    }

    .function-input {
      width: 180px;
    }

    .filter-reset {
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
    }

    .filter-count {
      margin-left: auto;
    }
  }
`;
