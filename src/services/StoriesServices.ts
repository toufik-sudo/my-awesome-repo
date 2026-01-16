import { boolean, select, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';

export const getInverted = () =>
  boolean('Inverted', false, BUTTON_MAIN_TYPE.PRIMARY) ? BUTTON_MAIN_VARIANT.INVERTED : '';
export const getSampleAction = () => action('Clicked button');
export const buttonsOptions = () =>
  select('type', BUTTON_MAIN_TYPE, BUTTON_MAIN_TYPE.PRIMARY, BUTTON_MAIN_TYPE.PRIMARY);
export const getText = () => text('Text', 'text');
export const setBackgrounds = () => ({
  backgrounds: [
    { name: 'black', value: '#000', default: true },
    { name: 'white', value: '#fff' },
    { name: 'royalblue', value: 'royalblue' }
  ]
});
