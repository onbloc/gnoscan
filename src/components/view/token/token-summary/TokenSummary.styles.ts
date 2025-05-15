import Link from "next/link";
import styled from "styled-components";
import mixins from "@/styles/mixins";

export const StyledA = styled(Link)`
  ${mixins.flexbox("row", "center", "center")};
`;
