import styled from "styled-components";

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: ${({ theme }) => theme.colors.tertiary};
  ${({ theme }) => theme.fonts.p4};
`;

// Looks like the search box of the function filter.
export const DateInput = styled.input<{ $dark: boolean }>`
  height: 44px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.base};
  color: ${({ theme }) => theme.colors.primary};
  color-scheme: ${({ $dark }) => ($dark ? "dark" : "light")};
  outline: none;
  transition: border-color 0.15s ease, background-color 0.15s ease;
  ${({ theme }) => theme.fonts.p4};

  :focus {
    border-color: ${({ theme }) => theme.colors.blue};
    background-color: ${({ theme }) => theme.colors.surface};
  }
`;

export const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.failed};
  ${({ theme }) => theme.fonts.p4};
`;
