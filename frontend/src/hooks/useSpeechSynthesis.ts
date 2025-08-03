import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useSpeechSynthesis = () => {
    const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
    const [playingMessageIndex, setPlayingMessageIndex] = useState<number | null>(null);

    useEffect(() => {
        // Initialize speech synthesis
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            setSpeechSynthesis(window.speechSynthesis);
        }
    }, []);

    // Get the best voice for a specific language
    const getBestVoiceForLanguage = (
        lang: string,
        voices: SpeechSynthesisVoice[]
    ): SpeechSynthesisVoice | null => {
        // Language-specific voice preferences - English only
        const languagePreferences: { [key: string]: string[] } = {
            en: [
                "Neural",
                "Natural",
                "Enhanced",
                "Premium",
                "Google",
                "Microsoft",
                "Amazon",
            ],
        };

        const preferences = languagePreferences[lang] || languagePreferences["en"];

        // Find voices that match English language
        const languageVoices = voices.filter((voice) =>
            voice.lang.startsWith("en")
        );
        if (languageVoices.length === 0) {
            // Fallback to English if no voices found for the language
            return (
                voices.find((voice) => voice.lang.startsWith("en")) || voices[0] || null
            );
        }

        // Try to find the best quality voice based on preferences
        for (const preference of preferences) {
            const preferredVoice = languageVoices.find((voice) =>
                voice.name.toLowerCase().includes(preference.toLowerCase())
            );
            if (preferredVoice) {
                return preferredVoice;
            }
        }

        // If no preferred voice found, return the first available voice for the language
        return languageVoices[0];
    };

    // Play message content as audio using text-to-speech
    const playMessageAudio = (content: string, messageIndex: number) => {
        try {
            if (!speechSynthesis) {
                toast.error("Text-to-speech not supported in this browser");
                return;
            }

            // Stop any currently playing speech
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
                if (playingMessageIndex === messageIndex) {
                    setPlayingMessageIndex(null);
                    return;
                }
            }

            // Use English as the target language
            const targetLanguage = "en";

            // Create speech utterance
            const utterance = new SpeechSynthesisUtterance(content);

            // Configure speech settings - standard rate for English
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;

            // Get available voices
            const voices = speechSynthesis.getVoices();

            // Try to get the best voice for the target language
            const selectedVoice = getBestVoiceForLanguage(targetLanguage, voices);

            if (selectedVoice) {
                utterance.voice = selectedVoice;
                utterance.lang = selectedVoice.lang;
            } else {
                // Fallback to setting language directly
                utterance.lang = targetLanguage;
            }

            // Event handlers
            utterance.onstart = () => {
                setPlayingMessageIndex(messageIndex);
                toast.success("Playing audio in English...");
            };

            utterance.onend = () => {
                setPlayingMessageIndex(null);
            };

            utterance.onerror = (event) => {
                setPlayingMessageIndex(null);
                toast.error(`Audio playback failed: ${event.error}`);
            };

            // Start speaking
            speechSynthesis.speak(utterance);
        } catch (error) {
            toast.error("Failed to play audio");
            setPlayingMessageIndex(null);
        }
    };

    // Stop any ongoing speech when component unmounts or messages change
    const stopSpeaking = () => {
        if (speechSynthesis && speechSynthesis.speaking) {
            speechSynthesis.cancel();
            setPlayingMessageIndex(null);
        }
    };

    return {
        playMessageAudio,
        stopSpeaking,
        playingMessageIndex,
        speechSynthesis
    };
};
