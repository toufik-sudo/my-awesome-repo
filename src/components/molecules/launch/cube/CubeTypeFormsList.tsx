// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';

// import CubeShowInfoRadio from 'components/atoms/launch/cube/CubeShowInfoRadio';
// import DynamicCubeComponent from 'components/organisms/launch/cube/DynamicCubeComponent';
// import SpringAnimation from 'components/molecules/animations/SpringAnimation';
// import { getAllocationTypeId } from 'services/CubeServices';
// import { getKeyByValue } from 'utils/general';
// import { CUBE, MEASUREMENT_TYPES } from 'constants/wall/launch';
// import { setTranslate } from 'utils/animations';
// import { DELAY_INITIAL } from 'constants/animations';
// import { setLaunchDataStep } from 'store/actions/launchActions';
// import { IStore } from 'interfaces/store/IStore';
// import { useUpdateEffect } from 'hooks/general/useUpdateEffect';

// /**
//  * Molecule component used to render cube type form list
//  *
//  * @param step
//  * @param activeTypeForm
//  * @param type
//  * @param measurementType
//  * @param handleTypeFormSelection
//  * @param index
//  * @constructor
//  */
// const CubeTypeFormsList = ({ step, activeTypeForm, type, measurementType, handleTypeFormSelection, index, measurementName = null }) => {
//   const dispatch = useDispatch();
//   const cube = useSelector((store: IStore) => store.launchReducer.cube);
//   const allocationValidated = cube.goals[index].validated.allocationType;
//   let measurementTypeKey = '';
//   if (measurementType) {
//     measurementTypeKey = measurementName != 'action' ? `.${getKeyByValue(MEASUREMENT_TYPES, measurementType).toLowerCase()}` : `.${getKeyByValue(MEASUREMENT_TYPES, 3).toLowerCase()}`;
//   }

//   useUpdateEffect(() => {
//     dispatch(
//       setLaunchDataStep({
//         key: CUBE,
//         value: {
//           ...cube,
//           frequencyAllocation: '',
//           cubeValidated: {
//             ...cube.cubeValidated,
//             frequencyAllocation: false,
//             spendType: false,
//             validityPoints: false,
//             rewardPeopleManagers: false
//           }
//         }
//       })
//     );
//   }, [step, activeTypeForm]);

//   let shouldDisplay = true;

//   if (allocationValidated) {
//     shouldDisplay = getAllocationTypeId(step, measurementType) === activeTypeForm;
//   }

//   return (
//     <div>
//       {shouldDisplay && (
//         <>
//           <CubeShowInfoRadio
//             {...{
//               handleSelection: handleTypeFormSelection,
//               isSelected: getAllocationTypeId(step, measurementType) === activeTypeForm,
//               translation: `launchProgram.cube.${step}.${type}${measurementTypeKey}`,
//               step
//             }}
//           />
//           {getAllocationTypeId(step, measurementType) === activeTypeForm && (
//             <SpringAnimation settings={setTranslate(DELAY_INITIAL)}>
//               <DynamicCubeComponent {...{ index, tag: step, activeTypeForm }} />
//             </SpringAnimation>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default CubeTypeFormsList;


import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CubeShowInfoRadio from 'components/atoms/launch/cube/CubeShowInfoRadio';
import DynamicCubeComponent from 'components/organisms/launch/cube/DynamicCubeComponent';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { getAllocationTypeId } from 'services/CubeServices';
import {emptyFn, getKeyByValue} from 'utils/general';
import { CUBE, MEASUREMENT_TYPES } from 'constants/wall/launch';
import { setTranslate } from 'utils/animations';
import { DELAY_INITIAL } from 'constants/animations';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { IStore } from 'interfaces/store/IStore';
import { useUpdateEffect } from 'hooks/general/useUpdateEffect';
import cubeStyles from 'sass-boilerplate/stylesheets/components/launch/Cube.module.scss';

/**
 * Molecule component used to render cube type form list
 *
 * @param step
 * @param activeTypeForm
 * @param type
 * @param measurementType
 * @param handleTypeFormSelection
 * @param index
 * @param measurementName
 * @constructor
 */
const CubeTypeFormsList = ({
  step,
  activeTypeForm,
  type,
  measurementType,
  handleTypeFormSelection,
  index,
  measurementName = null
}) => {
  const dispatch = useDispatch();
  const cube = useSelector((store: IStore) => store.launchReducer.cube);
  const allocationValidated = cube.goals[index].validated.allocationType;
  const isGrowthDisabled = step === 'growth'; // Check if the option is "growth"
  let measurementTypeKey = '';

  if (measurementType) {
    measurementTypeKey =
      measurementName !== 'action'
        ? `.${getKeyByValue(MEASUREMENT_TYPES, measurementType).toLowerCase()}`
        : `.${getKeyByValue(MEASUREMENT_TYPES, 3).toLowerCase()}`;
  }

  useUpdateEffect(() => {
    dispatch(
      setLaunchDataStep({
        key: CUBE,
        value: {
          ...cube,
          frequencyAllocation: '',
          cubeValidated: {
            ...cube.cubeValidated,
            frequencyAllocation: false,
            spendType: false,
            validityPoints: false,
            rewardPeopleManagers: false
          }
        }
      })
    );
  }, [step, activeTypeForm]);

  let shouldDisplay = true;

  if (allocationValidated) {
    shouldDisplay = getAllocationTypeId(step, measurementType) === activeTypeForm;
  }

  return (
    <div className={isGrowthDisabled ? cubeStyles.disabledRadio : ''}>
      {shouldDisplay && (
        <>
          <CubeShowInfoRadio
            {...{
              handleSelection: isGrowthDisabled ? emptyFn() : handleTypeFormSelection, // Disable interaction for "growth"
              isSelected: getAllocationTypeId(step, measurementType) === activeTypeForm,
              translation: `launchProgram.cube.${step}.${type}${measurementTypeKey}`,
              step
            }}
          />
          {getAllocationTypeId(step, measurementType) === activeTypeForm && (
            <SpringAnimation settings={setTranslate(DELAY_INITIAL)}>
              <DynamicCubeComponent {...{ index, tag: step, activeTypeForm }} />
            </SpringAnimation>
          )}
        </>
      )}
    </div>
  );
};

export default CubeTypeFormsList;

