import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import centered from '@storybook/addon-centered/react';

const req = require.context('../src', true, /\.stories\.tsx$/);
function loadStories() {
  addDecorator(withInfo);
  addDecorator(centered);
  req.keys().forEach(req);
}
configure(loadStories, module);
