import {
  processLaunchSteps,
  getOnlyQuickLaunchSteps,
  getAvailableStatus,
  processBarItemStyle
} from 'services/LaunchServices';
import { LAUNCH_STEP_TYPES, FULL_LAUNCH_AVAILABLE_STEPS, QUICK_LAUNCH_AVAILABLE_STEPS } from 'constants/wall/launch';
import {
  LaunchQuickProgramMock,
  MockFullLaunchContentsStep,
  MockFullLaunchDesignStep,
  MockFullLaunchFinalStep,
  MockFullLaunchProductsStep,
  MockFullLaunchProgramStep,
  MockFullLaunchResultsStep,
  MockFullLaunchRewardsFullStep,
  MockFullLaunchUsersStep,
  MockQuickLaunchFinalStep,
  MockQuickLaunchProgramStep,
  MockQuickLaunchRewardsStep,
  MockQuickLaunchUserstStep,
  MockGetAvailableStatus,
  MockProcessBarItemStyle,
  MockResponseProcessBarItemStyle
} from '__mocks__/lauchServicesMocks';

describe('This function processes launch steps and sets the availability on each step', () => {
  test('Test if the function return all the steps', () => {
    expect(processLaunchSteps(LAUNCH_STEP_TYPES, '')).toStrictEqual(LaunchQuickProgramMock);
  });

  test('Test if the function return the correct response for PROGRAM step', () => {
    expect(processLaunchSteps(LAUNCH_STEP_TYPES, FULL_LAUNCH_AVAILABLE_STEPS[0])).toStrictEqual(
      MockFullLaunchProgramStep
    );
  });

  test('Test if the function return the correct response for USERS step', () => {
    expect(processLaunchSteps(LAUNCH_STEP_TYPES, FULL_LAUNCH_AVAILABLE_STEPS[1])).toStrictEqual(
      MockFullLaunchUsersStep
    );
  });

  test('Test if the function return the correct response for PRODUCTS step', () => {
    expect(processLaunchSteps(LAUNCH_STEP_TYPES, FULL_LAUNCH_AVAILABLE_STEPS[2])).toStrictEqual(
      MockFullLaunchProductsStep
    );
  });

  test('Test if the function return the correct response for RESULTS step', () => {
    expect(processLaunchSteps(LAUNCH_STEP_TYPES, FULL_LAUNCH_AVAILABLE_STEPS[3])).toStrictEqual(
      MockFullLaunchResultsStep
    );
  });

  test('Test if the function return the correct response for REWARDS_FULL step', () => {
    expect(processLaunchSteps(LAUNCH_STEP_TYPES, FULL_LAUNCH_AVAILABLE_STEPS[4])).toStrictEqual(
      MockFullLaunchRewardsFullStep
    );
  });

  test('Test if the function return the correct response for DESIGN step', () => {
    expect(processLaunchSteps(LAUNCH_STEP_TYPES, FULL_LAUNCH_AVAILABLE_STEPS[5])).toStrictEqual(
      MockFullLaunchDesignStep
    );
  });

  test('Test if the function return the correct response for CONTENTS step', () => {
    expect(processLaunchSteps(LAUNCH_STEP_TYPES, FULL_LAUNCH_AVAILABLE_STEPS[6])).toStrictEqual(
      MockFullLaunchContentsStep
    );
  });

  test('Test if the function return the correct response for FINAL step', () => {
    expect(processLaunchSteps(LAUNCH_STEP_TYPES, FULL_LAUNCH_AVAILABLE_STEPS[7])).toStrictEqual(
      MockFullLaunchFinalStep
    );
  });
});

describe('This function returns only the quick launch steps', () => {
  test('Test if the function return an empty string if the step parameter is empty', () => {
    expect(getOnlyQuickLaunchSteps(LAUNCH_STEP_TYPES, '')).toStrictEqual([]);
  });

  test('Test if the function return for step PROGRAM', () => {
    expect(getOnlyQuickLaunchSteps(LAUNCH_STEP_TYPES, QUICK_LAUNCH_AVAILABLE_STEPS[0])).toStrictEqual(
      MockQuickLaunchProgramStep
    );
  });

  test('Test if the function return for step USERS', () => {
    expect(getOnlyQuickLaunchSteps(LAUNCH_STEP_TYPES, QUICK_LAUNCH_AVAILABLE_STEPS[1])).toStrictEqual(
      MockQuickLaunchUserstStep
    );
  });

  test('Test if the function return for step REWARDS', () => {
    expect(getOnlyQuickLaunchSteps(LAUNCH_STEP_TYPES, QUICK_LAUNCH_AVAILABLE_STEPS[2])).toStrictEqual(
      MockQuickLaunchRewardsStep
    );
  });

  test('Test if the function return for step FINAL', () => {
    expect(getOnlyQuickLaunchSteps(LAUNCH_STEP_TYPES, QUICK_LAUNCH_AVAILABLE_STEPS[3])).toStrictEqual(
      MockQuickLaunchFinalStep
    );
  });
});

describe('This function returns boolean on each step if it is available', () => {
  test('Test if the function s response is false', () => {
    expect(getAvailableStatus(1, LAUNCH_STEP_TYPES, 0)).toStrictEqual(MockGetAvailableStatus);
  });
});

describe('This function returns style based on the current state', () => {
  test('Test if the function s response is undefined', () => {
    const styleResponse = processBarItemStyle(
      MockProcessBarItemStyle.stopDetail,
      MockProcessBarItemStyle.index,
      MockProcessBarItemStyle.style
    );
    expect(styleResponse).toStrictEqual(MockResponseProcessBarItemStyle);
  });
});
