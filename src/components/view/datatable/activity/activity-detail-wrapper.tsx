import styled from "styled-components";

/**
 * Shared expandable-row shell for activity datatables (transactions, transfers,
 * internal transactions) - same show/hide + surface styling as the events tab's
 * own expansion, just reused instead of re-declared per table.
 */
export const ActivityDetailWrapper = styled.div`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: fit-content;
    overflow: hidden;
    transition: all 0.4s ease;

    .container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: auto;
      align-items: stretch;
      background-color: ${({ theme }) => theme.colors.surface};
      gap: 16px;
      padding: 24px;
      border-radius: 10px;
    }

    &.hidden {
      min-height: 0;
      height: 0;
    }

    .entry {
      display: flex;
      flex-direction: column;
      width: 100%;
      background-color: ${({ theme }) => theme.colors.base};
      border-radius: 10px;
      padding: 12px 16px;
      gap: 8px;
    }

    .entry:not(:last-child) {
      margin-bottom: 4px;
    }

    .entry-row {
      display: flex;
      flex-direction: row;
      width: 100%;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .entry-label {
      min-width: 96px;
      color: ${({ theme }) => theme.colors.tertiary};
    }

    .entry-arrow {
      color: ${({ theme }) => theme.colors.tertiary};
    }

    .badge {
      display: inline-flex;
      padding: 2px 8px;
      border-radius: 4px;
      background-color: ${({ theme }) => theme.colors.pantone};
      color: ${({ theme }) => theme.colors.reverse};
    }

    .attributes {
      display: flex;
      flex-direction: column;
      width: 100%;

      & > div:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme.colors.surface};
      }

      .attribute-row {
        display: flex;
        width: 100%;
        padding: 6px 0;

        .key {
          min-width: 160px;
          color: ${({ theme }) => theme.colors.primary};
        }

        .value {
          width: 100%;
          color: ${({ theme }) => theme.colors.eventParam};
        }
      }
    }

    .empty {
      color: ${({ theme }) => theme.colors.tertiary};
    }
  }
`;
