import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

// Extend Window interface for Speech Recognition
declare global {
    interface Window {
        SpeechRecognition?: new () => VoiceToTextSpeechRecognition;
        webkitSpeechRecognition?: new () => VoiceToTextSpeechRecognition;
    }
}

// Speech Recognition types for voice-to-text
interface VoiceToTextSpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    abort(): void;
    onstart: (() => void) | null;
    onresult: ((event: VoiceToTextSpeechRecognitionEvent) => void) | null;
    onerror: ((event: VoiceToTextSpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
}

interface VoiceToTextSpeechRecognitionEvent {
    resultIndex: number;
    results: VoiceToTextSpeechRecognitionResultList;
}

interface VoiceToTextSpeechRecognitionResultList {
    length: number;
    [index: number]: VoiceToTextSpeechRecognitionResult;
}

interface VoiceToTextSpeechRecognitionResult {
    length: number;
    isFinal: boolean;
    [index: number]: VoiceToTextSpeechRecognitionAlternative;
}

interface VoiceToTextSpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface VoiceToTextSpeechRecognitionErrorEvent {
    error: string;
}

export const useVoiceToText = () => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");

    const recognitionRef = useRef<VoiceToTextSpeechRecognition | null>(null);
    const timeoutRef = useRef<number | null>(null);

    // Initialize speech recognition
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition =
                window.SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (SpeechRecognition) {
                setIsSupported(true);
                const recognition = new SpeechRecognition();

                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = "en-US";

                recognition.onstart = () => {
                    setIsListening(true);
                    setTranscript("");
                    setInterimTranscript("");
                };

                recognition.onresult = (event: VoiceToTextSpeechRecognitionEvent) => {
                    let finalTranscript = "";
                    let interim = "";

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript;
                        } else {
                            interim += transcript;
                        }
                    }

                    if (finalTranscript) {
                        setTranscript((prev) => prev + finalTranscript);
                        setInterimTranscript("");

                        // Clear any existing timeout
                        if (timeoutRef.current) {
                            clearTimeout(timeoutRef.current);
                        }

                        // Set timeout to stop listening after 2 seconds of silence
                        timeoutRef.current = setTimeout(() => {
                            stopListening();
                        }, 2000);
                    } else {
                        setInterimTranscript(interim);
                    }
                };

                recognition.onerror = (event: VoiceToTextSpeechRecognitionErrorEvent) => {
                    console.error("Speech recognition error:", event.error);
                    setIsListening(false);
                    setInterimTranscript("");

                    switch (event.error) {
                        case "no-speech":
                            toast.error("No speech detected. Please try again.");
                            break;
                        case "network":
                            toast.error("Network error. Please check your connection.");
                            break;
                        case "not-allowed":
                            toast.error(
                                "Microphone access denied. Please allow microphone access."
                            );
                            break;
                        case "aborted":
                            // Don't show error for intentional stops
                            break;
                        default:
                            toast.error("Voice recognition error. Please try again.");
                    }
                };

                recognition.onend = () => {
                    setIsListening(false);
                    setInterimTranscript("");

                    // Clear timeout when recognition ends
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                        timeoutRef.current = null;
                    }
                };

                recognitionRef.current = recognition;
            }
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const startListening = useCallback(() => {
        if (!isSupported || !recognitionRef.current) {
            toast.error("Speech recognition is not supported in this browser.");
            return;
        }

        if (isListening) return;

        try {
            recognitionRef.current.start();
            toast.success("Listening... Speak now!");
        } catch (error) {
            console.error("Error starting speech recognition:", error);
            toast.error("Failed to start listening.");
        }
    }, [isSupported, isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, [isListening]);

    const resetTranscript = useCallback(() => {
        setTranscript("");
        setInterimTranscript("");
    }, []);

    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    return {
        isListening,
        isSupported,
        transcript,
        interimTranscript,
        startListening,
        stopListening,
        resetTranscript,
        toggleListening,
    };
};
