import styled, { css } from "styled-components";
import { media } from "@/common/values/ui.constant";

/**
 * Home section grid. One column by default, two columns with a wider gap on desktop.
 */
export const SectionGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 16px;
  ${media.DESKTOP} {
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 32px;
  }
`;

/**
 * Card title spacing and overflow for sections that hold chart cards.
 * Interpolate it into the extending component so its rules keep their place in the cascade.
 */
export const sectionChartCardStyle = css`
  & .title {
    width: 100%;
    margin-bottom: 16px;
  }

  & > div {
    overflow: hidden;
  }
`;
