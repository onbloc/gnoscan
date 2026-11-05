import styled from "styled-components";

import mixins from "@/styles/mixins";

export const Control = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

export const Section = styled.section`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  gap: 4px;
`;

export const OptionList = styled.ul`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  gap: 4px;
`;
