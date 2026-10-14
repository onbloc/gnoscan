import styled from "styled-components";

import { media } from "@/common/values/ui.constant";
import { DetailsContainer, DLWrap } from "@/components/ui/detail-page-common-styles";

export const SummaryContainer = styled(DetailsContainer)`
  .summary-title {
    font-weight: 600;
  }

  > ${DLWrap} {
    > dt {
      color: ${({ theme }) => theme.colors.primary};
    }

    > dd {
      min-width: 0;
    }

    .badge {
      width: fit-content;
      max-width: 100%;
      overflow-wrap: anywhere;
    }
  }

  .copyable-badge {
    gap: 4px;

    > div:first-child {
      min-width: 0;
    }

    .path-copy-tooltip {
      flex-shrink: 0;
    }

    .svg-icon {
      width: 16px;
      height: 16px;
      margin-left: 0;
      stroke: ${({ theme }) => theme.colors.primary};
    }
  }

  button > div {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }

  ${media.DESKTOP} {
    max-width: 1194px;
    align-self: center;
    padding: 22px 24px;

    .summary-title {
      margin-bottom: 32px;
    }

    > ${DLWrap} {
      > dt {
        flex: 0 0 200px;
        margin-right: 24px;
      }

      > dd {
        flex: 1;
        width: auto;
      }
    }

    .public-functions > dd > button {
      width: 263px;
      max-width: 100%;
    }
  }
`;

export const SourceArea = styled.div`
  width: 100%;

  ${media.DESKTOP} {
    > button {
      width: 275px;
      max-width: 100%;
      // ShowLog's collapsed wrapper adds 8px, completing the 18px gap.
      margin-top: 10px;
    }
  }
`;
