/* eslint-disable quotes */
/* eslint-disable no-empty */
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { filterAllocationTypes } from 'services/CubeServices';
import { ALLOCATION_TYPES, MEASUREMENT_TYPES } from 'constants/wall/launch';
import { IStore } from 'interfaces/store/IStore';
import { setFilteredAllocationType } from 'store/actions/launchActions';

/**
 * Hook used to handle allocation filter
 *
 * @param index
 */
export const useCubeAllocationTypeFilter = index => {
  const dispatch = useDispatch();
  const { cube } = useSelector((store: IStore) => store.launchReducer);
  const currentGoal = cube.goals[index];
  if (currentGoal.measurmentType == 3) {
    currentGoal.measurmentType = 1;
  }

  const setAcceptedGoals = () => {
    const accepted = cube.acceptedCorrelatedGoals;
    if (
      (Array.isArray(accepted) && cube.acceptedCorrelatedGoals.length > 0) ||
      (!Array.isArray(accepted) && Object.keys(accepted))
    ) {
      let filteredAllocationTypes = [];
      if (currentGoal.specificProducts) {
        const currentProductId = currentGoal.productIds;
        for (let i = 0; i < currentProductId.length; i++) {
          const product = currentProductId[i];
          let filtered = [];
          if (!cube.acceptedCorrelatedGoals[product]) {
            filtered = filterAllocationTypes(
              ALLOCATION_TYPES,
              [],
              currentGoal.measurementType || MEASUREMENT_TYPES.QUANTITY,
              0
            );
            // filteredAllocationTypes = filteredAll;
            // setFilteredAllocationType(index, [], dispatch, cube);
            // break;
          } else {
            filtered = filterAllocationTypes(
              ALLOCATION_TYPES,
              cube.acceptedCorrelatedGoals[product],
              currentGoal.measurementType || MEASUREMENT_TYPES.QUANTITY,
              index
            );
          }
          if (filtered.length == 0) {
            filteredAllocationTypes = [];
            // setFilteredAllocationType(index, [], dispatch, cube);
            break;
          }
          if (filteredAllocationTypes.length == 0) {
            filteredAllocationTypes = filtered;
          } else {
            filteredAllocationTypes = filteredAllocationTypes.filter(elem => filtered.some(f => f == elem));
          }
        }
      } else {
        let filtered = [];
        if (!cube.acceptedCorrelatedGoals['noProducts']) {
          // setFilteredAllocationType(index, [], dispatch, cube);
          filtered = filterAllocationTypes(
            ALLOCATION_TYPES,
            [],
            currentGoal.measurementType || MEASUREMENT_TYPES.QUANTITY,
            0
          );
          // return;
        } else {
          filtered = filterAllocationTypes(
            ALLOCATION_TYPES,
            cube.acceptedCorrelatedGoals['noProducts'],
            currentGoal.measurementType || MEASUREMENT_TYPES.QUANTITY,
            index
          );
        }
        if (filteredAllocationTypes.length == 0) {
          filteredAllocationTypes = filtered;
        } else {
          filteredAllocationTypes = filteredAllocationTypes.filter(elem => filtered.some(f => f == elem));
        }
      }
      setFilteredAllocationType(index, filteredAllocationTypes, dispatch, cube);
      // return;
    } else {
      const filtered = filterAllocationTypes(
        ALLOCATION_TYPES,
        cube.acceptedCorrelatedGoals,
        currentGoal.measurementType || MEASUREMENT_TYPES.QUANTITY,
        index
      );
      setFilteredAllocationType(index, filtered, dispatch, cube);
      // return;
    }
  };

  useEffect(() => {
    // const filteredAllocationTypes = filterAllocationTypes(
    //   ALLOCATION_TYPES,
    //   cube.acceptedCorrelatedGoals,
    //   currentGoal.measurementType || MEASUREMENT_TYPES.QUANTITY,
    //   index
    // );
    // setFilteredAllocationType(index, filteredAllocationTypes, dispatch, cube);
    setAcceptedGoals();
    console.log()
  }, [currentGoal.measurementType]);
};
