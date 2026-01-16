// import { useMemo } from 'react';

// import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
// import { extractCubeAllocationMechanisms, getStyleForGoalDetails } from 'services/CubeServices';

// /**
//  * Hook used to handle cube data
//  * @param cube
//  * @param products
//  * @param onLaunc h
//  **/
// export const useCubeGoalsDetails = (cube, products, onLaunch) => {
//   const cubeData = cube || {};
//   const designColors = useSelectedProgramDesign(onLaunch);
//   const productNamesById = useMemo(
//     () =>
//       products.reduce((acc, product) => {
//         acc[product.id] = product.name;
//         return acc;
//       }, {}),
//     [products]
//   );

//   const cubeMechanisms = useMemo(() => extractCubeAllocationMechanisms(cubeData), [cubeData]);
//   const style = useMemo(() => getStyleForGoalDetails(designColors), [designColors]);

//   const { goals = [], correlatedGoals, correlated } = cubeData;

//   return {
//     goals,
//     correlatedGoals: correlatedGoals || correlated,
//     productNamesById,
//     cubeMechanisms,
//     style
//   };
// };


import { useMemo } from 'react';

import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { extractCubeAllocationMechanisms, getStyleForGoalDetails } from 'services/CubeServices';

/**
 * Hook used to handle cube data
 * @param cube
 * @param products
 * @param onLaunch
 **/
export const useCubeGoalsDetails = (cube, products, onLaunch) => {
  const cubeData = cube || {};
  const designColors = useSelectedProgramDesign(onLaunch);

  // Memoized map of product names by their ID
  const productNamesById = useMemo(
    () =>
      products.reduce((acc, product) => {
        acc[product.id] = product.name;
        return acc;
      }, {}),
    [products]
  );

  // Memoized array of product image URLs
  const productImagesUrls = useMemo(
    () => products.map((product) => product.imageUrl),
    [products]
  );

  // Memoize cube mechanisms and styles
  const cubeMechanisms = useMemo(() => extractCubeAllocationMechanisms(cubeData), [cubeData]);
  const style = useMemo(() => getStyleForGoalDetails(designColors), [designColors]);

  const { goals = [], correlatedGoals, correlated } = cubeData;

  return {
    goals,
    correlatedGoals: correlatedGoals || correlated,
    productNamesById,
    productImagesUrls,  // Return product images URLs
    cubeMechanisms,
    style
  };
};
