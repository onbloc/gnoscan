/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import Datatable from "@/components/ui/datatable";
import { DatatableHeader } from "@/components/ui/datatable";
import { themeState } from "@/states";

// Expansion padding (24px each side) + nested table padding (24px each side) inside the 1146px row.
export const ACTIVITY_DETAIL_TABLE_WIDTH = 1050;

interface Props<T> {
  visible: boolean;
  headers: DatatableHeader.Header<T>[];
  datas: T[];
}

/**
 * Shared expandable-row body for activity datatables: the row's messages, transfers,
 * or realm events as a header + rows table, like the transaction page's Events tab.
 */
export const ActivityDetailTable = <T extends { [key in string]: any }>({ visible, headers, datas }: Props<T>) => {
  const themeMode = useRecoilValue(themeState);

  return (
    <ActivityDetailWrapper className={visible ? "active" : "hidden"}>
      {visible && (
        <div className="container">
          <Datatable
            maxWidth={ACTIVITY_DETAIL_TABLE_WIDTH}
            headers={headers.map(header => ({ ...header, themeMode }))}
            datas={datas}
          />
        </div>
      )}
    </ActivityDetailWrapper>
  );
};

const ActivityDetailWrapper = styled.div`
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
      background-color: ${({ theme }) => theme.colors.surface};
      padding: 24px;
      border-radius: 10px;
    }

    &.hidden {
      min-height: 0;
      height: 0;
    }
  }
`;
