import styled from "styled-components";

import { FilterButton } from "../../common/function-filter/FunctionFilter.styles";

// The transaction filter button, sized to sit in the row of the range buttons.
export const DateFilterButton = styled(FilterButton)<{ $active: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border-color: ${({ theme, $active }) => ($active ? theme.colors.blue : theme.colors.dimmed100)};
  color: ${({ theme, $active }) => ($active ? theme.colors.blue : theme.colors.primary)};

  svg {
    width: 18px;
    height: 18px;
  }
`;
