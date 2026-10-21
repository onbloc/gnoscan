import styled from "styled-components";

export const BadgeContentWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const BadgeListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const PackagePathWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;

  > .badge {
    margin: 0;
  }

  @media (max-width: 1279px) {
    dd > & {
      margin-top: 12px;
    }
  }

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    > .badge:first-child {
      width: fit-content;
      max-width: 100%;
      min-width: 0;
    }

    > .badge:not(:first-child) {
      width: fit-content;
      max-width: 100%;
    }
  }
`;

export const RealmStatusBadgeContent = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  .not-yet-enabled-tooltip {
    width: 16px;
    height: 16px;
    line-height: 0;
  }
`;

export const TooltipContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;

  .info {
    width: 100%;
    height: fit-content;
    padding: 6px 10px;
    ${({ theme }) => theme.fonts.p4};
    color: ${({ theme }) => theme.colors.blue};
    background-color: ${({ theme }) => theme.colors.pantone};
    border-radius: 4px;
  }
`;
