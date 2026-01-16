import React, { useEffect, useRef, useState, useCallback, useContext } from "react";
import { Play, Pause, Square, Volume2 } from 'lucide-react';

import GeneralBlock from "components/molecules/block/GeneralBlock";
import { DynamicFormattedMessage } from "components/atoms/ui/DynamicFormattedMessage";
import { HTML_TAGS } from "constants/general";
import { useSelectedProgramDesign } from "hooks/wall/ui/useSelectedProgramColors";

import coreStyle from "sass-boilerplate/stylesheets/style.module.scss";
import wallStyle from "sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss";
import wallBaseStyle from "sass-boilerplate/stylesheets/components/wall/WallBaseBlock.module.scss";
import widgetStyle from "sass-boilerplate/stylesheets/components/wall/widgets/Widget.module.scss";
import { WALL_BLOCK } from "constants/wall/blocks";
import { useWallSelection } from "hooks/wall/useWallSelection";
import { CHALLENGE, FREEMIUM } from "constants/routes";
import { PROGRAM_TYPES, PROGRAM_TYPES_NAMES } from "constants/wall/launch";
import useSelectedProgram from "hooks/wall/useSelectedProgram";
import postTabStyle from "sass-boilerplate/stylesheets/components/wall/PostTabs.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faLaptopHouse, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { useUserRole } from "hooks/user/useUserRole";
import { getUserAuthorizations, isAnyKindOfAdmin, isUserBeneficiary } from "services/security/accessServices";
import { useCheckAndRedirect } from "hooks/user/useCheckAndRedirect";
import useProgramDetails from "hooks/programs/useProgramDetails";
import componentStyle from "sass-boilerplate/stylesheets/components/landing/FeatureElement.module.scss";

import iaStyle from "sass-boilerplate/stylesheets/components/ia/AiStyle.module.scss";
import { UserContext } from "components/App";
import { PickIntentExtension } from "./extentions";
import { IStore } from "interfaces/store/IStore";
import { useSelector } from "react-redux";
import FloatingAudioToggle from "./FloatingAudioToggle";
import { boolean } from "@storybook/addon-knobs";

const { cardContent, cardIcon, designVisible } = componentStyle;


const ContactUsWidget = ({ modifyProgramDesign }) => {
  const { pb2, withBoldFont, withGrayAccentColor, textCenter, pointer, widthFull } = coreStyle;
  const { widgetTitle, widgetTextBody, widgetContact, blockContactUs } = widgetStyle;
  const { colorWidgetTitle } = useSelectedProgramDesign();
  const { selectedProgramId, programDetails, didLoad } = useWallSelection();

  const { iaWidgetStyle } = iaStyle;

  const selectedProgram = useSelectedProgram();
  const isFreemium = selectedProgram && selectedProgram.programType === PROGRAM_TYPES[FREEMIUM];
  const { postIcon, modifyProgram } = postTabStyle;
  const role = useUserRole();
  const userRights = getUserAuthorizations(role);
  const isAnyAdmin = isAnyKindOfAdmin(userRights);
  const isBeneficiary = isUserBeneficiary(role);
  const bootRef = useRef(null);
  const [currentProgramId, setCurrentProgramId] = useState < number | null > (null);
  const [projectId, setProjectId] = useState < string | null > (null);
  const { onRewardsRedirect } = useCheckAndRedirect();
  // const programDetail = useProgramDetails(selectedProgramId);
  const [showcog, setShowCog] = useState(true);
  const [showSound, setShowSound] = useState(false);
  const { userData } = useContext(UserContext);
  const [muted, setMuted] = useState(null);
  const [isAudioOn, setIsAudioOn] = useState(false);

  // const [isTalking, setIsTalking] = useState(false);
  // const [audioDataList, setAudioDataList] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null); // Référence à l'audio en cours de lecture
  const [isFirstAudioChunck, setIsFirstAudioChunck] = useState(false);
  const [audioIndex, setAudioIndex] = useState(0); // Initialisation de l'itérateur
  // const [prevPosition, setPrevPosition] = useState(0); // Initialisation de l'itérateur

  // const audioIndexRef = useRef(audioIndex);
  // const currentAudioRef = useRef(currentAudio);
  // const audioDataListRef = useRef(audioDataList);
  // const isFirstAudioChunckRef = useRef(isFirstAudioChunck);
  // const isTalkingRef = useRef(isTalking);
  // const prevPositionRef = useRef(prevPosition);

  let audioDataList = [];
  let prevPosition = 0; // Variable pour suivre la position précédente
  let isTalking = false; // Variable pour suivre si l'audio est en cours de lecture
  // let currentAudio = null; // Référence à l'audio en cours de lecture
  let isMuted = false; // Variable pour suivre si l'audio est en mode muet

  const [speakerWav, setSpeakerWav] = useState("telechargement3.wav");

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('Bonjour, ceci est un test de synthèse vocale en streaming.');
  const [error, setError] = useState(null);
  const [chunkCount, setChunkCount] = useState(0);
  const [firstChunkTime, setFirstChunkTime] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [bufferHealth, setBufferHealth] = useState('good');

  // Refs pour l'audio
  const audioContextRef = useRef(null);
  const workletNodeRef = useRef(null);
  const scriptNodeRef = useRef(null);
  const isPlayingRef = useRef(false);
  const abortControllerRef = useRef(null);
  const startTimeRef = useRef(0);
  const bufferQueueRef = useRef([]);

  // Configuration optimisée
  const SAMPLE_RATE = process.env.REACT_APP_SAMPLE_RATE;
  const CHANNELS = process.env.REACT_APP_CHANNELS;
  const CHUNK_SIZE = process.env.REACT_APP_CHUNK_SIZE; // Plus gros chunks pour plus de stabilité
  const OUTPUT_CHUNK_SIZE = process.env.REACT_APP_OUTPUT_CHUNK_SIZE; // Plus gros chunks pour plus de stabilité
  const WORKLET_CHUNK_SIZE = process.env.REACT_APP_WORKLET_CHUNK_SIZE; // Taille pour envoyer au worklet
  const MIN_BUFFER_SIZE = process.env.REACT_APP_MIN_BUFFER_SIZE; // Buffer minimum avant de commencer
  const MAX_BUFFER_SIZE = process.env.REACT_APP_MAX_BUFFER_SIZE; // Buffer maximum pour éviter la surcharge

  const url = "/api/tts_dual_workers_fixed";

  // Split et envoie optimisé
  const splitAndSend = useCallback((float32, chunkSize = WORKLE & T_CHUNK_SIZE) => {
    if (!workletNodeRef.current) return;

    // Envoyer par petits chunks pour éviter la latence
    for (let i = 0; i < float32.length; i += chunkSize) {
      const slice = float32.subarray(i, Math.min(i + chunkSize, float32.length));
      if (slice.length > 0) {
        workletNodeRef.current.port.postMessage({
          type: "chunk",
          samples: slice
        });
      }
    }
  }, []);

  // Fallback ScriptProcessor optimisé
  const setupScriptProcessor = useCallback(() => {
    if (!audioContextRef.current) return;

    const bufferSize = 1024; // Plus petit buffer pour moins de latence
    scriptNodeRef.current = audioContextRef.current.createScriptProcessor(bufferSize, 1, 1);

    scriptNodeRef.current.onaudioprocess = (event) => {
      const output = event.outputBuffer.getChannelData(0);

      if (bufferQueueRef.current.length > 0) {
        const chunk = bufferQueueRef.current.shift();
        const copyLength = Math.min(chunk.length, output.length);

        for (let i = 0; i < copyLength; i++) {
          output[i] = chunk[i];
        }

        // Remplir le reste avec du silence si nécessaire
        for (let i = copyLength; i < output.length; i++) {
          output[i] = 0;
        }
      } else {
        output.fill(0);
      }
    };

    scriptNodeRef.current.connect(audioContextRef.current.destination);
    console.log("✅ ScriptProcessor fallback initialisé");
  }, []);

  // Fonction pour ajouter au buffer queue (fallback)
  const addToBufferQueue = useCallback((float32) => {
    if (!scriptNodeRef.current) return;

    // Limiter la taille du buffer pour éviter la latence
    while (bufferQueueRef.current.length > MAX_BUFFER_SIZE) {
      bufferQueueRef.current.shift(); // Supprimer les anciens chunks
    }

    bufferQueueRef.current.push(float32);
  }, []);

  // Fix pour chunks PCM impairs
  const fixPCMChunk = useCallback((value) => {
    if (value.byteLength % 2 !== 0) {
      console.warn("⚠️ Chunk impair tronqué:", value.byteLength);
      return value.slice(0, value.byteLength - 1);
    }
    return value;
  }, []);

  // Initialiser le contexte audio avec AudioWorklet et fallback
  const initAudioContext = useCallback(async () => {
    try {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        return; // Déjà initialisé
      }

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass({
        sampleRate: SAMPLE_RATE,
        latencyHint: 'playback'
      });

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      console.log("AudioContext sampleRate:", audioContextRef.current.sampleRate);

      // Tentative AudioWorklet
      if (audioContextRef.current.audioWorklet) {
        try {
          await audioContextRef.current.audioWorklet.addModule("/custom-pcm-processor.js");

          workletNodeRef.current = new AudioWorkletNode(
            audioContextRef.current,
            "custom-pcm-processor"
          );
          workletNodeRef.current.connect(audioContextRef.current.destination);

          console.log("✅ AudioWorklet initialisé");
        } catch (workletError) {
          console.warn("⚠️ AudioWorklet failed, using ScriptProcessor:", workletError);
          setupScriptProcessor();
        }
      } else {
        console.warn("⚠️ AudioWorklet non supporté, fallback ScriptProcessor");
        setupScriptProcessor();
      }

    } catch (error) {
      console.error('Erreur initialisation AudioContext:', error);
      throw new Error(`Impossible d'initialiser l'audio: ${error.message}`);
    }
  }, [setupScriptProcessor]);

  // Streaming principal optimisé
  const startStreaming = useCallback(async (text) => {
    if (text && text.trim() != "") {

      try {
        setIsLoading(true);
        setError(null);
        setChunkCount(0);
        setFirstChunkTime(null);
        setTotalTime(null);
        bufferQueueRef.current = [];

        await initAudioContext();

        const payload = {
          text: text,
          speaker_id: "Filip Traverse",
          language_id: "fr",
          speaker_wav: speakerWav,
          chunk_size: CHUNK_SIZE,
          output_chunk_size: OUTPUT_CHUNK_SIZE,
        };

        abortControllerRef.current = new AbortController();
        startTimeRef.current = performance.now();

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/octet-stream"
          },
          body: JSON.stringify(payload),
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        if (!response.body) {
          throw new Error("Streaming non supporté par le serveur");
        }

        const reader = response.body.getReader();
        setIsPlaying(true);
        isPlayingRef.current = true;
        setIsLoading(false);

        let chunkIndex = 0;
        let totalBytesReceived = 0;

        const pump = async () => {
          while (isPlayingRef.current) {
            try {
              const { done, value } = await reader.read();

              if (done) {
                console.log("✅ Streaming terminé");
                setIsPlaying(false);
                isPlayingRef.current = false;
                break;
              }

              if (value && value.length > 0) {
                // Timing du premier chunk
                if (chunkIndex === 0) {
                  const firstChunkDuration = performance.now() - startTimeRef.current;
                  setFirstChunkTime(firstChunkDuration);
                  console.log(`Premier chunk reçu en: ${firstChunkDuration.toFixed(2)}ms`);
                }

                totalBytesReceived += value.length;

                // Debug pour les premiers chunks

                if (chunkIndex > 0) {
                  console.log(`Chunk ${chunkIndex}:`, {
                    size: value.length,
                    totalReceived: totalBytesReceived,
                    type: value.constructor.name
                  });
                }

                // Nettoyer et convertir le chunk
                let fixedValue = fixPCMChunk(value);

                // Ignorer header WAV si présent
                if (chunkIndex === 0 && fixedValue.byteLength >= 44) {
                  const header = new Uint8Array(fixedValue.slice(0, 4));
                  const headerStr = String.fromCharCode(...header);
                  if (headerStr === 'RIFF') {
                    console.log("⚠️ Header WAV détecté et ignoré");
                    fixedValue = fixedValue.slice(44);
                  }
                }

                if (fixedValue.byteLength > 0) {
                  // Conversion Int16 → Float32 optimisée
                  const int16Array = new Int16Array(
                    fixedValue.buffer,
                    fixedValue.byteOffset,
                    Math.floor(fixedValue.byteLength / 2)
                  );

                  const float32Array = new Float32Array(int16Array.length);

                  // Conversion avec gain réduit pour éviter la distorsion
                  for (let i = 0; i < int16Array.length; i++) {
                    float32Array[i] = (int16Array[i] / 32768) * 0.85;
                  }

                  // Envoyer selon le mode disponible
                  if (workletNodeRef.current) {
                    splitAndSend(float32Array);
                  } else if (scriptNodeRef.current) {
                    addToBufferQueue(float32Array);
                  }
                }

                setChunkCount(chunkIndex + 1);
                chunkIndex++;

                // Monitoring de la santé du buffer
                const bufferSize = workletNodeRef.current ? 0 : bufferQueueRef.current.length;
                if (bufferSize > 8) {
                  setBufferHealth('overload');
                } else if (bufferSize > 4) {
                  setBufferHealth('normal');
                } else {
                  setBufferHealth('low');
                }
              }

            } catch (readError) {
              if (readError.name !== 'AbortError') {
                console.error('Erreur lecture stream:', readError);
                setError(`Erreur streaming: ${readError.message}`);
              }
              break;
            }
          }
        };

        await pump();

      } catch (err) {
        console.error('❌ Erreur streaming:', err);
        let errorMessage = err.message;

        if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Connexion serveur impossible. Réseau ou serveur indisponible.';
        } else if (err.message.includes('AudioWorklet')) {
          errorMessage = 'AudioWorklet non trouvé. Vérifiez le fichier custom-pcm-processor.js';
        }

        setError(errorMessage);
        setIsPlaying(false);
        isPlayingRef.current = false;
      } finally {
        setIsLoading(false);
        const totalDuration = performance.now() - startTimeRef.current;
        setTotalTime(totalDuration);
      }
    }
  }, [text, initAudioContext, fixPCMChunk, splitAndSend, addToBufferQueue, url]);

  // Pause
  const pause = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Resume
  const resume = useCallback(() => {
    if (audioContextRef.current) {
      startStreaming();
    }
  }, [startStreaming]);

  // Stop complet
  const stop = useCallback(() => {
    setIsPlaying(false);
    isPlayingRef.current = false;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Nettoyer les buffers
    bufferQueueRef.current = [];

    // Déconnecter les nodes
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }

    if (scriptNodeRef.current) {
      scriptNodeRef.current.disconnect();
      scriptNodeRef.current = null;
    }

    // Fermer le contexte
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Reset des stats
    setChunkCount(0);
    setFirstChunkTime(null);
    setTotalTime(null);
    setError(null);
  }, []);

  // Gestion play/pause
  const handlePlayPause = useCallback(() => {
    if (isLoading) return;

    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [isLoading, isPlaying, pause, resume]);

  // Cleanup à la fermeture
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  const togglePlayPause = (mutedParam) => {
    // setMuted(null); // Réinitialise l'état muet
    // setTimeout(() => { setMuted(!mutedParam) }, 10)
    setMuted(prev => !mutedParam);
    handlePlayPause();

  };

  const showBubbleBox = (isOpen) => {
    const botIa = document.getElementById("voiceflow-chat")
    const voiceflowChat = document.getElementById("voiceflow-chat")

    if (voiceflowChat && botIa) {
      // botIa.append(voiceflowChat)
      const position = botIa.getBoundingClientRect();
      const voiceflowChat = document.getElementsByClassName("vfrc-widget--launcher c-PJLV");
      window.voiceflow?.chat?.show();
      setShowSound(isOpen);
    }
  }

  const showHideIa = (iaProjectId, iaName = null, isAudioOn = false) => {
    const botIa = document.getElementById("voiceflow-chat-frame");
    const botIaChat = document.getElementById("voiceflow-chat");
    // console.log("id & selectedid :" + selectedProgramId, iaProjectId)
    // const sheet = new CSSStyleSheet();
    // document.adoptedStyleSheets = [sheet];
    // sheet.replaceSync(`.c-ivtLaR-ftPdvq-withChat-false > .c-PJLV {bottom: 150px !important}`)
    if (botIaChat) { botIaChat.style.display = 'none'; }
    window.voiceflow?.chat?.destroy();
    if (iaProjectId && selectedProgramId && !isAnyAdmin) {

      // const posY = botIa.getBoundingClientRect().bottom / 2;
      // const posX = botIa.getBoundingClientRect().right / 2;
      // Load the Voiceflow chat widget if projectId is present
      const program_goals = [];
      const cube = programDetails[selectedProgramId]?.cube || [];
      cube?.goals?.forEach(goal => {
        if (goal.measurementName == "action") {
          program_goals.push("ACTIONS");
        } else {
          program_goals.push("SALES");
        }
      });

      let programName = programDetails[selectedProgramId]?.name;
      const program_name = programName;

      programName = programName?.trim();
      programName = programName?.replaceAll(' ', '_');
      programName = programName + "_" + selectedProgramId;

      let companyName = programDetails[selectedProgramId]?.iaCompany?.companyName || programDetails[selectedProgramId]?.platformId?.toString();
      const company_name = companyName;

      companyName = companyName?.trim();
      companyName = companyName?.replaceAll(' ', '_');
      const type = programDetails[selectedProgramId]?.type;
      const program_type = PROGRAM_TYPES_NAMES[type];

      setShowCog(false);
      const script = document.createElement("script");
      script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
      script.async = true;
      console.log("LOAD BOT IA", userData);
      const userInfos = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address,
        phoneNumber: userData.phoneNumber,
        mobilePhoneNumber: userData.mobilePhoneNumber,
        zipCode: userData.zipCode,
        city: userData.city,
        country: userData.country,
        companyName: userData.companyName,
        companyRole: userData.companyRole,
        dateOfBirth: userData.dateOfBirth
      }
      script.onload = () => {
        window.voiceflow?.chat?.load({
          verify: { projectID: iaProjectId },
          url: "https://general-runtime.voiceflow.com",
          versionID: "production",
          userID: userData.uuid,
          launch: {
            event: {
              type: "launch",
              payload: {
                user: userInfos,
                challenge_id: programName,
                company_id: companyName,
                ia_id: iaProjectId,
                ia_name: iaName,
                rewardzai_user_id: userData.uuid,
                user_email: userData.email,
                program_goals: program_goals,
                program_name: program_name,
                company_name: company_name,
                program_type: program_type
              }
            }
          },
          allowDangerousHTML: true,
          assistant: {
            color: `${selectedProgram.design.colorSidebar}`,
            stylesheet: '/bot-style.css',
            persistence: 'memory',
            // extensions: [
            //   PickIntentExtension
            // ],
          }
        })
        //     .then((event)=>{
        //   console.log(event);
        // })
        window.voiceflow?.chat?.show();
      }

      botIa.appendChild(script);
      setTimeout(() => {
        const botIaChat = document.getElementById("voiceflow-chat");
        if (botIaChat) { botIaChat.style.display = 'block'; }
      }, 100)
      // document.body.appendChild(script);

    } else {
      // If there's no projectId, hide the chat bubble
      window.voiceflow?.chat?.destroy();
      setShowCog(true);
      // if(botIaChat){botIaChat.style.display = 'none';}
    }
  }

  // let isTalking = false; // Variable pour suivre si l'audio est en cours de lecture
  // let audioDataList = [];
  // let currentAudio = null;
  // let isFirstAudioChunck = false;
  // let audioIndex = 1; // Initialisation de l'itérateur
  // let prevPosition = 0; // Variable pour suivre la position précédente

  const nonActiveMsg = [
    "est-ce que tu es toujours là",
    "tu es toujours là",
    "il semble que tu sois inactif",
    "est-ce que tu es toujours présent",
    "il semblerait que tu fasses une pause",
    "Besoin d'aide?",
  ];

  const splitTextTts = (text, maxLength, segments) => {
    if (!text || text.trim == "") { return [] }

    // Segmenter le texte en phrases en utilisant une expression régulière
    // const sentences = text.split(/(?<=[.?])|\/n/);
    const sentences = text.split(/(?<=[.!?])\s+(?![a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|https?:\/\/[^\s]+)/);

    // Segmenter le texte en fonction de la longueur maximale
    // const segments = [];
    let currentSegment = "";
    for (const sentence of sentences) {
      if (currentSegment.length + sentence.length <= maxLength) {
        currentSegment += sentence + " ";
      } else {
        if (currentSegment && currentSegment.trim() !== "") {
          segments.push(currentSegment.trim());
        }
        currentSegment = sentence + " ";
      }
    }
    if (currentSegment && currentSegment.trim() !== "") {
      // Ajouter le dernier segment s'il n'est pas vide
      segments.push(currentSegment.trim());
    }
    const newSegments = [];
    const patternSegment = /[()[\],;+\-*\\&~#"|?!^`{}]/g;
    const emojiPattern = /[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F700}-\u{1F7FF}|\u{1F900}-\u{1F9FF}|\u{1F000}-\u{1F1FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu;
    const otherPattern = /[◾📋🔍🚀🌟]/g;
    const euroPattern = /[\€]/g;
    const dollarPattern = /[\$]/g;
    segments.forEach((segment, j) => {
      if (segment && segment.trim() !== "") {
        // if (segment.length <= maxLength && segment.length > 25) {
        if (segment.length <= maxLength && segment.length > 100) {
          // Si le segment est plus court que maxLength, le nettoyer et l'ajouter
          segment = segment.replaceAll(patternSegment, ' ').replaceAll(emojiPattern, ' ').replaceAll(otherPattern, '').replaceAll('undefined', '').trim();
          newSegments.push(segment.trim());
        } else {
          if (segment.length <= 100) {
            segment = segment + segments[j + 1];
            segments[j + 1] = ''; // Vide le segment suivant pour éviter de le traiter à nouveau
          }
          if (segment.length <= 100) {
            segment = segment + segments[j + 2];
            segments[j + 2] = ''; // Vide le segment suivant pour éviter de le traiter à nouveau
            newSegments.push(segment.trim());
          } else if (segment.length <= maxLength) {
            newSegments.push(segment.trim());
          } else {
            const segs = segment.split(',');
            segs.forEach((seg, index) => {
              if (seg && seg.trim() !== "") {
                seg = seg.replaceAll(patternSegment, ' ').replaceAll(emojiPattern, ' ').replaceAll(otherPattern, '').replaceAll('undefined', '').trim();
                // Nettoyer le segment des caractères spéciaux et des emojis
                if (seg.length <= 100) {
                  if (index < segs.length - 1) {
                    seg = segs[index] + ' ' + segs[index + 1];
                    segs[index + 1] = '';
                    newSegments.push(seg.trim());
                  } else {
                    newSegments[newSegments.length - 1] = newSegments[newSegments.length - 1] + ' ' + segs[index];
                    segs[index] = '';
                  }
                } else {
                  newSegments.push(seg.trim());
                }
              }
            });

          }
        }
      }
    });
    // segments = newSegments;
    return newSegments; // Retourne les segments nettoyés       

  }

  const playAudioSequentially = (audioList, isFirstChunck) => {
    // const currentAudioToPlay = isFirstChunck ? audioList[0] : audioList.find(e => e.position === prevPosition + 1);
    setIsFirstAudioChunck(false);
    if (!audioList) {
      console.log("Aucun audio à jouer pour la position :", prevPosition + 1);
      return; // Si aucun audio à jouer, sortir
    }
    const audioSrc = audioList.audioUrl; // Utilise l'URL de l'audio
    const currAudio = new Audio(audioSrc); // Crée un nouvel objet Audio avec l'URL
    // setCurrentAudio(currAudio);
    console.log('isMuted : ', isMuted);
    console.log('Muted : ', muted);
    if (!isTalking && !muted) {
      // currentAudio = currAudio; // Met à jour la référence de l'audio en cours de lecture
      setCurrentAudio(currAudio); // Met à jour la référence de l'audio en cours de lecture
      // setIsTalking(true); // Met à jour l'état de lecture
      isTalking = true; // Met à jour l'état de lecture
      // setPrevPosition(audioList.position); // Met à jour la position précédente
      // prevPosition++; // Met à jour la position précédente
      currAudio.play()
        .then(() => {
          console.log('Audio en cours de lecture, prevPosition :', audioList.position);
        })
        .catch(error => {
          console.error('Erreur lors de la lecture de l\'audio:', error);
          // setIsTalking(false); // Réinitialise l'état si une erreur se produit
          isTalking = false; // Réinitialise l'état si une erreur se produit
        });
    }
    // Écoute l'événement 'ended' pour jouer le prochain audio
    currAudio.addEventListener('ended', () => {
      // setIsTalking(false); // Indique que l'audio n'est plus en cours de lecture
      isTalking = false; // Indique que l'audio n'est plus en cours de lecture
      URL.revokeObjectURL(audioList.audioSrc); // Libère l'URL de l'audio
      const updatedList = audioDataList.filter(e => e.position !== audioList.position);
      // setAudioDataList(updatedList); // Met à jour la liste audio
      audioDataList = updatedList; // Met à jour la liste audio
      // setCurrentAudio({}); // Réinitialise l'audio courant
      // setPrevPosition(currentAudioToPlay.position); // Met à jour la position précédente
      // Attendre 3 secondes avant de jouer le prochain audio
      prevPosition = audioList.position; // Met à jour la position précédente
      const nextAudioToPlay = audioDataList.find(e => e.position === prevPosition + 1);
      // currentAudio = null; // Réinitialise l'audio courant
      setCurrentAudio(null); // Réinitialise l'audio courant
      if (nextAudioToPlay) {
        playAudioSequentially(nextAudioToPlay, false); // Appelle la fonction pour jouer le prochain audio
      }
      // setTimeout(() => {
      // }, 3000);
    });
  };

  const getAudioTts = (text: string, maxLength: number = 100, question: string = "", isToSplit: boolean = false, position) => {
    text = text.replaceAll('undefined', '').replaceAll('Undefined', '').replaceAll(/\n\n(?=[0-9A-Za-z])/g, ' ').trim();
    const patternSegment = /[()[\],;+\-*\\&~#"|?!^`{}]/g;
    text = text.replaceAll(patternSegment, ' ').trim();
    const params = new URLSearchParams({
      "text": text,
      "speaker-id": "Filip Traverse",
      "language-id": "fr",
    });
    fetch(`/tts?${params}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Erreur réseau : ' + response.statusText);
        }
        return response.blob(); // Convertit la réponse en blob audio
      })
      .then((data) => {
        if (data && data.size > 0) { // Vérifie si le blob n'est pas vide
          const audioUrl = URL.createObjectURL(data); // Crée une URL pour le blob audio
          console.log("Text content :", text);
          console.log("Text position :", position);
          const updatedList = [...audioDataList, { position: position, audioUrl: audioUrl }];
          const sortedList = updatedList.sort((a, b) => a.position - b.position); // Trie la liste par position
          // setAudioDataList(sortedList);
          audioDataList = sortedList; // Met à jour la liste audio

          if (audioDataList.length > 0) {
            if (position === 0) {
              setIsFirstAudioChunck(false);
              // setPrevPosition(0); // Réinitialise la position précédente
              prevPosition = 0; // Réinitialise la position précédente
              playAudioSequentially(audioDataList[0], true); // Commence à jouer les audios
            } else {
              // Vérifie si le prochain audio est prêt à être joué
              const nextAudio = audioDataList.find(e => e.position === prevPosition + 1);
              if (nextAudio) {
                playAudioSequentially(nextAudio, false);
              }
              // if (audioDataList.some(e => e.position === prevPosition + 1)) {
              //   playAudioSequentially();
              // }
            }
          }
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de l\'audio TTS:', error);
      });
  };

  useEffect(() => {
    const messageHandler = async (event) => {
      if (event && event.data && isAudioOn) {
        let data = event.data;
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        if (data && data.type) {
          // Gérer l'événement 'voiceflow:open'
          if (data.type.indexOf('voiceflow:open') >= 0) {
            showBubbleBox(true);
          }
          // Gérer l'événement 'voiceflow:close'
          if (data.type.indexOf('voiceflow:close') >= 0) {
            showBubbleBox(false);
          }
          // Gérer l'événement 'voiceflow:interact'
          if (data.type.indexOf('voiceflow:interact') >= 0) {
            showBubbleBox(true);
            const turns = data.payload?.session?.turns;
            if (turns && turns.length > 0) {
              let lastDiscussionArr = turns.filter(e => e.type === "system");
              const lastDiscussion = lastDiscussionArr[lastDiscussionArr.length - 1];
              if (lastDiscussion && lastDiscussion.messages?.length > 0) {
                let segments = [];
                let allSegments = "";
                let allTexts = "";
                lastDiscussion.messages.forEach((message) => {
                  let isRelanceText = false;
                  if (typeof message?.text != 'string' && message?.text && message?.text.length > 0) {
                    message?.text.forEach((text) => {
                      if (text.children?.length > 0) {
                        text.children.forEach((child) => {
                          if (nonActiveMsg.some(t => child.text?.toLowerCase().indexOf(t) >= 0)) {
                            isRelanceText = true;
                          }
                          if (child.text && child.text.trim() !== "") {
                            allTexts += " " + child.text.trim();
                          }
                        });
                      }
                    });
                  } else if (message?.text && message?.text.trim() !== "") {
                    allTexts = message.text.trim();
                    if (nonActiveMsg.some(t => allTexts.toLowerCase().indexOf(t) >= 0)) {
                      isRelanceText = true;
                    }
                  }
                  // segments = isRelanceText ? [] : splitTextTts(allTexts, 200, segments);
                  allSegments = isRelanceText ? "" : allTexts;
                });
                const patternSegment = /[()[\],;+\-*\\&~#"|?!^`{}]/g;
                const emojiPattern = /[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{1F700}-\u{1F7FF}|\u{1F900}-\u{1F9FF}|\u{1F000}-\u{1F1FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu;
                const otherPattern = /[◾📋🔍🚀🌟]/g;
                allSegments = allSegments.replaceAll(patternSegment, ' ').replaceAll(emojiPattern, ' ').replaceAll(otherPattern, '').replaceAll('undefined', '').trim();
                // setTimeout(() => {
                // }, 10);
                if (allSegments && allSegments.trim() != "") {
                  stop();
                  startStreaming(allSegments);
                }
                // setIsFirstAudioChunck(prev => { return true });
                // // setAudioDataList([]); // Réinitialise la liste audio
                // audioDataList = []; // Réinitialise la liste audio
                // console.log("Segments to play:", segments);
                // setIsFirstAudioChunck(true);
                // console.log("Reset prevPosition at begin, prev position was : ", prevPosition);
                // // setPrevPosition(0); // Réinitialise la position précédente
                // prevPosition = 0; // Réinitialise la position précédente
                // if (segments?.length > 0) {
                //   getAudioTts(segments[0], 100, "", false, 0);
                //   if (segments?.length > 1) {
                //     const time = segments[0].length * 50;
                //     setTimeout(() => {
                //       getAudioTts(segments[1], 100, "", false, 1);
                //     }, time); // Attendre 5 secondes pour les segments plus longs
                //   }
                // }
                // // Attendre un certain temps pour s'assurer que le premier segment est prêt
                // if (segments.length >= 3) {
                //   const time = (segments[0].length + segments[1].length) * 170;
                //   setTimeout(() => { }, time); // Attendre 5 secondes pour les segments plus longs
                // }
                // let time = 5000; // Délai entre les itérations en millisecondes
                // // Démarre l'intervalle pour afficher les itérations   
                // let index = 2;
                // const interval = setInterval(async () => {
                //   if (index <= segments.length && segments.length > 2) {
                //     const segment = segments[index];
                //     if (segment && segment.trim() != "") {
                //       time = segment.length * 50; // Ajuste le délai en fonction de la longueur du segment
                //       getAudioTts(segment, 100, "", false, index);
                //     }
                //     index++;
                //     setAudioIndex(prevIndex => { return prevIndex + 1 }); // Incrémente l'itérateur
                //   } else {
                //     index = 2;
                //     setAudioIndex(prevIndex => { return 0 });
                //     clearInterval(interval); // Arrête l'intervalle après 5 itérations
                //   }
                // }, time); // Délai de 1 seconde (1000 ms)  
              }
            }
          }
        }
      }
    };
    window.addEventListener('message', messageHandler);
    return () => {
      window.removeEventListener('message', messageHandler);
    };
  }, [isAudioOn, audioIndex, muted, currentAudio]); // Ajoutez les dépendances nécessaires

  const updateProgramId = useCallback((newProgramId) => {
    if (newProgramId !== undefined) {
      setCurrentProgramId(newProgramId);
    } else {
      setCurrentProgramId(null);
    }
  }, []);

  useEffect(() => {
    if (selectedProgramId !== currentProgramId) {
      updateProgramId(selectedProgramId);
    }
    return () => {
      setIsAudioOn(false);
      setShowSound(false);
      setCurrentAudio(null);
      setMuted(null);
    };
  }, [selectedProgramId, currentProgramId, updateProgramId]);

  useEffect(() => {
    if (programDetails[selectedProgramId] && userData && userData.uuid) {
      // console.log(`API call for Program ID: ${currentProgramId}`);
      // console.log(programDetail);

      // Get iaProjectId from program details
      const newProjectId = programDetails[selectedProgramId]?.iaCompany?.iaProjectId || null;
      const newProjectName = programDetails[selectedProgramId]?.iaCompany?.iaName || "";
      const isAudioOnProg = programDetails[selectedProgramId]?.iaCompany?.iaAudioOn || false;
      const isAudioOnEnv = boolean(process.env.REACT_APP_IS_AUDIO_ON) || false;
      // const isAudioOnProg = true;
      console.log(newProjectName)
      if (newProjectName && newProjectName.toLowerCase() == 'victor cabrera') {
        setSpeakerWav("cabrera_new_00000007.wav");
      } else {
        setSpeakerWav("telechargement3.wav");
      }
      setIsAudioOn(isAudioOnProg && isAudioOnEnv);
      showHideIa(newProjectId, newProjectName, isAudioOn);
    }
    return () => {
      showHideIa(null);
    }
  }, [currentProgramId, didLoad, programDetails]);

  const onClick = () => {
    if (type == 4) { modifyProgramDesign(WALL_BLOCK.SETTINGS_BLOCK, FREEMIUM); }
    else { modifyProgramDesign(WALL_BLOCK.SETTINGS_BLOCK, CHALLENGE); }

  };

  const newProjectId = programDetails[selectedProgramId]?.iaCompany?.iaProjectId;
  const newAiName = programDetails[selectedProgramId]?.iaCompany?.iaName;
  const type = programDetails[selectedProgramId]?.type;

  let widgetTitleId = newProjectId && selectedProgramId ? "wall.user.block.bootDescription" : "wall.settings.defaultTitle";
  const widgetTextBodyId = newAiName && selectedProgramId ? newAiName : "wall.settings.defaultBody";
  if (isAnyAdmin && selectedProgramId) {
    widgetTitleId = "wall.admin.block.design"
  }

  return (
    <div ref={bootRef}>
      <GeneralBlock className={`${withGrayAccentColor} ${widgetContact} ${textCenter} ${wallStyle.hideBlockMobile} ${blockContactUs} ${'custom-contact-us-widget'}`}>
        <div className={`${wallBaseStyle.modifyBlockContainer}`}>
          <DynamicFormattedMessage
            className={`${withBoldFont} ${widgetTitle}`}
            id={widgetTitleId}
            tag={HTML_TAGS.P}
            style={{ color: colorWidgetTitle, marginLeft: "10px" }}
          />
          {/* {selectedProgramId && isAnyAdmin && isFreemium && (
            <div className={`${postIcon} ${modifyProgram}`} onClick={onClick} />
          )} */}
        </div>
        <div id="voiceflow-chat-elem" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
          {(!projectId || !selectedProgramId) && <div className={`${cardIcon} ${designVisible} ${pointer} icon-wrapper`} onClick={isAnyAdmin && selectedProgramId ? onClick : () => onRewardsRedirect(false, true)}>
            {<FontAwesomeIcon icon={isAnyAdmin && selectedProgramId ? faSlidersH : (isBeneficiary || (!isFreemium && !isBeneficiary) ? faCog : faSlidersH)} style={{ visibility: showcog ? 'visible' : 'hidden' }} />}
          </div>}
        </div>
        <div id="voiceflow-chat-frame"></div>

        {!isAnyAdmin && newAiName && selectedProgramId &&
          <span className={`${widthFull} ${widgetTextBody}`} style={{ color: colorWidgetTitle }}>
            {newAiName}
          </span>
          // <DynamicFormattedMessage
          //   className={`${widthFull} ${widgetTextBody}`}
          //   style={{ color: colorWidgetTitle }}
          //   id={widgetTextBodyId}
          //   tag={HTML_TAGS.SPAN}
          // />
        }
        {showSound && <FloatingAudioToggle muted={muted} togglePlayPause={togglePlayPause} currentAudio={currentAudio} isTalking={isTalking} isMuted={isMuted} />}

      </GeneralBlock>
    </div>
  );
};

export default ContactUsWidget;
