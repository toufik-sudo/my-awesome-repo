import React from 'react';
import ObjectivesSummaryCard from './ObjectivesSummaryCard';
import GoalsCorrelation from 'components/atoms/wall/rewards/GoalsCorrelation';
import { useCubeGoalsDetails } from 'hooks/wall/beneficiary/useCubeGoalDetails';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { buildEmbbededHtmlPart } from 'services/IntlServices';
import style from 'sass-boilerplate/stylesheets/components/wall/ObjectivesSummary.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

interface IEnhancedObjectivesSummaryProps {
  programDetails: any;
  isPeopleManager?: boolean;
  onLaunch?: boolean;
  colorAccent?: string;
}

/**
 * Enhanced objectives summary component with improved visual design
 * Uses test data from programDetails.json structure
 */
const EnhancedObjectivesSummary: React.FC<IEnhancedObjectivesSummaryProps> = ({
  programDetails,
  isPeopleManager = false,
  onLaunch = false,
  colorAccent
}) => {
  const {
    objectivesSummaryContainer,
    objectivesSummaryHeader,
    headerIcon,
    headerTitle,
    goalsCount,
    programTypeInfo,
    emptyGoals,
    emptyIcon,
    emptyText,
    correlationIndicator,
    correlationIcon
  } = style;

  const {
    cube = {},
    products = [],
    fullProducts = [],
    fullCategoriesProducts = [],
    type,
    design
  } = programDetails;

  const selectedProducts = [...products, ...fullProducts, ...fullCategoriesProducts];
  const programType = type;
  const accentColor = colorAccent || design?.colorMainButtons || '#EC407A';

  const { goals, correlatedGoals, productNamesById } = useCubeGoalsDetails(
    cube,
    selectedProducts,
    onLaunch
  );

  const getProgramTypeName = (type: number) => {
    switch (type) {
      case 1:
        return 'Challenge';
      case 2:
        return 'Fidélité';
      case 3:
        return 'Parrainage';
      default:
        return 'Programme';
    }
  };

  if (!goals || goals.length === 0) {
    return (
      <div className={objectivesSummaryContainer}>
        <div className={emptyGoals}>
          <span className={emptyIcon}>🎯</span>
          <span className={emptyText}>Aucun objectif défini pour ce programme</span>
        </div>
      </div>
    );
  }

  return (
    <div className={objectivesSummaryContainer}>
      {/* Summary header */}
      <div className={objectivesSummaryHeader}>
        <span className={headerIcon}>🎯</span>
        <span className={headerTitle}>Objectifs du programme</span>
        <span className={goalsCount}>{goals.length} objectif{goals.length > 1 ? 's' : ''}</span>
      </div>

      {/* Program type info */}
      {programType && (
        <div className={programTypeInfo}>
          <DynamicFormattedMessage
            tag={HTML_TAGS.P}
            id="wall.intro.rewards.programType"
            values={{
              programType,
              strong: buildEmbbededHtmlPart({ tag: HTML_TAGS.STRONG })
            }}
          />
        </div>
      )}

      {/* Achievement message */}
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        id={`wall.intro.rewards.${correlatedGoals ? 'achieveAllGoals' : 'achieveGoals'}.${
          isPeopleManager ? 'peopleManager' : 'user'
        }`}
        className={coreStyle.mb1}
      />

      {/* Goals cards */}
      {goals.map((goal, index) => (
        <React.Fragment key={`goal_card_${index}`}>
          <ObjectivesSummaryCard
            goal={goal}
            index={index}
            productNamesById={productNamesById}
            colorAccent={accentColor}
          />
          
          {/* Correlation indicator between goals */}
          {index < goals.length - 1 && (
            <div className={correlationIndicator}>
              <span className={correlationIcon}>
                {correlatedGoals ? '⬇️ ET' : '⬇️ OU'}
              </span>
              <GoalsCorrelation 
                correlatedGoals={correlatedGoals} 
                tag={HTML_TAGS.SPAN}
              />
            </div>
          )}
        </React.Fragment>
      ))}

      {/* Manager bonus info */}
      {!isPeopleManager && cube.rewardPeopleManagerAccepted && (
        <div className={programTypeInfo}>
          <DynamicFormattedMessage
            id="wall.intro.rewards.programManager"
            values={{ value: cube.rewardPeopleManagers }}
            tag={HTML_TAGS.SPAN}
          />
        </div>
      )}

      {isPeopleManager && cube.rewardPeopleManagerAccepted && (
        <div className={programTypeInfo}>
          <DynamicFormattedMessage
            id="wall.intro.rewards.programManagerPeopleManager"
            values={{ value: cube.rewardPeopleManagers }}
            tag={HTML_TAGS.SPAN}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedObjectivesSummary;
