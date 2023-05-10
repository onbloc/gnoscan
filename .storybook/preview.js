import React from 'react';
import {RecoilRoot} from 'recoil';
import {CustomThemeProvider} from '../src/components/core/layout/CustomThemeProvider';

export const parameters = {
  actions: {argTypesRegex: '^on[A-Z].*'},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story, context) => {
    return (
      <RecoilRoot>
        <CustomThemeProvider>
          <Story />
        </CustomThemeProvider>
      </RecoilRoot>
    );
  },
];
