export const PickIntentExtension = {
    name: 'PickIntent',
    type: 'response',
    match: ({ trace }) =>
      trace.type === 'ext_pick_intent' || trace.payload.name === 'ext_pick_intent',
    render: ({ trace, element }) => {
  
      console.log('trace ==>', trace)
  
      let buttons = ""
      trace.payload.forEach( (question) => {
          console.log('question==>', question)
          if(question){
              buttons = buttons + `<button id='QUESTION_${question.id}' class="c-dzcdPv vfrc-button c-jjMiVY vfrc-button--secondary c-kCDKCe btn-youwin">${question.text}</button>`
          }
      })
  
      const formContainer = document.createElement('div')
  
      console.log('buttons', buttons)
  
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
          `
  
      element.appendChild(formContainer)
  
      const host = document.getElementById('voiceflow-chat');
      const shadowRoot = host.shadowRoot || host.attachShadow({ mode: 'open' });
  
      trace.payload.forEach( (question) => {
          if(question){
              const elementQuestion = shadowRoot.getElementById(`QUESTION_${question.id}`)
              elementQuestion.addEventListener(`click`, function (event) {
              event.preventDefault()
              console.log('Clicked on ', question)
              window.voiceflow.chat.interact({
                  type: 'complete',
                  payload: { "selected_question": question }
              })
              })
          }})
  
    },
  }
  
  