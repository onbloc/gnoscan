import styled from "styled-components";

export const TransactionSearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.base};
  padding: 24px;
  border-radius: 10px;
`;
