import jsPDF from "jspdf";
import React, { useEffect, useState } from "react";
import { useChat } from "../../hooks/useChat";
import { useSpeechSynthesis } from "../../hooks/useSpeechSynthesis";
import ChatArea from "./chat/ChatArea";
import SettingsPanel from "./settings/SettingsPanel";
import Sidebar from "./sidebar/Sidebar";

// PDF Helper Functions
const drawHeaderLogo = (doc: jsPDF, pageWidth: number, topMargin: number) => {
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  // Draw logo left
  doc.text("🤖 AI Bondhu", 36, topMargin - 10);
  // Draw logo right
  doc.text("🤖 AI Bondhu", pageWidth - 36 - 30, topMargin - 10, {
    align: "right",
  });
};

const drawFooter = (doc: jsPDF, pageWidth: number, pageHeight: number) => {
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  const footerText = "© AI Bondhu | aibondhu.com";
  doc.text(footerText, pageWidth / 2, pageHeight - 30, { align: "center" });
};

const drawWatermark = (doc: jsPDF, pageWidth: number, pageHeight: number) => {
  doc.setFontSize(45);
  doc.setTextColor(240, 240, 240);
  doc.text("🤖 AI Bondhu", pageWidth / 2, pageHeight / 2, {
    align: "center",
    angle: 45,
  });
};

const addFormattedText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  margins: { top: number; bottom: number; left: number; right: number }
) => {
  const lines = text.split("\n");
  let currentY = y;
  const lineHeight = 12;
  const paragraphSpacing = 6;
  const { top, bottom } = margins;
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  lines.forEach((line, lineIndex) => {
    // Check if we need a new page
    if (currentY > pageHeight - bottom - 40) {
      doc.addPage();
      drawWatermark(doc, pageWidth, pageHeight);
      drawHeaderLogo(doc, pageWidth, top);
      drawFooter(doc, pageWidth, pageHeight);
      currentY = top + 30;
    }

    // Handle empty lines
    if (line.trim() === "" && lineIndex > 0) {
      currentY += paragraphSpacing;
      return;
    }

    if (line.trim() === "") return;

    // Helper function for wrapped text
    const addWrappedLine = (
      content: string,
      fontStyle: "normal" | "bold",
      indent = 0
    ) => {
      doc.setFont("helvetica", fontStyle);
      const wrapped = doc.splitTextToSize(content, maxWidth - indent);
      wrapped.forEach((wLine: string) => {
        if (currentY > pageHeight - bottom - 40) {
          doc.addPage();
          drawWatermark(doc, pageWidth, pageHeight);
          drawHeaderLogo(doc, pageWidth, top);
          drawFooter(doc, pageWidth, pageHeight);
          currentY = top + 30;
        }
        doc.text(wLine, x + indent, currentY);
        currentY += lineHeight;
      });
    };

    // Handle bullet points
    if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text("•", x, currentY);
      const content = line.trim().substring(2);
      addWrappedLine(content, "normal", 20);
      currentY += 4;
      return;
    }

    // Handle bold text (**text**)
    if (line.includes("**")) {
      const parts = line.split("**");
      let cursorX = x;

      // Auto-detect definitions
      const isDefinition =
        line.toLowerCase().includes("definition") ||
        line.toLowerCase().includes("explanation") ||
        line.toLowerCase().includes("note") ||
        line.toLowerCase().includes("important") ||
        line.match(/^\*\*[A-Z][^*]*:\*\*/);

      if (isDefinition) {
        currentY += 4;
      }

      parts.forEach((part, idx) => {
        const style = idx % 2 === 0 ? "normal" : "bold";
        if (idx % 2 === 1 && isDefinition) {
          doc.setTextColor(0, 80, 160); // Blue for definitions
        } else {
          doc.setTextColor(0, 0, 0); // Black for normal text
        }

        const words = part.split(" ");
        words.forEach((word, wIdx) => {
          const wordWithSpace = word + (wIdx < words.length - 1 ? " " : "");
          const width = doc.getTextWidth(wordWithSpace);

          if (cursorX + width > pageWidth - margins.right) {
            cursorX = x;
            currentY += lineHeight;

            // Check for new page after line wrap
            if (currentY > pageHeight - bottom - 40) {
              doc.addPage();
              drawWatermark(doc, pageWidth, pageHeight);
              drawHeaderLogo(doc, pageWidth, top);
              drawFooter(doc, pageWidth, pageHeight);
              currentY = top + 30;
            }
          }

          doc.setFont("helvetica", style);
          doc.text(wordWithSpace, cursorX, currentY);
          cursorX += width;
        });
      });

      doc.setTextColor(0, 0, 0); // Reset color
      currentY += lineHeight + (isDefinition ? 6 : 2);
    } else {
      // Regular paragraph text
      doc.setTextColor(0, 0, 0);
      addWrappedLine(line, "normal");
      currentY += 4;
    }
  });

  return currentY;
};

const DashboardLayout: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  // Check if mobile screen and collapse sidebar on mobile by default
  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 640; // sm breakpoint
      setSidebarCollapsed(isMobile);
    };

    // Check on mount
    checkScreenSize();

    // Check on resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  // Download chat as PDF
  const downloadChatAsPDF = async (chatId: string) => {
    try {
      const chat = chats.find((c) => c._id === chatId);
      if (!chat) return;

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Margins: Left/Right/Top = 0.5 inch (36pt), Bottom = 1 inch (72pt)
      const margins = {
        left: 36,
        right: 36,
        top: 36,
        bottom: 72,
      };
      const maxWidth = pageWidth - margins.left - margins.right;

      // Add initial page elements
      drawWatermark(doc, pageWidth, pageHeight);
      drawHeaderLogo(doc, pageWidth, margins.top);
      drawFooter(doc, pageWidth, pageHeight);

      // Add chat title
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(
        `Chat: ${chat.title || "Untitled Chat"}`,
        margins.left,
        margins.top + 10
      );

      let yPosition = margins.top + 40;

      chat.messages.forEach((message) => {
        const role = message.role === "user" ? "You" : "AI Assistant";

        // Check if we need a new page before adding role
        if (yPosition > pageHeight - margins.bottom - 60) {
          doc.addPage();
          drawWatermark(doc, pageWidth, pageHeight);
          drawHeaderLogo(doc, pageWidth, margins.top);
          drawFooter(doc, pageWidth, pageHeight);
          yPosition = margins.top + 40;
        }

        // Add role with styling and better spacing
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 100, 200); // Blue color for role

        // Add a subtle background for the role
        doc.setFillColor(240, 248, 255); // Very light blue background
        doc.rect(margins.left - 5, yPosition - 8, maxWidth + 10, 15, "F");

        doc.text(`${role}:`, margins.left, yPosition);
        yPosition += 20;

        // Add message content with formatting
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0); // Black for content
        yPosition = addFormattedText(
          doc,
          message.content,
          margins.left,
          yPosition,
          maxWidth,
          margins
        );
        yPosition += 15; // Extra space between messages
      });

      // Download the PDF
      doc.save(
        `${chat.title || "chat"}-${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Error downloading chat as PDF:", error);
    }
  };

  // Download single message as PDF
  const downloadMessageAsPDF = async (
    content: string,
    messageIndex: number
  ) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Margins: Left/Right/Top = 0.5 inch (36pt), Bottom = 1 inch (72pt)
      const margins = {
        left: 36,
        right: 36,
        top: 36,
        bottom: 72,
      };
      const maxWidth = pageWidth - margins.left - margins.right;

      // Add initial page elements
      drawWatermark(doc, pageWidth, pageHeight);
      drawHeaderLogo(doc, pageWidth, margins.top);
      drawFooter(doc, pageWidth, pageHeight);

      // Add message title
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`Message ${messageIndex + 1}`, margins.left, margins.top + 10);

      // Add message content with formatting
      doc.setFontSize(11);
      addFormattedText(
        doc,
        content,
        margins.left,
        margins.top + 40,
        maxWidth,
        margins
      );

      // Download the PDF
      doc.save(
        `message-${messageIndex + 1}-${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
    } catch (error) {
      console.error("Error downloading message as PDF:", error);
    }
  };

  const handleSendMessage = (inputMessage: string) => {
    sendMessage(inputMessage);
  };

  const handleVoiceModeChange = (voiceMode: boolean) => {
    setIsVoiceMode(voiceMode);
  };

  return (
    <div className="min-h-screen bg-[#030637] flex overflow-hidden font-sans relative">
      {/* Backdrop overlay for mobile settings */}
      {showSettings && !isVoiceMode && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-25 lg:hidden"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Sidebar - Hidden in voice mode */}
      {!isVoiceMode && (
        <Sidebar
          chats={chats}
          currentChat={currentChat}
          editingTitle={editingTitle}
          newTitle={newTitle}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          setEditingTitle={setEditingTitle}
          setNewTitle={setNewTitle}
          startNewChat={startNewChat}
          selectChat={selectChat}
          updateChatTitle={updateChatTitle}
          shareChat={shareChat}
          downloadChat={downloadChatAsPDF}
          deleteChat={deleteChat}
        />
      )}

      {/* Settings Panel - Hidden in voice mode */}
      {!isVoiceMode && (
        <SettingsPanel
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />
      )}

      {/* Main Chat Area */}
      <ChatArea
        currentChat={currentChat}
        messages={messages}
        loading={loading}
        showSettings={showSettings}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        playingMessageIndex={playingMessageIndex}
        streamingMessageIndex={streamingMessageIndex}
        playMessageAudio={playMessageAudio}
        downloadMessage={downloadMessageAsPDF}
        onSendMessage={handleSendMessage}
        onVoiceModeChange={handleVoiceModeChange}
      />
    </div>
  );
};

export default DashboardLayout;
