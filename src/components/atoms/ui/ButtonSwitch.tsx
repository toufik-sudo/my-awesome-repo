import React from 'react';

import componentStyle from 'sass-boilerplate/stylesheets/components/landing/ButtonSwitch.module.scss';

/**
 * Atom component that renders a checkbox style button
 *
 * @constructor
 *
 * @see ButtonStory
 */
const ButtonSwitch = ({ isChecked, setIsChecked, className = '' }) => {
  const { Switch, Slider, SliderChecked } = componentStyle;

  return (
    <div className={`${className} ${Switch}`}>
      <span>
        <button
          className={`${Slider} ${isChecked ? SliderChecked : ''}`}
          type="button"
          onClick={() => setIsChecked(!isChecked)}
        />
      </span>
    </div>
  );
};

export default ButtonSwitch;
