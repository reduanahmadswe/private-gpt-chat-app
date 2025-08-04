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
    <>
      {isVoiceMode ? (
        // Full screen layout for VoiceChat
        <div className="fixed inset-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent backdrop-blur-xl z-50">
          <div className="w-full h-full flex items-center justify-center p-4">
            <VoiceChat
              loading={loading}
              onBack={() => handleVoiceModeToggle(false)}
            />
          </div>
        </div>
      ) : (
        // Normal sticky layout for TextInput
        <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent p-3 md:p-4 lg:p-6 backdrop-blur-xl border-t border-white/10">
          <div className="w-full max-w-4xl mx-auto flex flex-col space-y-4">
            <div className="relative">
              {/* Input Container */}
              <div className="bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-xl rounded-xl md:rounded-2xl lg:rounded-3xl border border-slate-600/50 shadow-2xl shadow-black/20 overflow-hidden">
                <div className="flex items-end">
                  {/* Text Input Area */}
                  <div className="flex-1 relative">
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
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-1 p-2">
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
              </div>
            </div>

            {/* Status Messages */}
            <StatusMessages
              isListening={isListening}
              isVoiceMode={isVoiceMode}
              isVoiceToTextSupported={isVoiceToTextSupported}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatInput;
