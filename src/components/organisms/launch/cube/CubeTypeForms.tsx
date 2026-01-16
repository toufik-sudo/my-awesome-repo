// import React from 'react';

// import CubeTypeFormsList from 'components/molecules/launch/cube/CubeTypeFormsList';
// import SpringAnimation from 'components/molecules/animations/SpringAnimation';
// import ValidateCta from 'components/atoms/launch/cube/ValidateCTA';
// import { CUBE_SECTIONS } from 'constants/wall/launch';
// import { useCubeTypeForms } from 'hooks/launch/cube/useCubeTypeForms';
// import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
// import { HTML_TAGS } from 'constants/general';
// import { setTranslate } from 'utils/animations';
// import { DELAY_INITIAL } from 'constants/animations';
// import { useCubeSectionValidation } from 'hooks/launch/cube/useCubeSectionValidation';
// import { useCubeModifyLimit } from 'hooks/launch/cube/useCubeModifyLimit';
// import { useCubeAllocationTypeFilter } from 'hooks/launch/cube/useCubeAllocationTypeFilter';
// import { useBracketReset } from 'hooks/launch/cube/useBracketReset';

// import style from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

// /**
//  * Organism component used to render cube type forms
//  *
//  * @param currentGoal
//  * @param handleAllocationTypeSelection
//  * @param index
//  * @constructor
//  */
// const CubeTypeForms = ({ cube, handleAllocationTypeSelection, index }) => {
//   const {
//     cubeTypeFormsWrapper,
//     cubeSectionSubtitle,
//     cubeSectionDisabled,
//     cubeSectionEditable,
//     cubeSectionWrapper
//   } = style;
//   const { activeTypeForm, cubeFormsAvailable, type, handleTypeFormSelection, currentGoal } = useCubeTypeForms(
//     cube,
//     handleAllocationTypeSelection,
//     index
//   );
//   const { isCurrentGoal } = useCubeModifyLimit(index);
//   const { handleItemValidation } = useCubeSectionValidation(index);
//   const { handleTypeFormValidation } = useBracketReset(index, cube, handleItemValidation);

//   const {
//     validated: { allocationType }
//   } = currentGoal;
//   const isValidateVisible = activeTypeForm !== null && allocationType && isCurrentGoal;
//   useCubeAllocationTypeFilter(index);

//   if (!cubeFormsAvailable) return null;

//   return (
//     <SpringAnimation settings={setTranslate(DELAY_INITIAL)}>
//       <div className={cubeSectionWrapper}>
//         {isValidateVisible && (
//           <ValidateCta
//             {...{
//               handleItemValidation: handleTypeFormValidation,
//               targetName: CUBE_SECTIONS.ALLOCATION_TYPE,
//               targetValue: allocationType
//             }}
//           />
//         )}
//         <div className={`${cubeSectionEditable} ${cubeTypeFormsWrapper} ${allocationType ? cubeSectionDisabled : ''}`}>
//           <DynamicFormattedMessage
//             className={cubeSectionSubtitle}
//             tag={HTML_TAGS.P}
//             id="launchProgram.cube.allocationType.title"
//           />
//           {!currentGoal.acceptedTypes.length && (
//             <DynamicFormattedMessage tag={HTML_TAGS.P} id="launchProgram.cube.allocation.notAvailable" />
//           )}
//           {currentGoal.acceptedTypes.map(key => (
//             <CubeTypeFormsList
//               key={key}
//               {...{
//                 step: key,
//                 activeTypeForm,
//                 type,
//                 measurementType: currentGoal.measurementType,
//                 handleTypeFormSelection,
//                 index,
//                 measurementName: currentGoal.measurementName
//               }}
//             />
//           ))}
//         </div>
//       </div>
//     </SpringAnimation>
//   );
// };

// export default CubeTypeForms;


// import React from 'react';
// import CubeTypeFormsList from 'components/molecules/launch/cube/CubeTypeFormsList';
// import SpringAnimation from 'components/molecules/animations/SpringAnimation';
// import ValidateCta from 'components/atoms/launch/cube/ValidateCTA';
// import { CUBE_SECTIONS } from 'constants/wall/launch';
// import { useCubeTypeForms } from 'hooks/launch/cube/useCubeTypeForms';
// import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
// import { HTML_TAGS } from 'constants/general';
// import { setTranslate } from 'utils/animations';
// import { DELAY_INITIAL } from 'constants/animations';
// import { useCubeSectionValidation } from 'hooks/launch/cube/useCubeSectionValidation';
// import { useCubeModifyLimit } from 'hooks/launch/cube/useCubeModifyLimit';
// import { useCubeAllocationTypeFilter } from 'hooks/launch/cube/useCubeAllocationTypeFilter';
// import { useBracketReset } from 'hooks/launch/cube/useBracketReset';

// import styles from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss'; // Import styles

// const CubeTypeForms = ({ cube, handleAllocationTypeSelection, index }) => {
//   const {
//     cubeTypeFormsWrapper,
//     cubeSectionSubtitle,
//     cubeSectionDisabled,
//     cubeSectionEditable,
//     cubeSectionWrapper,
//   } = styles;

//   const { activeTypeForm, cubeFormsAvailable, type, handleTypeFormSelection, currentGoal } =
//     useCubeTypeForms(cube, handleAllocationTypeSelection, index);
//   const { isCurrentGoal } = useCubeModifyLimit(index);
//   const { handleItemValidation } = useCubeSectionValidation(index);
//   const { handleTypeFormValidation } = useBracketReset(index, cube, handleItemValidation);

//   const {
//     validated: { allocationType },
//   } = currentGoal;
//   const isValidateVisible = activeTypeForm !== null && allocationType && isCurrentGoal;

//   useCubeAllocationTypeFilter(index);

//   if (!cubeFormsAvailable) return null;

//   return (
//     <SpringAnimation settings={setTranslate(DELAY_INITIAL)}>
//       <div className={cubeSectionWrapper}>
//         {isValidateVisible && (
//           <ValidateCta
//             handleItemValidation={handleTypeFormValidation}
//             targetName={CUBE_SECTIONS.ALLOCATION_TYPE}
//             targetValue={allocationType}
//           />
//         )}
//         <div
//           className={`${cubeSectionEditable} ${cubeTypeFormsWrapper} ${
//             allocationType ? cubeSectionDisabled : ''
//           }`}
//         >
//           <DynamicFormattedMessage
//             className={cubeSectionSubtitle}
//             tag={HTML_TAGS.P}
//             id="launchProgram.cube.allocationType.title"
//           />
//           {!currentGoal.acceptedTypes.length && (
//             <DynamicFormattedMessage tag={HTML_TAGS.P} id="launchProgram.cube.allocation.notAvailable" />
//           )}
//           {currentGoal.acceptedTypes.map((key) => (
//             <CubeTypeFormsList
//               key={key}
//               step={key}
//               activeTypeForm={activeTypeForm}
//               type={type}
//               measurementType={currentGoal.measurementType}
//               measurementName={currentGoal.measurementName}
//               handleTypeFormSelection={!allocationType && key === 'growth' ? undefined : handleTypeFormSelection}
//               index={index}
//             />
//           ))}
//         </div>
//       </div>
//     </SpringAnimation>
//   );
// };

// export default CubeTypeForms;


import React from 'react';
import CubeTypeFormsList from 'components/molecules/launch/cube/CubeTypeFormsList';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import ValidateCta from 'components/atoms/launch/cube/ValidateCTA';
import { CUBE_SECTIONS } from 'constants/wall/launch';
import { useCubeTypeForms } from 'hooks/launch/cube/useCubeTypeForms';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { setTranslate } from 'utils/animations';
import { DELAY_INITIAL } from 'constants/animations';
import { useCubeSectionValidation } from 'hooks/launch/cube/useCubeSectionValidation';
import { useCubeModifyLimit } from 'hooks/launch/cube/useCubeModifyLimit';
import { useCubeAllocationTypeFilter } from 'hooks/launch/cube/useCubeAllocationTypeFilter';
import { useBracketReset } from 'hooks/launch/cube/useBracketReset';

import styles from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss'; // Import styles

/**
 * Component to display the Cube Type Forms with proper styling
 */
const CubeTypeForms = ({ cube, handleAllocationTypeSelection, index }) => {
  const {
    cubeTypeFormsWrapper,
    cubeSectionSubtitle,
    cubeSectionDisabled,
    cubeSectionEditable,
    cubeSectionWrapper,
    cubeTypeFormDisabled,
  } = styles;

  const { activeTypeForm, cubeFormsAvailable, type, handleTypeFormSelection, currentGoal } =
    useCubeTypeForms(cube, handleAllocationTypeSelection, index);
  const { isCurrentGoal } = useCubeModifyLimit(index);
  const { handleItemValidation } = useCubeSectionValidation(index);
  const { handleTypeFormValidation } = useBracketReset(index, cube, handleItemValidation);

  const {
    validated: { allocationType },
  } = currentGoal;
  const isValidateVisible = activeTypeForm !== null && allocationType && isCurrentGoal;

  useCubeAllocationTypeFilter(index);

  if (!cubeFormsAvailable) return null;

  return (
    <SpringAnimation settings={setTranslate(DELAY_INITIAL)}>
      <div className={cubeSectionWrapper}>
        {isValidateVisible && (
          <ValidateCta
            handleItemValidation={handleTypeFormValidation}
            targetName={CUBE_SECTIONS.ALLOCATION_TYPE}
            targetValue={allocationType}
          />
        )}
        <div
          className={`${cubeTypeFormsWrapper} ${
            allocationType ? cubeSectionDisabled : cubeSectionEditable
          }`}
        >
          <DynamicFormattedMessage
            className={cubeSectionSubtitle}
            tag={HTML_TAGS.P}
            id="launchProgram.cube.allocationType.title"
          />
          {!currentGoal.acceptedTypes.length && (
            <DynamicFormattedMessage tag={HTML_TAGS.P} id="launchProgram.cube.allocation.notAvailable" />
          )}
          {currentGoal.acceptedTypes.map((key) => (
            <CubeTypeFormsList
              key={key}
              step={key}
              activeTypeForm={activeTypeForm}
              type={type}
              measurementType={currentGoal.measurementType}
              measurementName={currentGoal.measurementName}
              handleTypeFormSelection={allocationType ? undefined : handleTypeFormSelection}
              index={index}
            />
          ))}
        </div>
      </div>
    </SpringAnimation>
  );
};

export default CubeTypeForms;
