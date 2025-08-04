import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../../hooks/useChat";
import {
  VoiceActivityIndicator,
  VoiceBackButton,
  VoiceControlButton,
  VoiceState,
  VoiceStatusDisplay,
} from "./voice";

interface VoiceChatProps {
  loading: boolean;
  onBack: () => void;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ onBack }) => {
  const [voiceState, setVoiceState] = useState<VoiceState>(VoiceState.IDLE);
  const recognitionRef = useRef<any>(null);
  const speechTimeoutRef = useRef<number | null>(null);
  const { sendMessage, messages } = useChat();

  // Response timeout configurations (you can adjust these)
  const RESPONSE_WAIT_TIME = {
    SHORT: 800, // Fast response - may cut off streaming
    MEDIUM: 1500, // Balanced - current setting
    LONG: 2500, // Safe wait - ensures complete response
    ADAPTIVE: "adaptive", // Smart detection based on content
  };

  // Current setting - change this to test different timings
  const currentWaitTime = RESPONSE_WAIT_TIME.ADAPTIVE;

  // Speech synthesis for AI responses
  const speakMessage = async (text: string) => {
    return new Promise<void>((resolve) => {
      if ("speechSynthesis" in window) {
        // Cancel any existing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Configure speech settings
        utterance.rate = 0.9; // Slightly slower for better comprehension
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        utterance.lang = "en-US";

        // Get available voices and select a good one
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          // Try to find a female voice or any good quality voice
          const preferredVoice =
            voices.find(
              (voice) =>
                voice.lang.includes("en") &&
                (voice.name.includes("Female") ||
                  voice.name.includes("Google") ||
                  voice.name.includes("Microsoft"))
            ) ||
            voices.find((voice) => voice.lang.includes("en")) ||
            voices[0];

          utterance.voice = preferredVoice;
          console.log("Using voice:", preferredVoice.name);
        }

        utterance.onstart = () => {
          console.log("Speech synthesis started");
        };

        utterance.onend = () => {
          console.log("Speech synthesis ended");
          resolve();
        };

        utterance.onerror = (error) => {
          console.error("Speech synthesis error:", error);
          resolve();
        };

        console.log(
          "Starting speech synthesis for:",
          text.substring(0, 100) + "..."
        );
        window.speechSynthesis.speak(utterance);
      } else {
        console.log("Speech synthesis not supported");
        resolve();
      }
    });
  };

  // Initialize speech recognition
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      console.error("Speech recognition not supported");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Configure recognition settings for longer listening
    recognition.continuous = true; // Keep listening continuously
    recognition.interimResults = true; // Show interim results
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    // Add silence detection timeout (optional)
    let silenceTimer: number | null = null;
    let finalTranscript = "";

    recognition.onstart = () => {
      console.log("Speech recognition started");
      setVoiceState(VoiceState.LISTENING);
      finalTranscript = "";
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      finalTranscript = "";

      // Clear existing silence timer
      if (silenceTimer) {
        window.clearTimeout(silenceTimer);
        silenceTimer = null;
      }

      // Process all results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update transcript display (you can remove this if you don't want to show it)
      // setTranscript(finalTranscript + interimTranscript); // Removed - not displaying text

      // Set a timer to stop listening after 2 seconds of silence
      if (finalTranscript.trim()) {
        silenceTimer = window.setTimeout(() => {
          recognition.stop();
        }, 2000); // 2 seconds of silence
      }
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      if (silenceTimer) {
        window.clearTimeout(silenceTimer);
        silenceTimer = null;
      }

      const fullTranscript = finalTranscript.trim();
      if (fullTranscript) {
        handleSendMessage(fullTranscript);
        // setTranscript(""); // Removed - not using transcript display
      } else {
        setVoiceState(VoiceState.IDLE);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (silenceTimer) {
        window.clearTimeout(silenceTimer);
        silenceTimer = null;
      }

      // Handle specific errors
      if (event.error === "no-speech") {
        console.log("No speech detected, restarting...");
        // Restart recognition if no speech detected
        setTimeout(() => {
          if (voiceState === VoiceState.LISTENING) {
            recognition.start();
          }
        }, 500);
      } else if (event.error === "audio-capture") {
        console.error("Audio capture error - check microphone permissions");
        setVoiceState(VoiceState.IDLE);
      } else {
        setVoiceState(VoiceState.IDLE);
      }
    };

    recognition.onspeechstart = () => {
      console.log("Speech detected");
    };

    recognition.onspeechend = () => {
      console.log("Speech ended");
    };

    recognition.onaudiostart = () => {
      console.log("Audio capturing started");
    };

    recognition.onaudioend = () => {
      console.log("Audio capturing ended");
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimer) {
        window.clearTimeout(silenceTimer);
      }
      if (speechTimeoutRef.current) {
        window.clearTimeout(speechTimeoutRef.current);
      }
    };
  }, []); // Remove transcript dependency to prevent unnecessary re-initialization

  // Handle sending message and getting response
  const handleSendMessage = async (message: string) => {
    try {
      console.log("Sending message:", message);
      setVoiceState(VoiceState.PROCESSING);
      await sendMessage(message);
      // useEffect will handle the response when messages array updates
    } catch (error) {
      console.error("Error sending message:", error);
      setVoiceState(VoiceState.IDLE);
    }
  };

  // Handle voice control actions
  const handleVoiceControl = () => {
    if (voiceState === VoiceState.LISTENING) {
      recognitionRef.current?.stop();
    } else if (voiceState === VoiceState.SPEAKING) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setVoiceState(VoiceState.IDLE);
    } else if (voiceState === VoiceState.IDLE) {
      recognitionRef.current?.start();
    }
  };

  // Update voice state when speech synthesis ends
  useEffect(() => {
    if ("speechSynthesis" in window) {
      // This is a basic implementation - you might need to adjust based on your needs
      const interval = setInterval(() => {
        if (
          !window.speechSynthesis.speaking &&
          voiceState === VoiceState.SPEAKING
        ) {
          setVoiceState(VoiceState.IDLE);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [voiceState]);

  // Monitor messages array for new AI responses
  useEffect(() => {
    if (voiceState === VoiceState.PROCESSING && messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      console.log("Messages updated, latest:", latestMessage);

      if (latestMessage.role === "assistant") {
        // Clear any existing timeout
        if (speechTimeoutRef.current) {
          window.clearTimeout(speechTimeoutRef.current);
        }

        // Set a timeout to wait for complete response
        speechTimeoutRef.current = window.setTimeout(() => {
          // Double check the latest message again
          if (messages.length > 0) {
            const finalMessage = messages[messages.length - 1];
            if (
              finalMessage.role === "assistant" &&
              finalMessage.content.trim().length > 0
            ) {
              console.log(
                "Starting delayed speech synthesis:",
                finalMessage.content
              );
              setVoiceState(VoiceState.SPEAKING);
              speakMessage(finalMessage.content)
                .then(() => {
                  console.log("Speech synthesis completed");
                  setVoiceState(VoiceState.IDLE);
                })
                .catch((error) => {
                  console.error("Speech synthesis error:", error);
                  setVoiceState(VoiceState.IDLE);
                });
            }
          }
        }, getOptimalWaitTime(latestMessage.content)); // Dynamic wait time
      }
    }
  }, [messages, voiceState]);

  // Smart wait time calculation
  const getOptimalWaitTime = (content: string): number => {
    if (currentWaitTime !== RESPONSE_WAIT_TIME.ADAPTIVE) {
      return typeof currentWaitTime === "number"
        ? currentWaitTime
        : RESPONSE_WAIT_TIME.MEDIUM;
    }

    // Adaptive logic based on content characteristics
    const contentLength = content.trim().length;

    // Very short responses (likely complete)
    if (contentLength < 10) {
      return RESPONSE_WAIT_TIME.SHORT;
    }

    // Check if content looks complete (ends with proper punctuation)
    const endsWithPunctuation = /[.!?]$/.test(content.trim());
    const hasMultipleSentences = (content.match(/[.!?]/g) || []).length > 1;

    if (endsWithPunctuation && hasMultipleSentences) {
      console.log(
        "Content looks complete, using short wait:",
        RESPONSE_WAIT_TIME.SHORT
      );
      return RESPONSE_WAIT_TIME.SHORT;
    }

    // Check for incomplete patterns
    const incompletePatterns = [
      /\b(in|on|at|the|a|an|is|are|was|were|will|would|could|should|may|might)$/i,
      /[,;:]$/,
      /\b\w{1,3}$/,
    ];

    const seemsIncomplete = incompletePatterns.some((pattern) =>
      pattern.test(content)
    );

    if (seemsIncomplete) {
      console.log(
        "Content seems incomplete, using long wait:",
        RESPONSE_WAIT_TIME.LONG
      );
      return RESPONSE_WAIT_TIME.LONG;
    }

    console.log("Using medium wait time:", RESPONSE_WAIT_TIME.MEDIUM);
    return RESPONSE_WAIT_TIME.MEDIUM;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 
                    flex flex-col items-center justify-center p-6"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full animate-pulse"></div>
      </div>

      {/* Back Button */}
      <VoiceBackButton onExitVoiceMode={onBack} />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-12 max-w-2xl mx-auto">
        {/* Status Display */}
        <VoiceStatusDisplay voiceState={voiceState} />

        {/* Activity Indicator with Voice Control */}
        <div className="relative">
          <VoiceActivityIndicator voiceState={voiceState} />
          <VoiceControlButton
            voiceState={voiceState}
            loading={false}
            onAction={handleVoiceControl}
          />
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
