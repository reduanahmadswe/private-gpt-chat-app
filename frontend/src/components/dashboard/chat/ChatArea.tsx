import React, { useEffect, useRef, useState } from "react";
import { Chat, Message } from "../../../hooks/useChat";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

interface ChatAreaProps {
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  showSettings: boolean;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  playingMessageIndex: number | null;
  streamingMessageIndex: number | null;
  playMessageAudio: (content: string, messageIndex: number) => void;
  downloadMessage: (content: string, messageIndex: number) => void;
  onSendMessage: (message: string) => void;
  onVoiceModeChange?: (isVoiceMode: boolean) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  currentChat,
  messages,
  loading,
  showSettings,
  sidebarCollapsed,
  setSidebarCollapsed,
  playingMessageIndex,
  streamingMessageIndex,
  playMessageAudio,
  downloadMessage,
  onSendMessage,
  onVoiceModeChange,
}) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleVoiceModeChange = (voiceMode: boolean) => {
    setIsVoiceMode(voiceMode);
    if (onVoiceModeChange) {
      onVoiceModeChange(voiceMode);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const currentScrollY = container.scrollTop;
      const maxScrollY = container.scrollHeight - container.clientHeight;

      // If content doesn't need scrolling, always show header
      if (maxScrollY <= 0) {
        setIsHeaderVisible(true);
        return;
      }

      // Initialize the lastScrollY on first scroll
      if (!isInitialized) {
        setLastScrollY(currentScrollY);
        setIsInitialized(true);
        return;
      }

      // If we're at the very top, always show header
      if (currentScrollY <= 5) {
        setIsHeaderVisible(true);
      } else {
        // Only check scroll direction if there's meaningful movement
        const scrollDifference = Math.abs(currentScrollY - lastScrollY);
        if (scrollDifference > 3) {
          if (currentScrollY < lastScrollY) {
            // Scrolling UP - hide header to give more reading space
            setIsHeaderVisible(false);
          } else {
            // Scrolling DOWN - show header
            setIsHeaderVisible(true);
          }
        }
      }

      setLastScrollY(currentScrollY);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      // Check initial state
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [lastScrollY, isInitialized]);

  // Reset header visibility when switching chats
  useEffect(() => {
    setIsHeaderVisible(true);
    setLastScrollY(0);
    setIsInitialized(false);
  }, [currentChat]);

  return (
    <div
      className={`flex-1 flex flex-col h-screen bg-gradient-to-br from-[#030637] via-[#1a1a2e] to-[#16213e] backdrop-blur-xl transition-all duration-300 relative ${
        isVoiceMode
          ? "ml-0" // Full screen in voice mode
          : showSettings
          ? "lg:mr-96"
          : "mr-0"
      } ${
        isVoiceMode
          ? "ml-0" // Full screen in voice mode
          : sidebarCollapsed
          ? "ml-16"
          : "ml-64 lg:ml-80"
      }`}
    >
      {!isVoiceMode && (
        <ChatHeader
          currentChat={currentChat}
          messagesCount={messages.length}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          isHeaderVisible={isHeaderVisible}
        />
      )}

      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 transition-all duration-300 ${
          isHeaderVisible && !isVoiceMode ? "pt-20 lg:pt-24" : "pt-0"
        }`}
      >
        {!isVoiceMode && (
          <ChatMessages
            messages={messages}
            loading={loading}
            playingMessageIndex={playingMessageIndex}
            streamingMessageIndex={streamingMessageIndex}
            playMessageAudio={playMessageAudio}
            downloadMessage={downloadMessage}
          />
        )}
      </div>

      <ChatInput
        loading={loading}
        onSendMessage={onSendMessage}
        onVoiceModeChange={handleVoiceModeChange}
      />
    </div>
  );
};

export default ChatArea;
