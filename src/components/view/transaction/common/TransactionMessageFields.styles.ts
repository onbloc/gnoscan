import styled from "styled-components";
import mixins from "@/styles/mixins";

import IconCopy from "@/assets/svgs/icon-copy.svg";

export const AddressTextBox = styled.div`
  ${mixins.flexbox("row", "center", "center")}
  width: 100%;
  .address-tooltip {
    vertical-align: text-bottom;
  }
`;

export const StyledIconCopy = styled(IconCopy)`
  stroke: ${({ theme }) => theme.colors.primary};
  margin-left: 5px;
`;
