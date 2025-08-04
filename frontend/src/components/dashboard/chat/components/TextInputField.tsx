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

  return (
    <div className="flex-1 relative">
      <div className="relative flex items-center">
        <VoiceToTextButton
          isListening={isListening}
          isSupported={isVoiceToTextSupported}
          loading={loading}
          onClick={onVoiceToTextToggle}
        />

        <textarea
          value={value + (interimTranscript ? ` ${interimTranscript}` : "")}
          onChange={handleChange}
          onKeyPress={onKeyPress}
          placeholder="Type your message... (Shift + Enter for new line)"
          className={`w-full py-3 lg:py-4 ${
            isVoiceToTextSupported ? "pl-10 lg:pl-12" : "pl-4 lg:pl-6"
          } pr-12 lg:pr-14 bg-transparent text-white placeholder-[#D0D0D0] rounded-xl lg:rounded-2xl border-none focus:outline-none resize-none scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent text-sm lg:text-base leading-relaxed`}
          disabled={loading}
          rows={1}
          style={{
            minHeight: "20px",
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
