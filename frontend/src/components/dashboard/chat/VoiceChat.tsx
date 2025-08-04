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
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const { sendMessage, messages } = useChat();

  // Speech synthesis for AI responses
  const speakMessage = async (text: string) => {
    return new Promise<void>((resolve) => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      } else {
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

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log("Speech recognition started");
      setVoiceState(VoiceState.LISTENING);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      if (transcript.trim()) {
        handleSendMessage(transcript);
        setTranscript("");
      } else {
        setVoiceState(VoiceState.IDLE);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setVoiceState(VoiceState.IDLE);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [transcript]);

  // Handle sending message and getting response
  const handleSendMessage = async (message: string) => {
    try {
      setVoiceState(VoiceState.PROCESSING);
      await sendMessage(message);

      // Get the latest message after sending
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1];
        if (latestMessage.role === "assistant") {
          setVoiceState(VoiceState.SPEAKING);
          await speakMessage(latestMessage.content);
          setVoiceState(VoiceState.IDLE);
        }
      }
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

        {/* Transcript Display */}
        {transcript && (
          <div
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 
                         shadow-xl max-w-md w-full text-center animate-fadeIn"
          >
            <p className="text-white/80 text-sm mb-2">You said:</p>
            <p className="text-white font-medium text-lg">{transcript}</p>
          </div>
        )}

        {/* Latest AI Response */}
        {messages.length > 0 &&
          messages[messages.length - 1].role === "assistant" && (
            <div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 
                         shadow-xl max-w-md w-full text-center animate-fadeIn"
            >
              <p className="text-white/80 text-sm mb-2">AI Response:</p>
              <p className="text-white text-base leading-relaxed">
                {messages[messages.length - 1].content}
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default VoiceChat;
