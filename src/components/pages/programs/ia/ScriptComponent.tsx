import React, { useContext, useEffect } from 'react';
import { PickIntentExtension } from './extentions';
import { useUserData } from 'hooks/user/useUserData';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { UserContext } from 'components/App';

const ScriptComponent = ({ url }) => {
  const { userData } = useContext(UserContext);
  const { selectedProgramId } = useWallSelection();
  
  useEffect(() => {
    if (!userData || !selectedProgramId) {
      console.error("not yet");
      return;
    }
    console.log(userData)
    const userIdString = String(userData.id);
    const challenge_id = String(selectedProgramId);

    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onload = function() {
      window.voiceflow.chat.load({
        verify: { projectID: "661d402894e1d3ea286a918e" },
        url: 'https://general-runtime.voiceflow.com',
        versionID: 'development',
        userID: userIdString,
        launch: {
          event: {
            type: "launch",
            payload: {
              user_name: userData.firstName,
              challenge_id: challenge_id,
              company_id: userData.companyName
            }
          }
        },
        render: {
          mode: 'overlay',
        },
        autostart: false,
        allowDangerousHTML: true,
        assistant: {
          extensions: [
            PickIntentExtension
          ],
        }
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url, userData, selectedProgramId]);

  return <p>BRBRBR</p>;
};

export default ScriptComponent;
