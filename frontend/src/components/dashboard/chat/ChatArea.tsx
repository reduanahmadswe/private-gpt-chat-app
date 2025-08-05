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

      // If we're at the very top (first few pixels), show header
      if (currentScrollY <= 3) {
        setIsHeaderVisible(true);
      } else {
        // Hide header when scrolling anywhere else for maximum chat space
        setIsHeaderVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    const container = scrollContainerRef.current;
    if (container) {
      // Use requestAnimationFrame for smoother scrolling on all devices
      let ticking = false;
      const smoothHandleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      };

      container.addEventListener("scroll", smoothHandleScroll, {
        passive: true,
      });
      container.addEventListener("touchmove", smoothHandleScroll, {
        passive: true,
      });

      // Check initial state
      handleScroll();

      return () => {
        container.removeEventListener("scroll", smoothHandleScroll);
        container.removeEventListener("touchmove", smoothHandleScroll);
      };
    }
  }, [lastScrollY, isInitialized]);

  // Reset header visibility when switching chats
  useEffect(() => {
    setIsHeaderVisible(true);
    setLastScrollY(0);
    setIsInitialized(false);
  }, [currentChat]);

  return (
    <div
      className={`flex-1 flex flex-col h-screen max-h-screen bg-gradient-to-br from-[#030637] via-[#1a1a2e] to-[#16213e] backdrop-blur-xl transition-all duration-300 relative overflow-hidden ${
        isVoiceMode
          ? "ml-0" // Full screen in voice mode
          : showSettings
          ? "lg:mr-96"
          : "mr-0"
      } ${
        isVoiceMode
          ? "ml-0" // Full screen in voice mode
          : sidebarCollapsed
          ? "ml-0 md:ml-16" // Full width on mobile/tablet, collapsed sidebar width on desktop
          : "ml-0 md:ml-72 lg:ml-80 xl:ml-96"
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 h-full">
        <div
          ref={scrollContainerRef}
          className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 transition-all duration-200 ease-out scroll-smooth webkit-scrolling-touch ${
            isHeaderVisible && !isVoiceMode
              ? "pt-16 xs:pt-18 sm:pt-20 lg:pt-24"
              : "pt-0"
          }`}
          style={{
            WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
            overscrollBehavior: "contain", // Prevent overscroll effects
            height: "calc(100vh - 120px)", // Ensure proper height calculation
            maxHeight: "calc(100vh - 120px)",
          }}
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

        {/* Fixed Input Area */}
        <ChatInput
          loading={loading}
          onSendMessage={onSendMessage}
          onVoiceModeChange={handleVoiceModeChange}
        />
      </div>
    </div>
  );
};

export default ChatArea;
