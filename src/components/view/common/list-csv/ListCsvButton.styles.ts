import styled from "styled-components";

import { media } from "@/common/values/ui.constant";
import { FilterButton } from "../function-filter/FunctionFilter.styles";

export const CsvButton = styled(FilterButton)`
  gap: 4px;
  width: auto;
  padding: 0 8px;
  white-space: nowrap;
  ${({ theme }) => theme.fonts.body2};

  svg {
    width: 14px;
    height: 14px;
  }

  ${media.NOT_DESKTOP} {
    width: 40px;
    padding: 0;
    gap: 0;

    svg {
      width: 18px;
      height: 18px;
    }

    span {
      display: none;
    }
  }

  :disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
