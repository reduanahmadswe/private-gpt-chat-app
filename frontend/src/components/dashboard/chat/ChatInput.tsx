import React, { useEffect, useState } from "react";
import { useVoiceToText } from "../../../hooks/useVoiceToText";
import VoiceChat from "./VoiceChat";
import {
  SendButton,
  StatusMessages,
  TextInputField,
  VoiceModeToggleButton,
} from "./components";

interface ChatInputProps {
  loading: boolean;
  onSendMessage: (message: string) => void;
  onVoiceModeChange?: (isVoiceMode: boolean) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  loading,
  onSendMessage,
  onVoiceModeChange,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  // Voice-to-text hook
  const {
    isListening,
    isSupported: isVoiceToTextSupported,
    transcript,
    interimTranscript,
    toggleListening,
    resetTranscript,
  } = useVoiceToText();

  // Update input message when transcript changes
  useEffect(() => {
    if (transcript) {
      setInputMessage((prev) => {
        const newText = prev + (prev ? " " : "") + transcript;
        resetTranscript();
        return newText;
      });
    }
  }, [transcript, resetTranscript]);

  const handleVoiceModeToggle = (voiceMode: boolean) => {
    setIsVoiceMode(voiceMode);
    if (onVoiceModeChange) {
      onVoiceModeChange(voiceMode);
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || loading) return;
    onSendMessage(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !loading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = "20px";
    target.style.height = target.scrollHeight + "px";
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
      <div className="w-full max-w-4xl mx-auto">
        {isVoiceMode ? (
          <VoiceChat
            loading={loading}
            onBack={() => handleVoiceModeToggle(false)}
          />
        ) : (
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 p-2">
            <div className="flex items-end space-x-2 lg:space-x-4">
              {/* Input field with voice-to-text */}
              <TextInputField
                value={inputMessage}
                interimTranscript={interimTranscript}
                loading={loading}
                isVoiceToTextSupported={isVoiceToTextSupported}
                isListening={isListening}
                onChange={setInputMessage}
                onKeyPress={handleKeyPress}
                onInput={handleInput}
                onClear={() => setInputMessage("")}
                onVoiceToTextToggle={toggleListening}
              />

              {/* Voice Mode Toggle Button */}
              <VoiceModeToggleButton
                loading={loading}
                onClick={() => handleVoiceModeToggle(true)}
              />

              {/* Send Button */}
              <SendButton
                loading={loading}
                disabled={loading || !inputMessage.trim()}
                onClick={handleSendMessage}
                hasMessage={!!inputMessage.trim()}
              />
            </div>
          </div>
        )}

        {/* Status Messages */}
        <StatusMessages
          isListening={isListening}
          isVoiceMode={isVoiceMode}
          isVoiceToTextSupported={isVoiceToTextSupported}
        />
      </div>
    </div>
  );
};

export default ChatInput;
