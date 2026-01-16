import React, { useEffect, useRef, useState } from 'react';

const LOCAL_STORAGE_KEY = 'audio-button-position';

const FloatingAudioToggle = ({ muted, togglePlayPause, currentAudio, isTalking, isMuted }) => {
  const [position, setPosition] = useState({ x: 360, y: 25 });
  const buttonRef = useRef < HTMLDivElement > (null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // Fonction pour gérer le bouton Play/Pause
  const setPlayPause = (mutedParam) => {
    togglePlayPause(mutedParam);
    console.log('currentAudio: ', currentAudio);
    if (currentAudio !== null) {
      console.log('Audio muted: ', muted);
      console.log('Audio mutedParam: ', mutedParam);
      if (!mutedParam) {
        currentAudio.pause(); // Met l'audio en pause
        // setIsTalking(false); // Met à jour l'état de lecture
        isTalking = false; // Met à jour l'état de lecture
        console.log('Audio mis en pause');
      } else {
        currentAudio.play(); // Reprend la lecture
        // setIsTalking(true); // Met à jour l'état de lecture
        isTalking = true; // Met à jour l'état de lecture
        console.log('Audio repris');
      }
    }
    // else {
    //   // setIsTalking(false); // Met à jour l'état de lecture
    //   isTalking = false; // Met à jour l'état de lecture
    // }
  };

  useEffect(() => {
    // const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    // if (saved) {
    //   setPosition(JSON.parse(saved));
    // } else {
    //   // Sélectionnez l'élément hôte par son ID
    //   const hostElement = document.getElementById('voiceflow-chat');
    //   // Vérifiez si l'élément hôte existe et a un shadowRoot
    //   if (hostElement && hostElement.shadowRoot) {
    //     // Accédez au shadowRoot
    //     const shadowRoot = hostElement.shadowRoot;
    //     // Sélectionnez le bouton dans le shadow DOM
    //     const btnCloseIa = shadowRoot.querySelector('.s9t60i0');
    //     if (btnCloseIa) {
    //       console.log('btnCloseIa found:', btnCloseIa);
    //       setPosition({
    //         x: btnCloseIa.getBoundingClientRect().left,
    //         y: btnCloseIa.getBoundingClientRect().top + 16,
    //       });
    //     }
    //   } else {
    //     console.log('L\'élément hôte ou le shadowRoot n\'existe pas.');
    //   }
    // }
    
    // Sélectionnez l'élément hôte par son ID
    const hostElement = document.getElementById('voiceflow-chat');
    // Vérifiez si l'élément hôte existe et a un shadowRoot
    if (hostElement && hostElement.shadowRoot) {
      // Accédez au shadowRoot
      const shadowRoot = hostElement.shadowRoot;
      // Sélectionnez le bouton dans le shadow DOM
      const btnCloseIa = shadowRoot.querySelector('.s9t60i0');
      if (btnCloseIa) {
        console.log('btnCloseIa found:', btnCloseIa);
        setPosition({
          x: btnCloseIa.getBoundingClientRect().left,
          y: btnCloseIa.getBoundingClientRect().top + 16,
        });
      }
    } else {
      console.log('L\'élément hôte ou le shadowRoot n\'existe pas.');
    }

  }, []);

  useEffect(() => {
    const audioEls = document.querySelectorAll('audio, video');
    audioEls.forEach((el: any) => {
      el.muted = muted;
    });
  }, [muted]);

  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(position));
  // }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      offset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onClick={() => setPlayPause(muted)}
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        width: 50,
        height: 50,
        backgroundColor: 'whitesmoke',
        border: '2px solid rgb(227 25 230)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'move',
        zIndex: 1000000,
        boxShadow: '0px 0px 10px rgba(0,0,0,0.3)',
      }}
    >
      {muted ? '🔇' : '🔊'}
    </div>
  );
};

export default FloatingAudioToggle;
