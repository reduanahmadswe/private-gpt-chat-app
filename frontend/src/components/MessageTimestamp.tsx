import React, { useEffect, useState } from "react";

interface MessageTimestampProps {
  messageId: string; // Unique identifier for the message
  className?: string;
}

const MessageTimestamp: React.FC<MessageTimestampProps> = ({
  messageId,
  className = "",
}) => {
  const [savedTime, setSavedTime] = useState<string>("");

  useEffect(() => {
    // Check if we already have a saved timestamp for this message
    const storageKey = `message_timestamp_${messageId}`;
    const existingTimestamp = localStorage.getItem(storageKey);

    if (existingTimestamp) {
      // Use the saved timestamp
      setSavedTime(existingTimestamp);
    } else {
      // Create new timestamp and save it
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      localStorage.setItem(storageKey, timeString);
      setSavedTime(timeString);
    }
  }, [messageId]);

  return <span className={className}>{savedTime}</span>;
};

export default MessageTimestamp;
