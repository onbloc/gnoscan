import Link from "next/link";
import styled from "styled-components";
import mixins from "@/styles/mixins";
import { media } from "@/common/values/ui.constant";

// Creator link color from the token details design, not part of the theme palette.
const CREATOR_LINK_COLOR = "#1890FF";

export const StyledA = styled(Link)`
  ${mixins.flexbox("row", "center", "center")};
`;

// Token details design overrides, scoped here so the shared detail page styles stay unchanged elsewhere.
export const SummarySection = styled.div`
  width: 100%;

  > div > div:first-child {
    font-weight: 600;
  }

  dt {
    color: ${({ theme }) => theme.colors.primary};
  }

  .badge {
    gap: 4px;
    line-height: 20px;

    svg {
      margin-left: 0;
    }
  }

  dd > div > div {
    gap: 16px 15px;
  }

  ul {
    color: ${({ theme }) => theme.colors.primary};
  }

  ul li {
    border-radius: 16px 0 0 0;
  }

  textarea {
    max-height: 508px;
    border-radius: 0 10px 10px 10px;
  }

  > div > div:has(ul) > div {
    max-height: 552px;
  }

  > div > button {
    width: auto;
    padding: 16px 96px;

    > div {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  ${media.DESKTOP} {
    > div {
      padding: 22px 24px;
    }

    > div > div:first-child {
      margin-bottom: 32px;
    }

    dt {
      flex-shrink: 0;
    }

    dd {
      margin-left: 24px;
    }

    dl:last-of-type {
      padding-bottom: 18px;
      border-bottom: 1px solid ${({ theme }) => theme.colors.dimmed100};
    }

    dl:last-of-type + div {
      margin-top: 32px;
    }
  }
`;

export const Divider = styled.span`
  color: ${({ theme }) => theme.colors.tertiary};
`;

export const PriceText = styled.span`
  ${mixins.flexbox("row", "center", "flex-start")};
  white-space: nowrap;
`;

export const CreatorText = styled.span`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 4px;
  color: ${CREATOR_LINK_COLOR};

  > span > a > div,
  > div {
    color: ${CREATOR_LINK_COLOR};
  }
`;
