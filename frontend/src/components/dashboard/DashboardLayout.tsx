import React, { useState } from "react";
import { useChat } from "../../hooks/useChat";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import ChatArea from "./chat/ChatArea";
import SettingsPanel from "./settings/SettingsPanel";
import Sidebar from "./sidebar/Sidebar";

const DashboardLayout: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);

  // Chat functionality
  const {
    chats,
    currentChat,
    messages,
    loading,
    editingTitle,
    newTitle,
    streamingMessageIndex,
    setEditingTitle,
    setNewTitle,
    startNewChat,
    selectChat,
    sendMessage,
    deleteChat,
    updateChatTitle,
    shareChat,
  } = useChat();

  // Speech synthesis functionality
  const { playMessageAudio, playingMessageIndex } = useSpeechSynthesis();

  const handleSendMessage = (inputMessage: string) => {
    sendMessage(inputMessage);
  };

  return (
    <div className="min-h-screen bg-[#030637] flex overflow-hidden font-sans relative">
      {/* Backdrop overlay for mobile settings */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-25 lg:hidden"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        chats={chats}
        currentChat={currentChat}
        editingTitle={editingTitle}
        newTitle={newTitle}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        setEditingTitle={setEditingTitle}
        setNewTitle={setNewTitle}
        startNewChat={startNewChat}
        selectChat={selectChat}
        updateChatTitle={updateChatTitle}
        shareChat={shareChat}
        deleteChat={deleteChat}
      />

      {/* Settings Panel */}
      <SettingsPanel
        showSettings={showSettings}
        setShowSettings={setShowSettings}
      />

      {/* Main Chat Area */}
      <ChatArea
        currentChat={currentChat}
        messages={messages}
        loading={loading}
        showSettings={showSettings}
        playingMessageIndex={playingMessageIndex}
        streamingMessageIndex={streamingMessageIndex}
        playMessageAudio={playMessageAudio}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default DashboardLayout;
