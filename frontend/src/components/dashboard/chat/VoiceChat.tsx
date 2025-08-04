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
  const isPlaybackActiveRef = useRef<boolean>(false);
  const lastProcessedMessageRef = useRef<string>(""); // Track last processed message
  const streamingContentRef = useRef<string>(""); // Track streaming content
  const lastPlayedContentRef = useRef<string>(""); // Track last played content
  const streamingUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const streamingTimeoutIdRef = useRef<number | null>(null);
  const isStoppedManuallyRef = useRef<boolean>(false); // Track manual stop
  const { sendMessage, messages, streamingMessageIndex } = useChat();

  // Streaming audio playback system - plays audio as content comes (no interruptions)
  const speakStreamingContent = async (content: string) => {
    if (!("speechSynthesis" in window)) {
      console.log("Speech synthesis not supported");
      return;
    }

    // Only update if there's new content to speak
    const newContent = content
      .substring(lastPlayedContentRef.current.length)
      .trim();
    if (!newContent) {
      return; // No new content to speak
    }

    // If we already have audio playing, don't interrupt - queue the new content
    if (streamingUtteranceRef.current && window.speechSynthesis.speaking) {
      console.log("🎵 Audio already playing, queuing new content...");

      // Clear existing timeout and set new one for delayed playback
      if (streamingTimeoutIdRef.current) {
        clearTimeout(streamingTimeoutIdRef.current);
      }

      streamingTimeoutIdRef.current = window.setTimeout(() => {
        speakStreamingContent(content);
      }, 500); // Wait 500ms and try again

      return;
    }

    console.log(`🎯 Speaking new streaming content: "${newContent}"`);

    // Update tracking
    lastPlayedContentRef.current = content;
    streamingContentRef.current = content;

    // Create utterance for new content
    const utterance = new SpeechSynthesisUtterance(newContent);
    streamingUtteranceRef.current = utterance;

    // Configure speech settings
    utterance.rate = 0.9;
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
    }

    utterance.onstart = () => {
      console.log("✅ Streaming audio started (no interruption)");
      setVoiceState(VoiceState.SPEAKING);
      isPlaybackActiveRef.current = true;
    };

    utterance.onend = () => {
      console.log("✅ Streaming audio chunk completed");
      streamingUtteranceRef.current = null;

      // Check if audio was stopped manually - if so, don't continue
      if (isStoppedManuallyRef.current) {
        console.log("🛑 Audio was stopped manually - not continuing");
        return;
      }

      // Check if there's more content to speak after a brief delay
      setTimeout(() => {
        // Double check if still not manually stopped
        if (isStoppedManuallyRef.current) {
          return;
        }

        const currentMessage = messages[messages.length - 1];
        if (currentMessage && currentMessage.role === "assistant") {
          const remainingContent = currentMessage.content
            .substring(lastPlayedContentRef.current.length)
            .trim();

          if (remainingContent && streamingMessageIndex !== null) {
            // More content is coming, continue streaming
            speakStreamingContent(currentMessage.content);
          } else if (streamingMessageIndex === null) {
            // Streaming is complete
            isPlaybackActiveRef.current = false;
            setVoiceState(VoiceState.IDLE);
            console.log("🔓 Streaming fully completed - ready for new input");
          }
        }
      }, 100);
    };

    utterance.onerror = (error) => {
      console.error("❌ Streaming audio error:", error.error);
      streamingUtteranceRef.current = null;

      // Don't reset state on error, try to continue
      if (error.error !== "interrupted") {
        isPlaybackActiveRef.current = false;
        setVoiceState(VoiceState.IDLE);
      }
    };

    // Start the audio playback
    window.speechSynthesis.speak(utterance);
  };

  // Stop streaming audio
  const stopStreamingAudio = () => {
    console.log("🛑 Stopping streaming audio immediately");

    // Set manual stop flag to prevent restart
    isStoppedManuallyRef.current = true;

    // Clear any pending timeouts first
    if (streamingTimeoutIdRef.current) {
      clearTimeout(streamingTimeoutIdRef.current);
      streamingTimeoutIdRef.current = null;
    }

    // Force cancel all speech synthesis immediately
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();

      // Force pause and cancel again for better browser compatibility
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
    }

    // Clear utterance reference
    if (streamingUtteranceRef.current) {
      streamingUtteranceRef.current = null;
    }

    // Immediately reset all streaming state
    isPlaybackActiveRef.current = false;
    streamingContentRef.current = "";
    lastPlayedContentRef.current = "";

    // Force set state to IDLE immediately
    setVoiceState(VoiceState.IDLE);

    console.log("🔓 Streaming audio stopped immediately - ready for new input");
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
      if (streamingTimeoutIdRef.current) {
        clearTimeout(streamingTimeoutIdRef.current);
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
      // Stop streaming audio immediately
      stopStreamingAudio();
    } else if (voiceState === VoiceState.IDLE && !isPlaybackActiveRef.current) {
      // Only allow new input if no audio is playing
      recognitionRef.current?.start();
    }
  };

  // Monitor messages for streaming audio playback
  useEffect(() => {
    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    // Only process assistant messages with content
    if (lastMessage.role !== "assistant" || !lastMessage.content) {
      return;
    }

    // If streaming is active, play new content as it comes
    if (streamingMessageIndex !== null) {
      console.log("⏳ Streaming in progress, playing new content...");
      speakStreamingContent(lastMessage.content);
      return;
    }

    // If streaming just completed, ensure final content is played
    const messageHash = `${lastMessage.content}-${messages.length}`;
    if (lastProcessedMessageRef.current !== messageHash) {
      console.log("🎯 Streaming completed! Ensuring full content is played");

      // Reset streaming tracking for new response
      lastPlayedContentRef.current = "";
      streamingContentRef.current = "";
      isStoppedManuallyRef.current = false; // Reset manual stop flag for new message

      // Mark as processed
      lastProcessedMessageRef.current = messageHash;

      // Speak any remaining content
      speakStreamingContent(lastMessage.content);
    }
  }, [messages, streamingMessageIndex]);

  // Reset state when changing to IDLE
  useEffect(() => {
    if (voiceState === VoiceState.IDLE) {
      // Only reset if we're not actively playing audio
      if (!isPlaybackActiveRef.current && !window.speechSynthesis.speaking) {
        lastProcessedMessageRef.current = ""; // Reset message tracking
        streamingContentRef.current = ""; // Reset streaming content
        lastPlayedContentRef.current = ""; // Reset content tracking
        isStoppedManuallyRef.current = false; // Reset manual stop flag

        // Clear any pending timeouts
        if (streamingTimeoutIdRef.current) {
          clearTimeout(streamingTimeoutIdRef.current);
          streamingTimeoutIdRef.current = null;
        }

        console.log("🔄 State reset to IDLE - ready for new interactions");
      }
    }
  }, [voiceState]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/10 to-transparent rounded-full animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-pink-500/10 to-transparent rounded-full animate-pulse"></div>
      </div>

      {/* Back Button */}
      <VoiceBackButton onExitVoiceMode={onBack} />

      {/* Main Content - Perfect Center */}
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div className="flex flex-col items-center justify-center text-center max-w-2xl w-full">
          {/* Status Display */}
          <div className="mb-4 sm:mb-6">
            <VoiceStatusDisplay voiceState={voiceState} />
          </div>

          {/* Activity Indicator with Voice Control - Main Center Element */}
          <div className="relative mb-4 sm:mb-6">
            <VoiceActivityIndicator voiceState={voiceState} />
            <VoiceControlButton
              voiceState={voiceState}
              loading={isPlaybackActiveRef.current}
              onAction={handleVoiceControl}
            />
          </div>

          {/* Speaking indicator with Stop button */}
          {voiceState === VoiceState.SPEAKING && (
            <div className="text-center">
              <p className="text-white/80 text-sm mb-3">Speaking...</p>

              {/* Stop Audio Button */}
              <button
                onClick={() => {
                  console.log("🔴 Stop button clicked");
                  stopStreamingAudio();
                }}
                className="mb-4 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 
                           border border-red-400/50 rounded-full text-red-300 
                           transition-all duration-200 text-sm font-medium
                           hover:scale-105 active:scale-95 active:bg-red-500/50
                           focus:outline-none focus:ring-2 focus:ring-red-400/50"
              >
                🛑 Stop Audio
              </button>

              {/* Animation dots */}
              <div className="flex justify-center space-x-1">
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
    </div>
  );
};

export default VoiceChat;
