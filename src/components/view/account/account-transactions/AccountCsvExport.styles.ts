import styled from "styled-components";

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Notice = styled.div<{ $error: boolean }>`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.dimmed50};
  color: ${({ theme, $error }) => ($error ? theme.colors.failed : theme.colors.tertiary)};
  ${({ theme }) => theme.fonts.p4};
`;
