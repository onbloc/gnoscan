import styled from "styled-components";

import { innerLayoutCss } from "@/styles/css/inner-layout";

export const Container = styled.main`
  width: 100%;
  flex: 1;
  padding: 40px 0;
`;

export const InnerLayout = styled.div`
  ${innerLayoutCss}
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  width: 100%;
  padding: 24px;
  border-radius: 10px;

  background-color: ${({ theme }) => theme.colors.surface};
`;
