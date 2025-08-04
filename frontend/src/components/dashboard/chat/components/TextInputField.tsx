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
      <div className="relative flex items-center min-h-[52px]">
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
          placeholder=""
          className={`w-full py-4 lg:py-4 ${
            isVoiceToTextSupported ? "pl-12 lg:pl-14" : "pl-4 lg:pl-6"
          } pr-12 lg:pr-14 bg-transparent text-white placeholder-white/40 border-none focus:outline-none resize-none scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent text-sm lg:text-base leading-relaxed font-medium`}
          disabled={loading}
          rows={1}
          style={{
            minHeight: "52px",
            maxHeight: "120px",
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
