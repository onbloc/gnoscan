import styled from "styled-components";
import IconCopy from "@/assets/svgs/icon-copy.svg";

export const ContractListBox = styled.div`
  width: 100%;
  margin-top: 16px;
  & + & {
    margin-top: 32px;
  }
  .address-tooltip {
    vertical-align: text-bottom;
  }
  .svg-icon {
    stroke: ${({ theme }) => theme.colors.primary};
    margin-left: 5px;
  }

  dt {
    display: flex;
  }

  .badge {
    display: inline-flex;
    line-height: 1em;
    justify-content: center;
    align-items: center;
  }

  .tooltip-wrapper {
    position: inherit;
    display: inline-flex;
    width: 32px;
    justify-content: center;
    align-items: center;

    svg {
      fill: ${({ theme }) => theme.colors.tertiary};
      & .icon-tooltip_svg__bg {
        fill: ${({ theme }) => theme.colors.surface};
      }
    }
  }
`;

export const StyledIconCopy = styled(IconCopy)`
  stroke: ${({ theme }) => theme.colors.primary};
  margin-left: 5px;
`;
