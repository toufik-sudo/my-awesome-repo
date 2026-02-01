// -----------------------------------------------------------------------------
// useVoiceflowScript Hook
// Migrated from old_app/src/hooks/iAScripts/useScript.ts
// Manages the Voiceflow chat overlay integration
// -----------------------------------------------------------------------------

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PickIntentExtension } from './extensions';
import type { RootState } from '@/store';

interface IUserData {
  id: number | string;
  firstName?: string;
  companyName?: string;
}

interface IVoiceflowConfig {
  projectId: string;
  url?: string;
  versionId?: string;
}

const DEFAULT_CONFIG: IVoiceflowConfig = {
  projectId: '664ef2559a1966af90eeadf4',
  url: 'https://general-runtime.voiceflow.com',
  versionId: 'development'
};

/**
 * Hook to load and configure Voiceflow chat overlay
 * @param scriptUrl - URL of the Voiceflow script to load
 * @param userData - User data for personalization
 * @param config - Optional Voiceflow configuration
 */
export const useVoiceflowScript = (
  scriptUrl: string,
  userData: IUserData | null,
  config: Partial<IVoiceflowConfig> = {}
) => {
  const selectedProgramId = useSelector((state: RootState & { wallReducer?: { selectedProgramId?: number } }) => 
    state.wallReducer?.selectedProgramId
  );

  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  useEffect(() => {
    if (!userData || !selectedProgramId) {
      console.warn('Voiceflow: Missing user data or program ID');
      return;
    }

    const userIdString = String(userData.id);
    const challengeId = String(selectedProgramId);

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    
    script.onload = function () {
      if (!window.voiceflow) {
        console.error('Voiceflow not loaded');
        return;
      }

      window.voiceflow.chat.load({
        verify: { projectID: finalConfig.projectId },
        url: finalConfig.url || DEFAULT_CONFIG.url!,
        versionID: finalConfig.versionId || DEFAULT_CONFIG.versionId!,
        userID: userIdString,
        launch: {
          event: {
            type: 'launch',
            payload: {
              user_name: userData.firstName || '',
              challenge_id: challengeId,
              company_id: userData.companyName || ''
            }
          }
        },
        render: {
          mode: 'overlay'
        },
        autostart: false,
        allowDangerousHTML: true,
        assistant: {
          extensions: [PickIntentExtension]
        }
      });
    };

    script.onerror = () => {
      console.error('Failed to load Voiceflow script');
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [scriptUrl, userData, selectedProgramId, finalConfig.projectId]);
};

export default useVoiceflowScript;
