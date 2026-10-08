import { scrollbarStyle } from "@/common/hooks/use-scroll-bar";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import { media } from "@/common/values/ui.constant";

export const GlobalStyle = createGlobalStyle`
  ${reset}
  // Arial resized to Roboto's metrics (values from next/font) so text keeps its width when Roboto swaps in.
  @font-face {
    font-family: "Roboto Fallback";
    src: local("Arial");
    ascent-override: 92.98%;
    descent-override: 24.47%;
    line-gap-override: 0%;
    size-adjust: 99.78%;
  }
  html, body {
    width: 100%;
    height: 100%;
    position: relative;
    font-family: Roboto, "Roboto Fallback", sans-serif;
  };

  body {
    ${scrollbarStyle};
    &.scroll-visible::-webkit-scrollbar {
      width: 0;
    }
  }

  #__next {
    width: 100%;
    height: 100%;
  }

  main, header, footer {
    width: 100%;
    & > div.inner-layout {
      width: 100%;
      height: 100%;
      max-width: 1280px;
      min-width: 360px;
      padding: 0px 18px;
      margin: 0 auto;
    }
  }

  hr {
    width: 100%;
    height: 1px;
    border: none;
  }

  * {
    box-sizing: border-box;
    font: inherit;
    color: inherit;
  };

  a {
    text-decoration: none;
  };

  button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    cursor: pointer;
    &:disabled {
      cursor: default;
    };
  }

  button, input {
    background: none;
    outline: none;
    padding: 0;
    border: none;
  };

  // CSS picks the variant so the server HTML matches the hydrated page.
  ${media.MOBILE} {
    .hide-mobile {
      display: none !important;
    }
  }
  ${media.NOT_MOBILE} {
    .only-mobile {
      display: none !important;
    }
  }
  ${media.NOT_DESKTOP} {
    .only-desktop {
      display: none !important;
    }
  }
  ${media.DESKTOP} {
    .hide-desktop {
      display: none !important;
    }
  }
`;
