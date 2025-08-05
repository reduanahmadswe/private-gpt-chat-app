import React from "react";
import ClearButton from "./ClearButton";
import VoiceToTextButton from "./VoiceToTextButton";

interface TextInputFieldProps {
  value: string;
  interimTranscript: string;
  loading: boolean;
  isVoiceToTextSupported: boolean;
  isListening: boolean;
  onChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onInput: (e: React.FormEvent<HTMLTextAreaElement>) => void;
  onClear: () => void;
  onVoiceToTextToggle: () => void;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  value,
  interimTranscript,
  loading,
  isVoiceToTextSupported,
  isListening,
  onChange,
  onKeyPress,
  onInput,
  onClear,
  onVoiceToTextToggle,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Remove interim transcript from the value when user types
    const newValue = e.target.value;
    if (interimTranscript && newValue.includes(interimTranscript)) {
      onChange(newValue.replace(` ${interimTranscript}`, ""));
    } else {
      onChange(newValue);
    }
  };

  // Dynamic placeholder based on screen size
  const [placeholder, setPlaceholder] = React.useState("Type your message...");

  React.useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth >= 640) {
        // sm breakpoint
        setPlaceholder("Type your message... (Shift + Enter for new line)");
      } else {
        setPlaceholder("Type your message...");
      }
    };

    updatePlaceholder();
    window.addEventListener("resize", updatePlaceholder);
    return () => window.removeEventListener("resize", updatePlaceholder);
  }, []);

  return (
    <div className="flex-1 relative">
      <div className="relative flex items-center min-h-[40px] xs:min-h-[44px] sm:min-h-[48px] md:min-h-[52px]">
        {isVoiceToTextSupported && (
          <VoiceToTextButton
            isListening={isListening}
            isSupported={isVoiceToTextSupported}
            loading={loading}
            onClick={onVoiceToTextToggle}
          />
        )}

        <textarea
          value={value + (interimTranscript ? ` ${interimTranscript}` : "")}
          onChange={handleChange}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          className={`w-full py-2 xs:py-2.5 sm:py-3 md:py-4 ${
            isVoiceToTextSupported
              ? "pl-8 xs:pl-9 sm:pl-11 md:pl-12 lg:pl-14"
              : "pl-2 xs:pl-3 sm:pl-4 md:pl-4 lg:pl-6"
          } pr-8 xs:pr-9 sm:pr-11 md:pr-12 lg:pr-14 bg-transparent text-white placeholder-white/40 border-none focus:outline-none resize-none scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent text-xs xs:text-sm sm:text-base lg:text-base leading-relaxed font-medium mobile-touch-target`}
          disabled={loading}
          rows={1}
          style={{
            minHeight: "40px",
            maxHeight: "100px",
            overflow: "auto",
          }}
          onInput={onInput}
        />

        <ClearButton show={!!value} onClick={onClear} />
      </div>
    </div>
  );
};

export default TextInputField;
