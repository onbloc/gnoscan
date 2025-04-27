import styled from "styled-components";
import IconCopy from "@/assets/svgs/icon-copy.svg";

export const StyledIconCopy = styled(IconCopy)`
  stroke: ${({ theme }) => theme.colors.primary};
  margin-left: 5px;
`;
