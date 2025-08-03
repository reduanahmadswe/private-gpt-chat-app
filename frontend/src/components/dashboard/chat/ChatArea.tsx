import React, { useEffect, useRef, useState } from "react";
import { Chat, Message } from "../../../hooks/useChat";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import VoiceChat from "./VoiceChat";

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
}) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false); // Reset to false for normal usage
  const [voiceLoading, setVoiceLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Handle voice chat
  const handleVoiceMessage = async (message: string): Promise<string> => {
    try {
      setVoiceLoading(true);

      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
      // Remove trailing slash to avoid double slash issue
      const baseUrl = API_BASE_URL.replace(/\/$/, "");

      // Try voice endpoint first, fallback to regular chat endpoint
      let response;
      try {
        response = await fetch(`${baseUrl}/api/chat/voice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ message }),
        });
      } catch (voiceError) {
        console.log(
          "Voice endpoint not available, using regular chat endpoint"
        );
        // Fallback to regular chat endpoint
        response = await fetch(`${baseUrl}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            message,
            chatId: null, // New conversation for voice chat
          }),
        });
      }

      if (!response.ok) {
        throw new Error(
          `Voice chat request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return (
        data.response ||
        data.aiResponse ||
        "Sorry, I could not generate a response."
      );
    } catch (error) {
      console.error("Voice chat error:", error);
      throw new Error("Failed to get voice response");
    } finally {
      setVoiceLoading(false);
    }
  };

  return (
    <div
      className={`flex-1 flex flex-col h-screen bg-gradient-to-br from-[#030637] via-[#1a1a2e] to-[#16213e] backdrop-blur-xl transition-all duration-300 relative ${
        showSettings ? "lg:mr-96" : "mr-0"
      } ${sidebarCollapsed ? "ml-16" : "ml-64 lg:ml-80"}`}
    >
      <ChatHeader
        currentChat={currentChat}
        messagesCount={messages.length}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        isHeaderVisible={isHeaderVisible}
        onToggleVoice={() => setIsVoiceMode(!isVoiceMode)}
        isVoiceMode={isVoiceMode}
      />

      <div
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30 transition-all duration-300 ${
          isHeaderVisible ? "pt-20 lg:pt-24" : "pt-0"
        }`}
      >
        {isVoiceMode ? (
          <div className="h-full flex items-center justify-center">
            <VoiceChat
              onVoiceMessage={handleVoiceMessage}
              loading={voiceLoading}
            />
          </div>
        ) : (
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

      {!isVoiceMode && (
        <ChatInput loading={loading} onSendMessage={onSendMessage} />
      )}
    </div>
  );
};

export default ChatArea;
