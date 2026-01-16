/* eslint-disable quotes */
import React from 'react';
import { useParams, useHistory } from 'react-router';

import ProgressBarList from 'components/molecules/launch/ProgressBarList';
import MultiStepButtons from 'components/molecules/launch/MultiStepButtons';
import { getActiveStepComponent } from 'services/LaunchServices';
import { PAGE_NOT_FOUND } from 'constants/routes';
import { useValidIndexStep } from 'hooks/launch/useValidIndexStep';

import LaunchProgramType from 'components/molecules/launch/program/LaunchProgramType';
import LaunchProgramConfidentiality from 'components/pages/LaunchProgramConfidentialityPage';
import LaunchProgramParameters from 'components/pages/LaunchProgramParametersPage';
import LaunchProgramUsersUploadTemplate from 'components/templates/LaunchProgramUsersUpload.template';
import ParticipantsInvitation from 'components/organisms/launch/userInviteInfo/UserInvitationSection';
import UserValidationSection from 'components/organisms/launch/userValidation/UserValidationSection';
import GoalOptionsPage from 'components/pages/launch/GoalOptionsPage';
import ProductsPage from 'components/pages/ProductsPage';
import FinalStepPage from 'components/pages/FinalStepPage';
import ProductsIntermediaryPage from 'components/organisms/launch/products/ProductsIntermediaryPage';
import ResultsPage from 'components/pages/ResultsPage';
import ResultsRequiredInformation from 'components/pages/ResultsRequiredInformation';
import ResultsValidation from 'components/pages/ResultsValidation';
import RewardsIntermediaryPage from 'components/organisms/launch/rewards/RewardsIntermediaryPage';
import ContentsPage from 'components/pages/ContentsPage';
import DesignPage from 'components/pages/DesignPage';
import DesignIdentificationPage from 'components/pages/DesignIdentificationPage';
import FullCubePage from 'components/pages/FullCubePage';
import RewardsGoalRelationsPage from 'components/pages/RewardsGoalRelationsPage';
import SocialNetworksPage from 'components/pages/SocialNetworksPage';
import CubeOptionsPage from 'components/pages/CubeOptionsPage';
import GoalsOptionsPreview from 'components/pages/launch/GoalsOptionsPreview';
import { LAUNCH_STEP_COMPONENTS } from 'constants/wall/launch';
import EcardPage from 'components/pages/EcardPage';
import { IStore } from 'interfaces/store/IStore';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import BannerPreview from './BannerPreview';
import SelectAiPage from 'components/pages/programs/ia/SelectAiPage';


const LAUNCH_COMPONENT_MAPPING = {
  [LAUNCH_STEP_COMPONENTS.LAUNCH_PROGRAM_TYPE]: LaunchProgramType,
  [LAUNCH_STEP_COMPONENTS.LAUNCH_PROGRAM_CONFIDENTIALITY]: LaunchProgramConfidentiality,
  [LAUNCH_STEP_COMPONENTS.LAUNCH_PROGRAM_PARAMETERS]: LaunchProgramParameters,
  [LAUNCH_STEP_COMPONENTS.LAUNCH_PROGRAM_USERS_UPLOAD_TEMPLATE]: LaunchProgramUsersUploadTemplate,
  [LAUNCH_STEP_COMPONENTS.PARTICIPANTS_INVITATION]: ParticipantsInvitation,
  [LAUNCH_STEP_COMPONENTS.USER_VALIDATION_SECTION]: UserValidationSection,
  [LAUNCH_STEP_COMPONENTS.GOAL_OPTIONS_PAGE]: GoalOptionsPage,
  [LAUNCH_STEP_COMPONENTS.GOAL_OPTIONS_PAGE_PREVIEW]: GoalsOptionsPreview,
  [LAUNCH_STEP_COMPONENTS.PRODUCTS_PAGE]: ProductsPage,
  [LAUNCH_STEP_COMPONENTS.FINAL_STEP_PAGE]: FinalStepPage,
  [LAUNCH_STEP_COMPONENTS.PRODUCTS_INTERMEDIARY_PAGE]: ProductsIntermediaryPage,
  [LAUNCH_STEP_COMPONENTS.RESULTS_PAGE]: ResultsPage,
  [LAUNCH_STEP_COMPONENTS.RESULTS_REQUIRED_INFORMATION]: ResultsRequiredInformation,
  [LAUNCH_STEP_COMPONENTS.RESULTS_VALIDATION]: ResultsValidation,
  [LAUNCH_STEP_COMPONENTS.REWARDS_INTERMEDIARY_PAGE]: RewardsIntermediaryPage,
  [LAUNCH_STEP_COMPONENTS.CONTENTS_PAGE]: ContentsPage,
  [LAUNCH_STEP_COMPONENTS.ECARD_PAGE]: EcardPage,
  [LAUNCH_STEP_COMPONENTS.AI_PAGE]: SelectAiPage,
  [LAUNCH_STEP_COMPONENTS.DESIGN_PAGE]: DesignPage,
  [LAUNCH_STEP_COMPONENTS.DESIGN_IDENTIFICATION_PAGE]: DesignIdentificationPage,
  [LAUNCH_STEP_COMPONENTS.FULL_CUBE_PAGE]: FullCubePage,
  [LAUNCH_STEP_COMPONENTS.REWARDS_GOAL_RELATIONS_PAGE]: RewardsGoalRelationsPage,
  [LAUNCH_STEP_COMPONENTS.SOCIAL_NETWORKS_PAGE]: SocialNetworksPage,
  [LAUNCH_STEP_COMPONENTS.CUBE_OPTIONS_PAGE]: CubeOptionsPage,
};



/**
 * Main component used to render multi step wizard
 *
 * @constructor
 */
const MultiStepWrapper = () => {
  const launchStoreData = useSelector((store: IStore) => store.launchReducer);
  const history = useHistory();
  const { step, stepIndex } = useParams();
  console.log("step:" + step + "  Step INDEX : " + stepIndex)
  const isIndexIsValid = useValidIndexStep();
  if (isIndexIsValid) {
    history.replace(PAGE_NOT_FOUND);

    return null;
  }
  const activeStepComponentId = getActiveStepComponent(step, stepIndex, launchStoreData.isModify);
  const CurrentComponent = LAUNCH_COMPONENT_MAPPING[activeStepComponentId];


  const [highlightedIndex, setHighlightedIndex] = useState(0);



  useEffect(() => {
    // Calculate the highlighted index based on stepIndex
    let newIndex = 0;
    if (stepIndex > 1 && stepIndex <= 5 && step === "contents") {
      // Logic to map stepIndex to highlightedIndex
      newIndex = stepIndex - 2; // Subtract 2 to map stepIndex to array index
    }
    setHighlightedIndex(newIndex);
  }, [stepIndex, step]);

  return (
    <div>
      <ProgressBarList />
      <CurrentComponent />
      {/* {stepIndex > 1 && stepIndex <= 5 && step === 'contents' && (
        <BannerPreview highlightedIndex={highlightedIndex} />
      )} */}
      <MultiStepButtons />


    </div>
  );
}
export default MultiStepWrapper;
