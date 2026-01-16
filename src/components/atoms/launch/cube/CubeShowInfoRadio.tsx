// import React from 'react';

// import { HTML_TAGS } from 'constants/general';
// import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
// import { GROWTH, RANKING } from 'constants/wall/launch';

// import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';
// import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

// /**
//  * Atom component used to render cube show info radio button
//  *
//  * @param handleSelection
//  * @param isSelected
//  * @param translation
//  * @param step
//  * @constructor
//  */
// const CubeShowInfoRadio = ({ handleSelection, isSelected, translation, step }) => {
//   const { cubeRadioItem, cubeRadioItemSelected, allocationTypeRadioGroup, cubeSecondTitle } = style;

//   return (
//     <div className={allocationTypeRadioGroup} onClick={() => handleSelection(step)}>
//       <DynamicFormattedMessage
//         className={`${cubeRadioItem} ${isSelected ? cubeRadioItemSelected : ''}`}
//         tag={HTML_TAGS.SPAN}
//         id={translation}
//       />
//       {(step === GROWTH || step === RANKING) && (
//         <DynamicFormattedMessage
//           className={`${cubeSecondTitle} ${coreStyle.italic}`}
//           tag={HTML_TAGS.P}
//           id={`launchProgram.cube.${step}.secondTitle`}
//         />
//       )}
//     </div>
//   );
// };

// export default CubeShowInfoRadio;


import React from 'react';

import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { GROWTH, RANKING } from 'constants/wall/launch';

import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component used to render cube show info radio button
 *
 * @param handleSelection
 * @param isSelected
 * @param translation
 * @param step
 * @constructor
 */
const CubeShowInfoRadio = ({ handleSelection, isSelected, translation, step }) => {
  const { cubeRadioItem, cubeRadioItemSelected, allocationTypeRadioGroup, cubeSecondTitle } = style;

  const handleClick = () => {
    if (typeof handleSelection === 'function') {
      handleSelection(step);
    }
  };

  return (
    <div className={allocationTypeRadioGroup} onClick={handleClick}>
      <DynamicFormattedMessage
        className={`${cubeRadioItem} ${isSelected ? cubeRadioItemSelected : ''}`}
        tag={HTML_TAGS.SPAN}
        id={translation}
      />
      {(step === GROWTH || step === RANKING) && (
        <DynamicFormattedMessage
          className={`${cubeSecondTitle} ${coreStyle.italic}`}
          tag={HTML_TAGS.P}
          id={`launchProgram.cube.${step}.secondTitle`}
        />
      )}
    </div>
  );
};

export default CubeShowInfoRadio;
