import styled from "styled-components";
import mixins from "@/styles/mixins";

export const AddressTextBox = styled.div`
  ${mixins.flexbox("row", "center", "center")}
  width: 100%;
  .address-tooltip {
    vertical-align: text-bottom;
  }
`;
