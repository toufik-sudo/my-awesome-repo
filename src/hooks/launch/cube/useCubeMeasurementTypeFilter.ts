/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
import { useDispatch, useSelector } from 'react-redux';

import { IStore } from 'interfaces/store/IStore';
// import { setFilteredMeasurementType } from 'store/actions/launchActions';
// import { getAcceptedMeasurementTypeArray, getUppercaseMeasurementTypeKeys } from 'services/CubeServices';
// import { useUpdateEffect } from 'hooks/general/useUpdateEffect';
// import { useState } from 'react';
import { ACTION, MEASUREMENT_NAMES, MEASUREMENT_TYPES, QUANTITY, VOLUME } from 'constants/wall/launch';

/**
 * Hook used to handle allocation filter
 *
 * @param index
 */
export const useCubeMeasurementTypeFilter = index => {
  // const dispatch = useDispatch();
  const { cube } = useSelector((store: IStore) => store.launchReducer);
  const currentMeasurementTypes = cube.goals[index].measurementTypesValid;
  const isDisabledMesurementTypes = {
    VOLUME: false,
    QUANTITY: false,
    ACTION: false
  };
  const setIsDesabled = () => {
    if (cube.acceptedCorrelatedGoals) {
      // const currentAcceptedMeasurementTypes = getAcceptedMeasurementTypeArray(cube);
      // const commonMeasurementTypes = getUppercaseMeasurementTypeKeys(currentAcceptedMeasurementTypes);
      // setFilteredMeasurementType(index, commonMeasurementTypes, dispatch, cube);
      if (cube.goals[index].specificProducts && cube.goals[index].productIds) {
        cube.goals[index].productIds.forEach(prodId => {
          if (cube.acceptedCorrelatedGoals[prodId]) {
            currentMeasurementTypes.forEach(mesurementType => {
              const mesurementTypeLowerCase = mesurementType.toLowerCase();
              if (
                (index == 2 &&
                  ((cube.goals[1]?.specificProducts && cube.goals[1]?.productIds.includes(prodId) &&
                    MEASUREMENT_NAMES[cube.goals[1]?.measurementType] == mesurementTypeLowerCase) ||
                    (cube.goals[0]?.specificProducts && cube.goals[0]?.productIds.includes(prodId) &&
                      MEASUREMENT_NAMES[cube.goals[0]?.measurementType] == mesurementTypeLowerCase))
                ) ||
                (index == 1 &&
                  cube.goals[0]?.specificProducts &&
                  MEASUREMENT_NAMES[cube.goals[0]?.measurementType] == mesurementTypeLowerCase
                )
              ) {
                if (mesurementTypeLowerCase == ACTION || mesurementTypeLowerCase == QUANTITY) {
                  isDisabledMesurementTypes['ACTION'] = true;
                  isDisabledMesurementTypes['QUANTITY'] = true;
                } else {
                  isDisabledMesurementTypes['VOLUME'] = true;
                }
              }
            });
          }
        });
      } else {
        currentMeasurementTypes.forEach(mesurementType => {
          const mesurementTypeLowerCase = mesurementType.toLowerCase();
          if (
            (index == 2 &&
              ((cube.goals[1]?.specificProducts &&
                MEASUREMENT_NAMES[cube.goals[1]?.measurementType] == mesurementTypeLowerCase) ||
                (cube.goals[0]?.specificProducts &&
                  MEASUREMENT_NAMES[cube.goals[0]?.measurementType] == mesurementTypeLowerCase))
            ) ||
            (index == 1 &&
              cube.goals[0]?.specificProducts &&
              MEASUREMENT_NAMES[cube.goals[0]?.measurementType] == mesurementTypeLowerCase
            )
          ) {
            if (mesurementTypeLowerCase == ACTION || mesurementTypeLowerCase == QUANTITY) {
              isDisabledMesurementTypes['ACTION'] = true;
              isDisabledMesurementTypes['QUANTITY'] = true;
            } else {
              isDisabledMesurementTypes['VOLUME'] = true;
            }
          }
        });
      }
    }
  };
  if (index != 0) {
    // setIsDesabled();
  }

  // useUpdateEffect(() => {
  //   if (index != 0) {
  //     setIsDesabled();
  //   }
  // }, [cube.acceptedCorrelatedGoals.goals]);

  return { currentMeasurementTypes, isDisabledMesurementTypes };
};
