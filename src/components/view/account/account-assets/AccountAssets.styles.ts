import styled from "styled-components";

import { DEVICE_TYPE, media } from "@/common/values/ui.constant";

import { ASSET_GRID_GAP } from "./account-assets.utility";

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  background-color: ${({ theme }) => theme.colors.base};
  border-radius: 10px;
  width: 100%;
  padding: 16px;

  ${media.DESKTOP} {
    padding: 24px;
  }
`;

export const GridLayout = styled.div<{ breakpoint: DEVICE_TYPE }>`
  width: 100%;
  max-width: ${({ breakpoint }) => (breakpoint === DEVICE_TYPE.DESKTOP ? "1146px" : "none")};
  display: grid;
  grid-template-columns: ${({ breakpoint }) => (breakpoint === DEVICE_TYPE.DESKTOP ? "repeat(2, 1fr)" : "1fr")};
  grid-template-rows: auto;
  grid-gap: 16px;
`;

// Masonry via 1px rows: each cell spans its measured height, so expanding one
// cell only shifts its own column while the DOM stays row-major
export const MasonryGrid = styled.div`
  width: 100%;
  max-width: 1146px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 1px;
  grid-auto-flow: row dense;
  column-gap: ${ASSET_GRID_GAP}px;
  align-items: start;
  margin-bottom: -${ASSET_GRID_GAP}px;
`;

export const GridCell = styled.div`
  display: flex;
  min-width: 0;
`;
