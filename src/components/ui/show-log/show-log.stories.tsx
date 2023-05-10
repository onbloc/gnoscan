import type {Meta, StoryObj} from '@storybook/react';

import ShowLog from './show-log';

const meta: Meta<typeof ShowLog> = {
  title: 'common/ShowLog',
  component: ShowLog,
};

export default meta;
type Story = StoryObj<typeof ShowLog>;

export const Basic: Story = {
  args: {
    isTabLog: false,
    logData: 'ShowLog Content',
  },
};
