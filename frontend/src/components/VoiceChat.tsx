import { Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

enum VoiceState {
  Idle = "idle",
  Listening = "listening",
  Processing = "processing",
  Speaking = "speaking",
}

interface VoiceChatProps {
  onVoiceMessage: (message: string) => Promise<string>;
  loading?: boolean;
}

const VoiceChat: React.FC<VoiceChatProps> = ({
  onVoiceMessage,
  loading = false,
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>(VoiceState.Idle);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition && "speechSynthesis" in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setVoiceState(VoiceState.Listening);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);

        // If we have a final result, process it
        if (finalTranscript.trim()) {
          recognition.stop();
          handleVoiceInput(finalTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        setError(`Speech recognition error: ${event.error}`);
        setVoiceState(VoiceState.Idle);
      };

      recognition.onend = () => {
        if (voiceState === VoiceState.Listening) {
          setVoiceState(VoiceState.Idle);
        }
      };

      recognitionRef.current = recognition;
    } else {
      setError("Speech recognition not supported in this browser");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [voiceState]);

  const handleVoiceInput = async (message: string) => {
    try {
      setVoiceState(VoiceState.Processing);
      setTranscript("");

      const response = await onVoiceMessage(message);

      if (!isMuted && response) {
        await speakResponse(response);
      } else {
        setVoiceState(VoiceState.Idle);
      }
    } catch (error) {
      console.error("Voice processing error:", error);
      setError("Failed to process voice message");
      setVoiceState(VoiceState.Idle);
    }
  };

  const speakResponse = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!synthRef.current || isMuted) {
        resolve();
        return;
      }

      setVoiceState(VoiceState.Speaking);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        setVoiceState(VoiceState.Idle);
        resolve();
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setVoiceState(VoiceState.Idle);
        resolve();
      };

      synthRef.current.speak(utterance);
    });
  };

  const startListening = () => {
    if (!recognitionRef.current || !isSupported) return;

    try {
      setError(null);
      setTranscript("");
      recognitionRef.current.start();
    } catch (error) {
      console.error("Failed to start recognition:", error);
      setError("Failed to start voice recognition");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setVoiceState(VoiceState.Idle);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (synthRef.current && voiceState === VoiceState.Speaking) {
      synthRef.current.cancel();
      setVoiceState(VoiceState.Idle);
    }
  };

  const getStateDisplay = () => {
    switch (voiceState) {
      case VoiceState.Listening:
        return {
          icon: <Mic className="h-8 w-8 text-[#00f5ff] animate-pulse" />,
          text: "Listening...",
          subtext: transcript || "Say something...",
          color: "from-[#00f5ff]/20 to-[#0066ff]/20",
          border: "border-[#00f5ff]/50",
        };
      case VoiceState.Processing:
        return {
          icon: <Loader2 className="h-8 w-8 text-[#9d4edd] animate-spin" />,
          text: "Processing...",
          subtext: "AI is thinking...",
          color: "from-[#9d4edd]/20 to-[#6a4c93]/20",
          border: "border-[#9d4edd]/50",
        };
      case VoiceState.Speaking:
        return {
          icon: <Volume2 className="h-8 w-8 text-[#00ff88] animate-pulse" />,
          text: "Speaking...",
          subtext: "AI is responding...",
          color: "from-[#00ff88]/20 to-[#00cc66]/20",
          border: "border-[#00ff88]/50",
        };
      default:
        return {
          icon: <MicOff className="h-8 w-8 text-[#D0D0D0]" />,
          text: "Voice Chat Ready",
          subtext: "Click the microphone to start",
          color: "from-white/5 to-white/10",
          border: "border-white/20",
        };
    }
  };

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-6 p-8">
        <div className="text-red-400 text-center">
          <MicOff className="h-16 w-16 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            Voice Chat Not Supported
          </h3>
          <p className="text-[#D0D0D0]">
            Your browser doesn't support speech recognition. Please try Chrome,
            Edge, or Safari.
          </p>
        </div>
      </div>
    );
  }

  const stateDisplay = getStateDisplay();
  const isActive = voiceState !== VoiceState.Idle;
  const canStart = voiceState === VoiceState.Idle && !loading;

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 p-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-center">
          {error}
        </div>
      )}

      {/* Main Voice Interface */}
      <div
        className={`relative flex flex-col items-center space-y-6 p-8 rounded-3xl bg-gradient-to-br ${stateDisplay.color} border ${stateDisplay.border} transition-all duration-500`}
      >
        {/* Voice State Icon */}
        <div className="relative">
          <div
            className={`p-6 rounded-full bg-gradient-to-br from-[#030637] to-[#16213e] border ${stateDisplay.border} transition-all duration-300`}
          >
            {stateDisplay.icon}
          </div>
          {isActive && (
            <div className="absolute inset-0 rounded-full animate-ping bg-current opacity-20"></div>
          )}
        </div>

        {/* State Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">{stateDisplay.text}</h2>
          <p className="text-[#D0D0D0] max-w-md">{stateDisplay.subtext}</p>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-black/20 rounded-lg p-4 max-w-md text-center">
            <p className="text-white text-sm">{transcript}</p>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-4">
        {/* Main Voice Button */}
        <button
          onClick={isActive ? stopListening : startListening}
          disabled={
            loading ||
            voiceState === VoiceState.Processing ||
            voiceState === VoiceState.Speaking
          }
          className={`p-4 rounded-full transition-all duration-300 ${
            canStart
              ? "bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 hover:from-[#00f5ff]/30 hover:to-[#9d4edd]/30 border border-[#00f5ff]/30 text-white"
              : isActive
              ? "bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400"
              : "bg-gray-500/20 border border-gray-500/30 text-gray-500 cursor-not-allowed"
          }`}
        >
          {voiceState === VoiceState.Listening ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </button>

        {/* Mute Button */}
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full transition-all duration-300 ${
            isMuted
              ? "bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400"
              : "bg-white/10 hover:bg-white/20 border border-white/20 text-[#D0D0D0] hover:text-white"
          }`}
          title={isMuted ? "Unmute AI Voice" : "Mute AI Voice"}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center text-[#D0D0D0] text-sm max-w-md">
        <p>
          Click the microphone to start a voice conversation. The AI will
          listen, process your message, and respond with voice.
        </p>
      </div>
    </div>
  );
};

export default VoiceChat;
