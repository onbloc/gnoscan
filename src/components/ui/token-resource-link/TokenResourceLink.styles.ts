import styled from "styled-components";

import { LinkWrapper } from "@/components/ui/detail-page-common-styles";

// The alignment applies in page headers; inside a summary row the value cell is a block, so it has no effect.
export const Link = styled(LinkWrapper)`
  align-self: center;
  flex-shrink: 0;

  @media (max-width: 767px) {
    align-self: flex-start;
  }
`;
