import React, { useEffect, useState } from "react";

interface RealTimeClockProps {
  className?: string;
}

const RealTimeClock: React.FC<RealTimeClockProps> = ({ className = "" }) => {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Function to update time
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(timeString);
    };

    // Update time immediately
    updateTime();

    // Set interval to update every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return <span className={className}>{currentTime}</span>;
};

export default RealTimeClock;
