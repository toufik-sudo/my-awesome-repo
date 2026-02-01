// -----------------------------------------------------------------------------
// AI/Voiceflow Extensions
// Migrated from old_app/src/hooks/iAScripts/extentions.js
// Custom rendering logic for the Voiceflow AI assistant
// -----------------------------------------------------------------------------

declare global {
  interface Window {
    voiceflow?: {
      chat: {
        load: (config: VoiceflowConfig) => void;
        interact: (payload: { type: string; payload: Record<string, any> }) => void;
      };
    };
  }
}

interface VoiceflowConfig {
  verify: { projectID: string };
  url: string;
  versionID: string;
  userID: string;
  launch?: {
    event: {
      type: string;
      payload: Record<string, any>;
    };
  };
  render: { mode: string };
  autostart: boolean;
  allowDangerousHTML: boolean;
  assistant: {
    extensions: VoiceflowExtension[];
  };
}

interface VoiceflowTrace {
  type: string;
  payload: Array<{ id: string; text: string }> | { name: string };
}

interface VoiceflowExtension {
  name: string;
  type: string;
  match: (params: { trace: VoiceflowTrace }) => boolean;
  render: (params: { trace: VoiceflowTrace; element: HTMLElement }) => void;
}

/**
 * PickIntent Extension for Voiceflow
 * Renders custom buttons for intent selection
 */
export const PickIntentExtension: VoiceflowExtension = {
  name: 'PickIntent',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_pick_intent' || (trace.payload as { name: string })?.name === 'ext_pick_intent',
  render: ({ trace, element }) => {
    console.log('trace ==>', trace);

    const questions = Array.isArray(trace.payload) ? trace.payload : [];
    let buttons = '';
    
    questions.forEach((question) => {
      console.log('question==>', question);
      if (question) {
        buttons += `<button id='QUESTION_${question.id}' class="c-dzcdPv vfrc-button c-jjMiVY vfrc-button--secondary c-kCDKCe btn-youwin">${question.text}</button>`;
      }
    });

    const formContainer = document.createElement('div');

    console.log('buttons', buttons);

    formContainer.innerHTML = `
      <style>
        .vfrc-button {
          background-color: transparent;
          border: 2px solid #ccc;
          color: #333;
          padding: 5px 10px;
          margin: 5px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s, color 0.3s, border-color 0.3s;
        }

        .vfrc-button:hover {
          background-color: #f0f0f0;
          color: #555;
          border-color: #999;
        }
      </style>

      <div class="vfrc-system-response--actions">
        ${buttons}
      </div>
    `;

    element.appendChild(formContainer);

    const host = document.getElementById('voiceflow-chat');
    if (!host) return;

    const shadowRoot = host.shadowRoot || host.attachShadow({ mode: 'open' });

    questions.forEach((question) => {
      if (question) {
        const elementQuestion = shadowRoot.getElementById(`QUESTION_${question.id}`);
        if (elementQuestion) {
          elementQuestion.addEventListener('click', function (event) {
            event.preventDefault();
            console.log('Clicked on ', question);
            window.voiceflow?.chat.interact({
              type: 'complete',
              payload: { selected_question: question }
            });
          });
        }
      }
    });
  }
};

export default PickIntentExtension;
