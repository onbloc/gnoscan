import {createGlobalStyle} from 'styled-components';
import reset from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
  ${reset}
  html, body {
    width: 100%;
    height: 100%;
    position: relative;
    font-family: Roboto, sans-serif;
  };

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

  ::-webkit-scrollbar {
    width: 0px;
    display: none;
  };

  ::-webkit-scrollbar-track {
    background-color: transparent;
  };

  ::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: 10px;
  };
`;
