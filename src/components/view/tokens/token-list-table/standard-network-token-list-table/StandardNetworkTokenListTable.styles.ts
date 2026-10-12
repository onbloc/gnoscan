import styled from "styled-components";

import { CardTableContainer } from "@/components/view/datatable/datatable.styles";

// Token list design: 24px card padding, 40px header row (14/500/16) and 1px 10% row borders.
// Scoped here so the shared Datatable keeps its look on every other page.
export const TokenListTable = styled(CardTableContainer)`
  & > div:first-child {
    padding: 24px 24px 0;
  }

  .scroll-wrapper > div:first-child {
    border-bottom-color: ${({ theme }) => theme.colors.dimmed100};

    > div {
      height: 40px;
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
    }
  }

  .scroll-wrapper > div:nth-child(2) {
    border-bottom: none;

    > div {
      border-bottom-color: ${({ theme }) => theme.colors.dimmed100};
    }
  }
`;

export const PriceCell = styled.span`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
`;
