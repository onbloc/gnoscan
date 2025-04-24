import mixins from "@/styles/mixins";
import styled from "styled-components";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  size: number;
  length: number;
}

export const Divider = styled.div<DividerProps>`
  width: ${({ orientation = "horizontal", size = 1, length }) =>
    orientation === "horizontal" ? (length ? `${length}px` : "100%") : `${size}px`};

  height: ${({ orientation = "horizontal", size = 1, length }) =>
    orientation === "vertical" ? (length ? `${length}px` : "100%") : `${size}px`};
  border-width: 0;
  margin: 0;
  background-color: ${({ theme }) => theme.colors.primary};
`;
