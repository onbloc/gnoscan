import styled from "styled-components";
import IconCopy from "@/assets/svgs/icon-copy.svg";

export const ContractListBox = styled.div`
  width: 100%;
  margin-top: 16px;
  & + & {
    margin-top: 32px;
  }
`;

export const StyledIconCopy = styled(IconCopy)`
  stroke: ${({ theme }) => theme.colors.primary};
  margin-left: 5px;
`;
