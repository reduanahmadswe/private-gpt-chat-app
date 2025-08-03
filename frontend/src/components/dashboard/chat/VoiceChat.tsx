import { Mic, MicOff, Square, Volume2, VolumeX } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

// Speech Recognition types
interface VoiceSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (() => void) | null;
  onresult: ((event: VoiceSpeechRecognitionEvent) => void) | null;
  onerror: ((event: VoiceSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface VoiceSpeechRecognitionEvent {
  resultIndex: number;
  results: VoiceSpeechRecognitionResultList;
}

interface VoiceSpeechRecognitionResultList {
  length: number;
  [index: number]: VoiceSpeechRecognitionResult;
}

interface VoiceSpeechRecognitionResult {
  length: number;
  isFinal: boolean;
  [index: number]: VoiceSpeechRecognitionAlternative;
}

interface VoiceSpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface VoiceSpeechRecognitionErrorEvent {
  error: string;
}

interface VoiceChatProps {
  loading: boolean;
  onVoiceMessage: (message: string) => Promise<string>;
}

enum VoiceState {
  IDLE = "idle",
  LISTENING = "listening",
  PROCESSING = "processing",
  SPEAKING = "speaking",
}

const VoiceChat: React.FC<VoiceChatProps> = ({ loading, onVoiceMessage }) => {
  const [voiceState, setVoiceState] = useState<VoiceState>(VoiceState.IDLE);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");

  const recognitionRef = useRef<VoiceSpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setVoiceState(VoiceState.LISTENING);
          setCurrentTranscript("");
        };

        recognition.onresult = (event: VoiceSpeechRecognitionEvent) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          if (finalTranscript) {
            setCurrentTranscript(finalTranscript);
            processVoiceInput(finalTranscript);
          } else {
            setCurrentTranscript(interimTranscript);
          }
        };

        recognition.onerror = (event: VoiceSpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error);
          setVoiceState(VoiceState.IDLE);
          setCurrentTranscript("");

          switch (event.error) {
            case "no-speech":
              toast.error("No speech detected. Please try again.");
              break;
            case "network":
              toast.error("Network error. Please check your connection.");
              break;
            case "not-allowed":
              toast.error(
                "Microphone access denied. Please allow microphone access."
              );
              break;
            case "aborted":
              // Don't show error for intentional stops
              break;
            default:
              toast.error("Speech recognition error. Please try again.");
          }
        };

        recognition.onend = () => {
          if (voiceState === VoiceState.LISTENING) {
            setVoiceState(VoiceState.IDLE);
            setCurrentTranscript("");
          }
        };

        recognitionRef.current = recognition;
      }

      // Initialize speech synthesis
      if ("speechSynthesis" in window) {
        synthRef.current = window.speechSynthesis;
      }
    }

    return () => {
      stopListening();
      stopSpeaking();
    };
  }, []);

  const processVoiceInput = useCallback(
    async (transcript: string) => {
      if (!transcript.trim()) return;

      try {
        setVoiceState(VoiceState.PROCESSING);
        const response = await onVoiceMessage(transcript.trim());

        if (response) {
          await speakResponse(response);
        }
      } catch (error) {
        console.error("Error processing voice input:", error);
        toast.error("Failed to process your message.");
        setVoiceState(VoiceState.IDLE);
      }
    },
    [onVoiceMessage]
  );

  const speakResponse = useCallback(async (text: string) => {
    if (!synthRef.current || !text) {
      setVoiceState(VoiceState.IDLE);
      return;
    }

    try {
      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Configure voice settings
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to use a good quality voice
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(
        (voice) =>
          voice.name.includes("Google") ||
          voice.name.includes("Microsoft") ||
          voice.lang.startsWith("en")
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setVoiceState(VoiceState.SPEAKING);
      };

      utterance.onend = () => {
        setVoiceState(VoiceState.IDLE);
        currentUtteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setVoiceState(VoiceState.IDLE);
        toast.error("Failed to play audio response.");
      };

      currentUtteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    } catch (error) {
      console.error("Error in text-to-speech:", error);
      setVoiceState(VoiceState.IDLE);
      toast.error("Failed to speak response.");
    }
  }, []);

  const startListening = useCallback(() => {
    if (!speechSupported || !recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    if (voiceState !== VoiceState.IDLE) return;

    try {
      // Stop any ongoing speech first
      stopSpeaking();

      recognitionRef.current.start();
      toast.success("Listening... Speak now!");
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      toast.error("Failed to start listening.");
    }
  }, [speechSupported, voiceState]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && voiceState === VoiceState.LISTENING) {
      recognitionRef.current.stop();
      setVoiceState(VoiceState.IDLE);
      setCurrentTranscript("");
    }
  }, [voiceState]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (currentUtteranceRef.current) {
      currentUtteranceRef.current = null;
    }
    if (voiceState === VoiceState.SPEAKING) {
      setVoiceState(VoiceState.IDLE);
    }
  }, [voiceState]);

  const handleMainAction = useCallback(() => {
    switch (voiceState) {
      case VoiceState.IDLE:
        startListening();
        break;
      case VoiceState.LISTENING:
        stopListening();
        break;
      case VoiceState.PROCESSING:
        // Can't stop processing
        break;
      case VoiceState.SPEAKING:
        stopSpeaking();
        break;
    }
  }, [voiceState, startListening, stopListening, stopSpeaking]);

  const getMainButtonContent = () => {
    switch (voiceState) {
      case VoiceState.IDLE:
        return {
          icon: <Mic className="h-8 w-8 lg:h-10 lg:w-10" />,
          text: "Click to speak",
          className:
            "bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] shadow-[#00f5ff]/30",
        };
      case VoiceState.LISTENING:
        return {
          icon: <MicOff className="h-8 w-8 lg:h-10 lg:w-10" />,
          text: "Listening... Click to stop",
          className:
            "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/30 animate-pulse",
        };
      case VoiceState.PROCESSING:
        return {
          icon: (
            <div className="w-8 h-8 lg:w-10 lg:h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ),
          text: "Processing...",
          className:
            "bg-gradient-to-r from-yellow-500 to-orange-500 shadow-yellow-500/30",
        };
      case VoiceState.SPEAKING:
        return {
          icon: <Volume2 className="h-8 w-8 lg:h-10 lg:w-10 animate-pulse" />,
          text: "Speaking... Click to stop",
          className:
            "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/30",
        };
    }
  };

  const buttonContent = getMainButtonContent();

  if (!speechSupported) {
    return (
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
        <div className="w-full max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-red-500/30 p-6">
            <VolumeX className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Voice Chat Not Available
            </h3>
            <p className="text-red-200 text-sm">
              Your browser doesn't support speech recognition. Please use a
              modern browser like Chrome, Edge, or Safari.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Voice Activity Indicator */}
        {voiceState === VoiceState.LISTENING && currentTranscript && (
          <div className="mb-4 text-center">
            <div className="bg-gradient-to-r from-white/10 to-white/15 backdrop-blur-xl rounded-xl border border-white/20 p-3">
              <p className="text-white/80 text-sm">
                <span className="text-[#00f5ff]">Hearing:</span> "
                {currentTranscript}"
              </p>
            </div>
          </div>
        )}

        {/* Main Voice Control */}
        <div className="flex justify-center">
          <button
            onClick={handleMainAction}
            disabled={loading || voiceState === VoiceState.PROCESSING}
            className={`relative p-6 lg:p-8 rounded-full transition-all duration-300 transform hover:scale-105 disabled:transform-none shadow-2xl ${
              buttonContent.className
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            title={buttonContent.text}
          >
            {/* Pulsing ring for listening state */}
            {voiceState === VoiceState.LISTENING && (
              <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-ping" />
            )}

            {/* Button content */}
            <div className="relative z-10 text-white">{buttonContent.icon}</div>
          </button>
        </div>

        {/* Status Text */}
        <div className="text-center mt-4">
          <p className="text-white font-medium text-lg mb-1">
            {voiceState === VoiceState.IDLE && "Ready to chat"}
            {voiceState === VoiceState.LISTENING && "Listening..."}
            {voiceState === VoiceState.PROCESSING && "Thinking..."}
            {voiceState === VoiceState.SPEAKING && "Speaking..."}
          </p>
          <p className="text-white/60 text-sm">
            {voiceState === VoiceState.IDLE &&
              "Click the microphone to start voice conversation"}
            {voiceState === VoiceState.LISTENING &&
              "Speak clearly and wait for processing"}
            {voiceState === VoiceState.PROCESSING &&
              "AI is generating response..."}
            {voiceState === VoiceState.SPEAKING && "Playing AI response"}
          </p>
        </div>

        {/* Additional Controls */}
        {voiceState === VoiceState.SPEAKING && (
          <div className="flex justify-center mt-4 space-x-3">
            <button
              onClick={stopSpeaking}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 text-red-200 hover:text-white rounded-xl transition-all duration-300"
              title="Stop speaking"
            >
              <Square className="h-4 w-4" />
              <span className="text-sm">Stop</span>
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center mt-6">
          <p className="text-xs text-white/50 leading-relaxed">
            🎤 Voice-only AI chat • No text display • Hands-free conversation
            <br />
            Speak naturally and wait for the AI to respond
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
