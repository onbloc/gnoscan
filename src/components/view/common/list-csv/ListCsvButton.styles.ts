import styled from "styled-components";

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

  :disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
