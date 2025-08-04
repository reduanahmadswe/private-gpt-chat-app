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
  const lastSpokenContentRef = useRef<string>("");
  const isStreamingSpeechRef = useRef<boolean>(false);
  const streamingTimeoutRef = useRef<number | null>(null);
  const currentResponseIdRef = useRef<string>("");
  const isPlaybackActiveRef = useRef<boolean>(false);
  const lastProcessedMessageRef = useRef<string>(""); // Track last processed message
  const { sendMessage, messages } = useChat();

  // Improved audio playback system - plays complete responses immediately
  const speakCompleteResponse = async (
    responseContent: string,
    responseId: string
  ) => {
    if (!("speechSynthesis" in window)) {
      console.log("Speech synthesis not supported");
      return;
    }

    // CRITICAL: Block if any audio is currently playing
    if (isPlaybackActiveRef.current || window.speechSynthesis.speaking) {
      console.log("🚫 BLOCKED: Audio already playing, ignoring new request");
      return;
    }

    // Prevent duplicate playback of the same response
    if (currentResponseIdRef.current === responseId) {
      console.log("🚫 BLOCKED: Same response already played/playing");
      return;
    }

    // Clean the content for speech
    const cleanContent = responseContent.trim();
    if (!cleanContent) {
      console.log("🔇 No content to speak");
      return;
    }

    console.log("🎯 Starting complete response playback");
    console.log("📝 Content length:", cleanContent.length);
    console.log("📝 Preview:", cleanContent.substring(0, 100) + "...");

    // Lock the entire system
    isPlaybackActiveRef.current = true;
    isStreamingSpeechRef.current = true;
    currentResponseIdRef.current = responseId;
    setVoiceState(VoiceState.SPEAKING);

    const utterance = new SpeechSynthesisUtterance(cleanContent);

    // Configure speech settings for better quality
    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = "en-US";

    // Get the best available voice
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferredVoice =
        voices.find(
          (voice) =>
            voice.lang.includes("en") &&
            (voice.name.includes("Female") ||
              voice.name.includes("Google") ||
              voice.name.includes("Microsoft") ||
              voice.name.includes("Samantha") ||
              voice.name.includes("Karen"))
        ) ||
        voices.find((voice) => voice.lang.includes("en")) ||
        voices[0];

      utterance.voice = preferredVoice;
      console.log("🎙️ Using voice:", preferredVoice.name);
    }

    utterance.onstart = () => {
      console.log("✅ Audio playback started - system fully locked");
      // Ensure UI reflects speaking state
      setVoiceState(VoiceState.SPEAKING);
    };

    utterance.onend = () => {
      console.log("✅ Audio playback completed naturally");

      // Release all locks immediately
      isPlaybackActiveRef.current = false;
      isStreamingSpeechRef.current = false;
      currentResponseIdRef.current = ""; // Clear response ID to allow new responses

      // Reset to IDLE state immediately
      setVoiceState(VoiceState.IDLE);
      console.log("🔓 System unlocked and ready for new input");
    };

    utterance.onerror = (error) => {
      console.error("❌ Audio playback error:", error.error);

      // Release all locks immediately on error
      isPlaybackActiveRef.current = false;
      isStreamingSpeechRef.current = false;
      currentResponseIdRef.current = ""; // Clear response ID

      // Reset to IDLE immediately
      setVoiceState(VoiceState.IDLE);
      console.log("🔓 System reset after audio error");
    };

    utterance.onpause = () => {
      console.log("⏸️ Audio playback paused");
    };

    utterance.onresume = () => {
      console.log("▶️ Audio playback resumed");
    };

    // Start the audio playback
    window.speechSynthesis.speak(utterance);
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
          // Check if we should still be listening
          if (recognition && !isPlaybackActiveRef.current) {
            try {
              recognition.start();
            } catch (e) {
              console.log("Could not restart recognition:", e);
            }
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
      if (streamingTimeoutRef.current) {
        clearTimeout(streamingTimeoutRef.current);
      }
    };
  }, []); // Remove voiceState dependency to prevent infinite recreation

  // Handle sending message and getting response
  const handleSendMessage = async (message: string) => {
    // Block new messages if audio is playing
    if (isPlaybackActiveRef.current || window.speechSynthesis.speaking) {
      console.log("🚫 BLOCKED: Cannot send message while audio is playing");
      return;
    }

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
      // Stop current audio playback
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      // Reset all locks
      isPlaybackActiveRef.current = false;
      isStreamingSpeechRef.current = false;
      setVoiceState(VoiceState.IDLE);
    } else if (voiceState === VoiceState.IDLE && !isPlaybackActiveRef.current) {
      // Only allow new input if no audio is playing
      recognitionRef.current?.start();
    }
  };

  // Monitor messages for new AI responses - immediate playback
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    // Only process assistant messages with content
    if (lastMessage.role !== "assistant" || !lastMessage.content) {
      return;
    }

    // Prevent processing the same message multiple times
    const messageHash = `${lastMessage.content}-${messages.length}`;
    if (lastProcessedMessageRef.current === messageHash) {
      console.log("🔇 Same message already processed, skipping");
      return;
    }

    // Skip if we're already playing audio
    if (isPlaybackActiveRef.current || window.speechSynthesis.speaking) {
      console.log("🚫 BLOCKED: Audio already playing, skipping new response");
      return;
    }

    // Mark this message as processed
    lastProcessedMessageRef.current = messageHash;

    // Generate unique ID for this response
    const responseId = `${lastMessage.content.substring(0, 50)}-${Date.now()}`;

    console.log(
      "🎯 New assistant response detected, starting immediate playback"
    );

    // Add a small delay to ensure the message is fully processed
    setTimeout(() => {
      speakCompleteResponse(lastMessage.content, responseId);
    }, 100);
  }, [messages]);

  // Reset state when changing to IDLE
  useEffect(() => {
    if (voiceState === VoiceState.IDLE) {
      // Only reset if we're not actively playing audio
      if (!isPlaybackActiveRef.current && !window.speechSynthesis.speaking) {
        lastSpokenContentRef.current = "";
        currentResponseIdRef.current = "";
        lastProcessedMessageRef.current = ""; // Reset message tracking

        // Clear any pending timeouts
        if (streamingTimeoutRef.current) {
          clearTimeout(streamingTimeoutRef.current);
          streamingTimeoutRef.current = null;
        }

        console.log("🔄 State reset to IDLE - ready for new interactions");
      }
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
            loading={isPlaybackActiveRef.current}
            onAction={handleVoiceControl}
          />
        </div>

        {/* Speaking indicator */}
        {voiceState === VoiceState.SPEAKING && (
          <div className="text-center">
            <p className="text-white/80 text-sm">Speaking...</p>
            <div className="mt-2 flex justify-center space-x-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceChat;
