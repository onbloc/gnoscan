import styled from "styled-components";

import mixins from "@/styles/mixins";
import { FitContentA } from "../../detail-page-common-styles";

export const List = styled.li`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  border-radius: 4px;
  padding: 6px 10px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.dimmed50};
  }
`;

export const FitContentAStyle = styled(FitContentA)`
  ${mixins.flexbox("row", "center", "center")}
`;
