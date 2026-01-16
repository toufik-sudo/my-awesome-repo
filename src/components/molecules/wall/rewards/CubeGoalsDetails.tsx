// import React from 'react';

// import GoalsCorrelation from 'components/atoms/wall/rewards/GoalsCorrelation';
// import GoalProducts from 'components/atoms/wall/rewards/GoalProducts';
// import DynamicGoalDetails from 'components/molecules/wall/rewards/DynamicGoalDetails';
// import CubeAllocationMechanisms from 'components/atoms/wall/rewards/CubeAllocationMechanisms';
// import { useCubeGoalsDetails } from 'hooks/wall/beneficiary/useCubeGoalDetails';
// import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
// import { HTML_TAGS } from 'constants/general';

// import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

// /**
//  * Component used to render goals block
//  * @param programType
//  * @param products
//  * @param cube
//  * @param isPeopleManager
//  * @param onLaunch
//  * @constructor
//  */
// const CubeGoalsDetails = ({ programType, products, cube, isPeopleManager, onLaunch = false }) => {
//   const { goals, correlatedGoals, productNamesById, cubeMechanisms, style } = useCubeGoalsDetails(
//     cube,
//     products,
//     onLaunch
//   );
//   const goalsCount = goals.length;
//   const { mt1, mb1, withBoldFont } = coreStyle;

//   if (!goals.length) {
//     return null;
//   }

//   return (
//     <>
//       <CubeAllocationMechanisms
//         {...{
//           mechanisms: cubeMechanisms,
//           programType,
//           correlatedGoals,
//           style
//         }}
//       />
//       <DynamicFormattedMessage
//         tag={HTML_TAGS.P}
//         id={`wall.intro.rewards.${correlatedGoals ? 'achieveAllGoals' : 'achieveGoals'}.${
//           isPeopleManager ? 'peopleManager' : 'user'
//         }`}
//       />
//       {goals.map((goal, index) => (
//         <div key={`goal_details_${index}`} className={`${mt1} ${mb1}`}>
//           <DynamicFormattedMessage
//             tag={HTML_TAGS.P}
//             id="wall.intro.rewards.goal"
//             className={withBoldFont}
//             values={{ index: index + 1 }}
//           />
//           <DynamicGoalDetails {...{ goal, programType, style }} />
//           <GoalProducts {...{ ...goal, productNamesById }} />
//           {index !== goalsCount - 1 && <GoalsCorrelation {...{ correlatedGoals, tag: HTML_TAGS.P, className: mt1 }} />}
//         </div>
//       ))}
//     </>
//   );
// };

// export default CubeGoalsDetails;


import React from 'react';

import GoalsCorrelation from 'components/atoms/wall/rewards/GoalsCorrelation';
import GoalProducts from 'components/atoms/wall/rewards/GoalProducts';
import DynamicGoalDetails from 'components/molecules/wall/rewards/DynamicGoalDetails';
import CubeAllocationMechanisms from 'components/atoms/wall/rewards/CubeAllocationMechanisms';
import { useCubeGoalsDetails } from 'hooks/wall/beneficiary/useCubeGoalDetails';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component used to render goals block
 * @param programType
 * @param products
 * @param cube
 * @param isPeopleManager
 * @param onLaunch
 * @constructor
 */
const CubeGoalsDetails = ({ programType, products, cube, isPeopleManager, onLaunch = false }) => {
  const { goals, correlatedGoals, productNamesById, productImagesUrls, cubeMechanisms, style } = useCubeGoalsDetails(
    cube,
    products,
    onLaunch
  );
  const goalsCount = goals.length;
  const { mt1, mb1, withBoldFont } = coreStyle;

  if (!goals.length) {
    return null;
  }

  return (
    <>
      {/* <CubeAllocationMechanisms
        {...{
          mechanisms: cubeMechanisms,
          programType,
          correlatedGoals,
          style
        }}
      /> */}
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        id={`wall.intro.rewards.${correlatedGoals ? 'achieveAllGoals' : 'achieveGoals'}.${
          isPeopleManager ? 'peopleManager' : 'user'
        }`}
      />
      {goals.map((goal, index) => (
        <div key={`goal_details_${index}`} className={`${mt1} ${mb1}`}>
          {/* <DynamicFormattedMessage
            tag={HTML_TAGS.P}
            id={"wall.intro.rewards.goal."+goal.measurementName+"."+goal.allocationType}
            className={withBoldFont}
            values={{ index: index + 1 }}
          /> */}

          {goal.measurementName && goal.allocationType && <DynamicFormattedMessage
            tag={HTML_TAGS.P}
            id={`wall.intro.rewards.goal.${goal.measurementName}.${goal.allocationType}`}
            className={withBoldFont}
            values={{
              index: index + 1,
              goalType: (
                <>
                  {goal.measurementName === "volume" && (
                    <span className={coreStyle.withThirdColor}>chiffres d'affaires</span>
                  )}
                  {goal.measurementName === "action" && (
                    <span className={coreStyle.withSecondaryColor}>actions</span>
                  )}
                  {goal.measurementName === "quantity" && (
                    <span className={coreStyle.withSecondaryColor}>volume de ventes</span>
                  )}
                </>
              )
            }}
            style={style[goal.measurementName]}
                     />}


          <DynamicGoalDetails {...{ goal, programType, style }} />
          <GoalProducts 
            productIds={goal.productIds} 
            productNamesById={productNamesById} 
            productImagesUrls={goal.productImagesUrls} 
          />
          {index !== goalsCount - 1 && <GoalsCorrelation {...{ correlatedGoals, tag: HTML_TAGS.P, className: mt1 }} />}
        </div>
      ))}
    </>
  );
};

export default CubeGoalsDetails;
