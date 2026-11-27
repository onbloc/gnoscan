import styled from "styled-components";

export { Container, InnerLayout, TitleWrapper, Wrapper } from "@/layouts/block/BlockLayout.styles";

export const Message = styled.div`
  width: 100%;
  padding: 24px 0;
  color: ${({ theme }) => theme.colors.tertiary};
  ${({ theme }) => theme.fonts.p3};

  button {
    margin-left: 12px;
    color: ${({ theme }) => theme.colors.blue};
  }
`;
