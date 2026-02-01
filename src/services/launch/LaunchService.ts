// -----------------------------------------------------------------------------
// Launch Service
// Orchestrates program launch flow with API integration
// -----------------------------------------------------------------------------

import { launchApi } from '@/api/LaunchApi';
import { 
  constructQuickLaunchPayload, 
  constructFullLaunchPayload,
  ILaunchPayload 
} from '@/api/hooks/useLaunchApi';
import { QUICK, FULL } from '@/constants/wall/launch';

export interface ILaunchResult {
  success: boolean;
  programId?: number;
  error?: string;
}

/**
 * Constructs the appropriate payload based on program journey type
 */
export const constructLaunchPayload = (
  launchData: Record<string, any>, 
  tcUploadId?: string
): ILaunchPayload => {
  const programJourney = launchData.programJourney || QUICK;
  
  if (programJourney === FULL) {
    return constructFullLaunchPayload(launchData, tcUploadId);
  }
  
  return constructQuickLaunchPayload(launchData, tcUploadId);
};

/**
 * Launches a program with the provided launch data
 */
export const launchProgram = async (
  launchData: Record<string, any>,
  tcUploadId?: string
): Promise<ILaunchResult> => {
  try {
    const payload = constructLaunchPayload(launchData, tcUploadId);
    
    // Validate required fields
    if (!payload.name) {
      return { success: false, error: 'Program name is required' };
    }
    if (!payload.platformId) {
      return { success: false, error: 'Platform is required' };
    }
    
    const response = await launchApi.launchProgram(payload);
    
    return {
      success: true,
      programId: response.data?.id || response.data?.programId
    };
  } catch (error: any) {
    console.error('Failed to launch program:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to launch program'
    };
  }
};

/**
 * Updates an existing program
 */
export const updateProgram = async (
  launchData: Record<string, any>,
  tcUploadId?: string
): Promise<ILaunchResult> => {
  try {
    const payload = constructLaunchPayload(launchData, tcUploadId);
    
    const response = await launchApi.updateProgram(payload);
    
    return {
      success: true,
      programId: response.data?.id || response.data?.programId
    };
  } catch (error: any) {
    console.error('Failed to update program:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to update program'
    };
  }
};

export default {
  constructLaunchPayload,
  launchProgram,
  updateProgram
};
