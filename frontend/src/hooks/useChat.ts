import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

export interface Chat {
    _id: string;
    title: string;
    messages: Array<{
        role: "user" | "assistant";
        content: string;
        timestamp: Date;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

export interface Message {
    role: "user" | "assistant";
    content: string;
}

export const useChat = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [currentChat, setCurrentChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingTitle, setEditingTitle] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [streamingMessageIndex, setStreamingMessageIndex] = useState<number | null>(null);

    useEffect(() => {
        // Fetch chats when component mounts
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const response = await api.get("/api/chat");
            setChats(response.data.chats);
        } catch (error) {
            toast.error("Failed to fetch chats");
        }
    };

    const startNewChat = () => {
        setCurrentChat(null);
        setMessages([]);
    };

    const selectChat = (chat: Chat) => {
        setCurrentChat(chat);
        setMessages(chat.messages);
    };

    const sendMessage = async (inputMessage: string) => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = { role: "user", content: inputMessage };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setLoading(true);

        // Set a timeout for the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
            toast.error("Response timeout! AI Bondhu is taking too long. Please try again.");
        }, 35000); // 35 seconds timeout

        try {
            const response = await api.post("/api/chat", {
                message: inputMessage,
                chatId: currentChat?._id,
            }, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // Add assistant message with streaming effect
            const assistantMessage: Message = {
                role: "assistant",
                content: "",
            };

            const messagesWithEmptyAssistant = [...newMessages, assistantMessage];
            setMessages(messagesWithEmptyAssistant);

            const assistantMessageIndex = messagesWithEmptyAssistant.length - 1;
            setStreamingMessageIndex(assistantMessageIndex);

            // Simulate typing effect with word-by-word streaming
            const fullResponse = response.data.response;
            const words = fullResponse.split(' ');
            let currentContent = "";

            for (let i = 0; i < words.length; i++) {
                currentContent += (i > 0 ? ' ' : '') + words[i];

                setMessages(prevMessages =>
                    prevMessages.map((msg, index) =>
                        index === assistantMessageIndex
                            ? { ...msg, content: currentContent }
                            : msg
                    )
                );

                // Wait between words for smooth streaming
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Streaming complete
            setStreamingMessageIndex(null);

            if (!currentChat) {
                // New chat created
                setCurrentChat(response.data.chat);
                fetchChats();
            }
        } catch (error: any) {
            clearTimeout(timeoutId);

            // Handle different types of errors
            if (error.name === 'AbortError') {
                toast.error("AI Bondhu response timed out. Please try again with a shorter message.");
            } else if (error.response?.status === 429) {
                toast.error("Too many requests. Please wait a moment and try again.");
            } else if (error.response?.status >= 500) {
                toast.error("AI Bondhu servers are busy. Please try again in a moment.");
            } else {
                toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
            }

            // Remove the empty assistant message if request failed
            setMessages(newMessages);
            setStreamingMessageIndex(null);
        } finally {
            setLoading(false);
        }
    }; const deleteChat = async (chatId: string) => {
        if (!confirm("Are you sure you want to delete this chat?")) return;

        try {
            await api.delete(`/api/chat/${chatId}`);
            setChats(chats.filter((chat) => chat._id !== chatId));
            if (currentChat?._id === chatId) {
                setCurrentChat(null);
                setMessages([]);
            }
            toast.success("Chat deleted successfully");
        } catch (error) {
            toast.error("Failed to delete chat");
        }
    };

    const updateChatTitle = async (chatId: string, title: string) => {
        try {
            await api.patch(`/api/chat/${chatId}`, { title });
            setChats(
                chats.map((chat) => (chat._id === chatId ? { ...chat, title } : chat))
            );
            if (currentChat?._id === chatId) {
                setCurrentChat({ ...currentChat, title });
            }
            setEditingTitle(null);
            toast.success("Chat title updated");
        } catch (error) {
            toast.error("Failed to update chat title");
        }
    };

    const shareChat = async (chatId: string) => {
        try {
            await api.post(`/api/chat/${chatId}/share`);
            const shareUrl = `${window.location.origin}/chat/${chatId}`;
            navigator.clipboard.writeText(shareUrl);
            toast.success("Share link copied to clipboard!");
        } catch (error) {
            toast.error("Failed to share chat");
        }
    };

    return {
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
        fetchChats
    };
};
