import {
  Copy,
  Edit2,
  Lock,
  LogOut,
  MessageCircle,
  Plus,
  Send,
  Settings,
  Share2,
  Trash2,
  User,
  Volume2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

interface Chat {
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

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState("account");
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [playingMessageIndex, setPlayingMessageIndex] = useState<number | null>(
    null
  );
  const [detectedLanguages, setDetectedLanguages] = useState<{ [key: number]: string }>({});
  const [selectedLanguages, setSelectedLanguages] = useState<{ [key: number]: string }>({});
  const [speechSynthesis, setSpeechSynthesis] =
    useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  useEffect(() => {
    // Stop any ongoing speech when messages change
    return () => {
      if (speechSynthesis && speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setPlayingMessageIndex(null);
      }
    };
  }, [messages, speechSynthesis]);

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

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = { role: "user", content: inputMessage };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage("");
    setLoading(true);

    try {
      const response = await api.post("/api/chat", {
        message: inputMessage,
        chatId: currentChat?._id,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: response.data.response,
      };

      setMessages([...newMessages, assistantMessage]);

      if (!currentChat) {
        // New chat created
        setCurrentChat(response.data.chat);
        fetchChats();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async (chatId: string) => {
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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);

    try {
      await api.patch("/api/user/update", profileData);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSettingsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setSettingsLoading(true);

    try {
      await api.patch("/api/user/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setSettingsLoading(false);
    }
  };

  // Copy message content to clipboard
  const copyMessageContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Message copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy message");
    }
  };

  // Share message content
  const shareMessageContent = async (content: string) => {
    try {
      if (navigator.share) {
        // Use Web Share API if available (mobile devices)
        await navigator.share({
          title: "AI Assistant Response",
          text: content,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(content);
        toast.success("Message copied to clipboard for sharing!");
      }
    } catch (error) {
      // If user cancels share dialog, don't show error
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share message");
      }
    }
  };

  // Detect language from text content
  const detectLanguage = (text: string): string => {
    // Simple language detection based on common patterns
    const cleanText = text.toLowerCase().trim();
    
    // Arabic detection
    if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text)) {
      return 'ar';
    }
    
    // Chinese detection (Simplified and Traditional)
    if (/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(text)) {
      return 'zh';
    }
    
    // Japanese detection
    if (/[\u3040-\u309f\u30a0-\u30ff\u31f0-\u31ff\uff66-\uff9f]/.test(text)) {
      return 'ja';
    }
    
    // Korean detection
    if (/[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff]/.test(text)) {
      return 'ko';
    }
    
    // Russian detection
    if (/[\u0400-\u04FF]/.test(text)) {
      return 'ru';
    }
    
    // Hindi detection
    if (/[\u0900-\u097F]/.test(text)) {
      return 'hi';
    }
    
    // Bangla/Bengali detection
    if (/[\u0980-\u09FF]/.test(text)) {
      return 'bn';
    }
    
    // Bangla common words detection (backup method using common Bengali words)
    if (/\b(আমি|তুমি|তিনি|আপনি|সে|আমরা|তোমরা|তারা|এটা|ওটা|এই|ঐ|যে|কে|কি|কেন|কখন|কোথায়|কিভাবে|কোন|কত|এবং|অথবা|কিন্তু|যদি|তাহলে|তবে|না|হ্যাঁ|নিশ্চয়ই|সম্ভবত|অবশ্যই|আছে|ছিল|হবে|করা|করি|করে|করেন|করেছি|করেছে|করব|করবে|বলা|বলি|বলে|বলেন|বলেছি|বলেছে|বলব|বলবে|যাওয়া|যাই|যায়|যান|গেছি|গেছে|যাব|যাবে|আসা|আসি|আসে|আসেন|এসেছি|এসেছে|আসব|আসবে|দেখা|দেখি|দেখে|দেখেন|দেখেছি|দেখেছে|দেখব|দেখবে|শোনা|শুনি|শুনে|শুনেন|শুনেছি|শুনেছে|শুনব|শুনবে|খাওয়া|খাই|খায়|খান|খেয়েছি|খেয়েছে|খাব|খাবে|পান|পানি|পড়া|পড়ি|পড়ে|পড়েন|পড়েছি|পড়েছে|পড়ব|পড়বে|লেখা|লিখি|লিখে|লিখেন|লিখেছি|লিখেছে|লিখব|লিখবে|ভাল|ভালো|মন্দ|বড়|ছোট|উচ্চ|নিচু|দীর্ঘ|খাটো|সুন্দর|কুৎসিত|নতুন|পুরাতন|তরুণ|বৃদ্ধ|গরম|ঠান্ডা|শুকনো|ভেজা|সহজ|কঠিন|দ্রুত|ধীর|শক্তিশালী|দুর্বল|পরিষ্কার|নোংরা|স্বচ্ছ|অন্ধকার|উজ্জ্বল|রঙিন|কালো|সাদা|লাল|নীল|সবুজ|হলুদ|গোলাপী|বেগুনী|কমলা|বাদামী|ধূসর|রৌপ্য|সোনা|একটি|দুটি|তিনটি|চারটি|পাঁচটি|ছয়টি|সাতটি|আটটি|নয়টি|দশটি|শূন্য|প্রথম|দ্বিতীয়|তৃতীয়|চতুর্থ|পঞ্চম|ষষ্ঠ|সপ্তম|অষ্টম|নবম|দশম|গতকাল|আজ|আগামীকাল|সকাল|দুপুর|বিকাল|সন্ধ্যা|রাত|সপ্তাহ|মাস|বছর|দিন|ঘন্টা|মিনিট|সেকেন্ড|সময়|ঠিকানা|বাড়ি|ঘর|অফিস|স্কুল|কলেজ|বিশ্ববিদ্যালয়|হাসপাতাল|দোকান|বাজার|রাস্তা|পার্ক|নদী|সমুদ্র|পাহাড়|বন|মাঠ|আকাশ|সূর্য|চাঁদ|তারা|বৃষ্টি|বাতাস|আগুন|পানি|মাটি|গাছ|ফুল|ফল|সবজি|মাছ|মাংস|চাল|রুটি|দুধ|চা|কফি|চিনি|লবণ|তেল|ডিম|মুরগি|গরু|ছাগল|কুকুর|বিড়াল|পাখি|মাছি|মশা|প্রজাপতি|মৌমাছি|পিঁপড়া|মাকড়সা|সাপ|ব্যাঙ|হাতি|বাঘ|সিংহ|ভালুক|বানর|হরিণ|খরগোশ|ইঁদুর|ঘোড়া|গাধা|উট|ভেড়া|শূকর|পাখা|চোখ|নাক|মুখ|কান|হাত|পা|মাথা|গলা|বুক|পেট|পিঠ|কাঁধ|হাঁটু|আঙ্গুল|নখ|চুল|দাঁত|জিভ|হৃদয়|মন|মস্তিষ্ক|আত্মা|শরীর|রক্ত|হাড়|মাংস|চামড়া|কাপড়|জামা|প্যান্ট|শার্ট|টি-শার্ট|জুতা|মোজা|টুপি|চশমা|ঘড়ি|আংটি|হার|কানের|দুল|ব্যাগ|মানিব্যাগ|টাকা|পয়সা|রুপি|ডলার|ইউরো|পাউন্ড|কার্ড|চেক|ব্যাংক|হিসাব|ঋণ|সুদ|বিনিয়োগ|ব্যবসা|কাজ|চাকরি|বেতন|আয়|খরচ|লাভ|ক্ষতি|বিক্রয়|ক্রয়|কেনা|বেচা|দেওয়া|নেওয়া|দান|উপহার|ভাড়া|মূল্য|দাম|সস্তা|দামি|বিনামূল্যে|প্রেম|ভালোবাসা|বন্ধুত্ব|বিয়ে|পরিবার|মা|বাবা|ছেলে|মেয়ে|ভাই|বোন|স্বামী|স্ত্রী|দাদা|দাদি|নানা|নানি|চাচা|চাচি|মামা|মামি|ফুপু|খালা|জ্ঞাতি|আত্মীয়|প্রতিবেশী|বন্ধু|শত্রু|অতিথি|মেহমান|সভা|অনুষ্ঠান|উৎসব|জন্মদিন|বিবাহ|মৃত্যু|জানাজা|নামাজ|রোজা|হজ|যাকাত|দান|সাদাকা|দোয়া|তসবিহ|কোরআন|হাদিস|ইসলাম|মুসলিম|হিন্দু|বৌদ্ধ|খ্রিস্টান|ধর্ম|আল্লাহ|ভগবান|ঈশ্বর|পূজা|প্রার্থনা|মন্দির|মসজিদ|গির্জা|প্যাগোডা|ধর্মীয়|আধ্যাত্মিক|পবিত্র|অপবিত্র|পাপ|পুণ্য|নরক|স্বর্গ|মৃত্যুর|পরে|পরকাল|ইহকাল|জীবন|মরণ|জন্ম|মৃত্যু|শ্বাস|নিঃশ্বাস|স্বাস্থ্য|অসুস্থতা|রোগ|ব্যাধি|ওষুধ|চিকিৎসা|ডাক্তার|নার্স|রোগী|হাসপাতাল|ক্লিনিক|অস্ত্রোপচার|ইনজেকশন|গোলি|সিরাপ|ক্রিম|মলম|ব্যান্ডেজ|প্রাথমিক|চিকিৎসা|জরুরি|অবস্থা|দুর্ঘটনা|আঘাত|ব্যথা|ক্লান্তি|দুর্বলতা|মাথাব্যথা|পেটব্যথা|জ্বর|সর্দি|কাশি|হাঁচি|ডায়রিয়া|বমি|মাথা|ঘোরা|অজ্ঞান|রক্তপাত|ক্ষত|সংক্রমণ|ভাইরাস|ব্যাকটেরিয়া|জীবাণু|প্রতিরোধ|টিকা|পরীক্ষা|ফলাফল|রিপোর্ট|এক্স-রে|আল্ট্রাসাউন্ড|ইসিজি|রক্ত|পরীক্ষা|প্রস্রাব|পরীক্ষা|মল|পরীক্ষা|চোখের|পরীক্ষা|কানের|পরীক্ষা|দাঁতের|পরীক্ষা|শিক্ষা|শেখা|পড়াশোনা|জ্ঞান|বিদ্যা|শিক্ষক|ছাত্র|ছাত্রী|ক্লাস|পাঠ|বই|খাতা|কলম|পেন্সিল|রাবার|শার্পনার|স্কেল|কম্পাস|ক্যালকুলেটর|কম্পিউটার|ল্যাপটপ|ট্যাবলেট|মোবাইল|ফোন|ইন্টারনেট|ইমেইল|ফেসবুক|হোয়াটসঅ্যাপ|ইউটিউব|গুগল|ওয়েবসাইট|অ্যাপ|গেম|ভিডিও|অডিও|ছবি|ফটো|ক্যামেরা|ভিডিও|ক্যামেরা|রেকর্ডার|স্পিকার|হেডফোন|মাইক্রোফোন|কিবোর্ড|মাউস|মনিটর|প্রিন্টার|স্ক্যানার|পেন|ড্রাইভ|মেমোরি|কার্ড|চার্জার|ব্যাটারি|পাওয়ার|ব্যাংক|ক্যাবল|ওয়াইফাই|ব্লুটুথ|এনএফসি|জিপিএস|লোকেশন|ম্যাপ|দিক|নির্দেশনা|উত্তর|দক্ষিণ|পূর্ব|পশ্চিম|বাম|ডান|সামনে|পিছনে|উপরে|নিচে|ভিতরে|বাইরে|কাছে|দূরে|মধ্যে|মাঝখানে|কোণে|পাশে|সাথে|ছাড়া|বিনা|সহ|দিয়ে|জন্য|কারণে|উদ্দেশ্যে|লক্ষ্যে|দিকে|প্রতি|বিপরীতে|বিরুদ্ধে|পক্ষে|অনুকূলে|প্রতিকূলে|সুবিধা|অসুবিধা|লাভ|ক্ষতি|হার|জিত|পরাজয়|সফলতা|ব্যর্থতা|উন্নতি|অবনতি|প্রগতি|পশ্চাদপদতা|আগে|পরে|আগামী|গত|বর্তমান|ভবিষ্যৎ|অতীত|এখন|তখন|কখনো|সবসময়|কখনো|না|মাঝে|মধ্যে|দ্রুত|ধীরে|তাড়াতাড়ি|দেরি|সময়মতো|অসময়ে|যথাসময়ে|ঠিক|সময়ে|শীঘ্র|অতি|শীঘ্র|অবিলম্বে|তাৎক্ষণিক|দ্রুততম|ধীরতম|সর্বোচ্চ|সর্বনিম্ন|বেশি|কম|অনেক|কিছু|সব|সকল|সমস্ত|কেউ|কেউই|না|কিছুই|না|সবকিছু|যা|কিছু|যেকোনো|কিছু|বিশেষ|কিছু|নির্দিষ্ট|কিছু|অনির্দিষ্ট|কিছু|গুরুত্বপূর্ণ|কিছু|অগুরুত্বপূর্ণ|কিছু|প্রয়োজনীয়|কিছু|অপ্রয়োজনীয়|কিছু|দরকারি|কিছু|অদরকারি|কিছু|উপকারী|কিছু|ক্ষতিকর|কিছু|ভাল|কিছু|মন্দ|কিছু|সঠিক|কিছু|ভুল|কিছু|সত্য|কিছু|মিথ্যা|কিছু|সহজ|কিছু|কঠিন|কিছু|সম্ভব|কিছু|অসম্ভব|কিছু|নিশ্চিত|কিছু|অনিশ্চিত|কিছু|স্পষ্ট|কিছু|অস্পষ্ট|কিছু|পরিষ্কার|কিছু|অপরিষ্কার|কিছু|সুন্দর|কিছু|কুৎসিত|কিছু|আকর্ষণীয়|কিছু|বিকর্ষণকারী|কিছু|মজার|কিছু|বিরক্তিকর|কিছু|আনন্দদায়ক|কিছু|দুঃখজনক|কিছু|খুশির|কিছু|দুঃখের|কিছু|হাসির|কিছু|কান্নার|কিছু|প্রেমের|কিছু|ঘৃণার|কিছু|বন্ধুত্বের|কিছু|শত্রুতার|কিছু|শান্তির|কিছু|যুদ্ধের|কিছু|সুখের|কিছু|দুঃখের|কিছু|আশার|কিছু|হতাশার|কিছু|স্বপ্নের|কিছু|দুঃস্বপ্নের|কিছু|ভয়ের|কিছু|সাহসের|কিছু|ভীতিকর|কিছু|সাহসী|কিছু|দুর্বল|কিছু|শক্তিশালী|কিছু|গুরুত্বপূর্ণ|কিছু|তুচ্ছ|কিছু|মূল্যবান|কিছু|মূল্যহীন|কিছু|দামি|কিছু|সস্তা|কিছু|বিনামূল্যে|কিছু|ব্যয়বহুল|কিছু|লাভজনক|কিছু|ক্ষতিকর|কিছু|উপকারী|কিছু|নিরীহ|কিছু|ক্ষতিকারক|কিছু|নিরাপদ|কিছু|বিপজ্জনক|কিছু|স্বাস্থ্যকর|কিছু|অস্বাস্থ্যকর|কিছু|প্রাকৃতিক|কিছু|কৃত্রিম|কিছু|আসল|কিছু|নকল|কিছু|খাঁটি|কিছু|ভেজাল|কিছু|তাজা|কিছু|বাসি|কিছু|নতুন|কিছু|পুরাতন|কিছু|আধুনিক|কিছু|প্রাচীন|কিছু|যুগোপযোগী|কিছু|সেকেলে|কিছু|ফ্যাশনেবল|কিছু|পুরানো|ধাঁচের|কিছু|জনপ্রিয়|কিছু|অজনপ্রিয়|কিছু|বিখ্যাত|কিছু|অখ্যাত|কিছু|প্রসিদ্ধ|কিছু|অপ্রসিদ্ধ|কিছু|নামকরা|কিছু|নামহীন|কিছু|পরিচিত|কিছু|অপরিচিত|কিছু|জানা|কিছু|অজানা|কিছু|স্পষ্ট|কিছু|গোপন|কিছু|প্রকাশ্য|কিছু|লুকানো|কিছু|খোলা|কিছু|বন্ধ|কিছু|চালু|কিছু|বন্ধ|কিছু|সক্রিয়|কিছু|নিষ্ক্রিয়|কিছু|জীবিত|কিছু|মৃত|কিছু|সজীব|কিছু|নির্জীব|কিছু|চলমান|কিছু|স্থির|কিছু|গতিশীল|কিছু|অচল|কিছু|দ্রুত|কিছু|ধীর|কিছু|তীব্র|কিছু|মৃদু|কিছু|জোরে|কিছু|আস্তে|কিছু|উচ্চ|কিছু|নিচু|কিছু|উঁচু|কিছু|খাটো|কিছু|লম্বা|কিছু|বেঁটে|কিছু|মোটা|কিছু|চিকন|কিছু|ভারী|কিছু|হালকা|কিছু|ঘন|কিছু|পাতলা|কিছু|পুরু|কিছু|সরু|কিছু|চওড়া|কিছু|সংকীর্ণ|কিছু|প্রশস্ত|কিছু|গভীর|কিছু|অগভীর|কিছু|উষ্ণ|কিছু|শীতল|কিছু|গরম|কিছু|ঠান্ডা|কিছু|শুকনো|কিছু|ভেজা|কিছু|আর্দ্র|কিছু|শুষ্ক|কিছু|মসৃণ|কিছু|রুক্ষ|কিছু|নরম|কিছু|শক্ত|কিছু|তরল|কিছু|কঠিন|কিছু|গ্যাসীয়|কিছু|তীক্ষ্ণ|কিছু|ভোঁতা|কিছু)\b/.test(cleanText)) {
      return 'bn';
    }
    
    // Spanish detection (common words and patterns)
    if (/\b(el|la|los|las|un|una|de|en|que|es|se|no|te|lo|le|da|su|por|son|con|para|una|ser|estar|tener|hacer|poder|decir|todo|muy|bien|donde|cuando|como|porque|entre|durante|desde|hasta|hacia|sobre|bajo|ante|tras|según|sin|mediante|excepto|salvo|incluso|además|también|tampoco|sino|pero|aunque|mientras|si|porque|para|por|como|cuando|donde|quien|cual|cuyo|cuya|cuyos|cuyas)\b/.test(cleanText)) {
      return 'es';
    }
    
    // French detection (common words and patterns)
    if (/\b(le|la|les|un|une|de|du|des|et|est|en|à|il|elle|on|nous|vous|ils|elles|ce|cette|ces|son|sa|ses|mon|ma|mes|ton|ta|tes|notre|nos|votre|vos|leur|leurs|pour|avec|par|sur|sous|dans|sans|entre|pendant|depuis|jusqu|vers|chez|contre|malgré|selon|sauf|hormis|outre|parmi|après|avant|devant|derrière|dessus|dessous|dedans|dehors|autour|auprès|près|loin|partout|nulle|quelque|chaque|tout|tous|toute|toutes|autre|autres|même|mêmes|tel|telle|tels|telles|quel|quelle|quels|quelles|qui|que|quoi|dont|où|comment|pourquoi|quand|combien|beaucoup|peu|assez|très|trop|plus|moins|aussi|autant|tant|si|oui|non|peut|être|avoir|faire|dire|aller|voir|savoir|vouloir|pouvoir|devoir|falloir|venir|donner|prendre|partir|arriver|rester|devenir|tenir|porter|mettre|suivre|vivre|mourir|naître|connaître|paraître|croire|sembler|regarder|écouter|entendre|parler|répondre|demander|penser|comprendre|apprendre|enseigner|oublier|se|souvenir|rappeler|espérer|souhaiter|désirer|aimer|détester|préférer|choisir|décider|essayer|réussir|échouer|gagner|perdre|trouver|chercher|attendre|rencontrer|quitter|laisser|garder|sauver|aider|servir|utiliser|employer|travailler|jouer|dormir|manger|boire|acheter|vendre|payer|coûter|valoir|peser|mesurer|compter|calculer|lire|écrire|dessiner|chanter|danser|rire|pleurer|sourire|crier|parler|se|taire|écouter|entendre|sentir|toucher|goûter|voir|regarder|montrer|cacher|ouvrir|fermer|commencer|finir|continuer|arrêter|partir|arriver|entrer|sortir|monter|descendre|tomber|lever|coucher|habiller|déshabiller|laver|nettoyer|salir|casser|réparer|construire|détruire|créer|inventer|découvrir|perdre|trouver|garder|laisser|prendre|donner|recevoir|envoyer|apporter|emporter|porter|jeter|ramasser|pousser|tirer|frapper|toucher|caresser|embrasser|serrer|lâcher|tenir|saisir|attraper|lancer|courir|marcher|sauter|nager|voler|conduire|voyager|visiter|habiter|demeurer|loger|rester|partir|revenir|retourner|rentrer|sortir|aller|venir|passer|traverser|suivre|précéder|accompagner|guider|mener|diriger|commander|obéir|interdire|permettre|autoriser|défendre|protéger|attaquer|se|défendre|combattre|vaincre|perdre|gagner|réussir|échouer|essayer|tenter|risquer|oser|craindre|avoir|peur|rassurer|calmer|énerver|fâcher|mettre|en|colère|pardonner|excuser|remercier|féliciter|encourager|décourager|consoler|plaindre|critiquer|louer|admirer|respecter|mépriser|hair|aimer|adorer|préférer|choisir|élire|nommer|appeler|surnommer|baptiser|marier|divorcer|séparer|unir|joindre|lier|attacher|détacher|nouer|dénouer|serrer|desserrer|fermer|ouvrir|allumer|éteindre|éclairer|assombrir|chauffer|refroidir|réchauffer|refroidir|geler|fondre|bouillir|cuire|rôtir|griller|frire|bouillir|mijoter|préparer|cuisiner|servir|goûter|manger|boire|avaler|mâcher|croquer|lécher|sucer|cracher|vomir|digérer|nourrir|affamer|rassasier|satisfaire|contenter|plaire|déplaire|ennuyer|amuser|divertir|intéresser|passionner|émouvoir|toucher|impressionner|surprendre|étonner|choquer|scandaliser|indigner|révolter|dégoûter|écœurer|attirer|repousser|séduire|charmer|fasciner|hypnotiser|endormir|réveiller|rêver|cauchemar|espérer|souhaiter|désirer|vouloir|exiger|demander|supplier|prier|implorer|ordonner|commander|conseiller|recommander|suggérer|proposer|offrir|refuser|accepter|accueillir|recevoir|inviter|convier|aller|voir|visiter|rencontrer|retrouver|rejoindre|quitter|abandonner|laisser|rester|demeurer|habiter|loger|vivre|exister|naître|mourir|tuer|assassiner|massacrer|exterminer|sauver|secourir|aider|assister|soutenir|encourager|motiver|inspirer|influencer|persuader|convaincre|séduire|tromper|mentir|dire|la|vérité|avouer|confesser|nier|cacher|dissimuler|révéler|dévoiler|montrer|cacher|exposer|présenter|représenter|symboliser|signifier|vouloir|dire|exprimer|traduire|interpréter|expliquer|clarifier|préciser|détailler|résumer|abréger|raccourcir|allonger|étendre|élargir|rétrécir|grandir|grossir|maigrir|mincir|vieillir|rajeunir|embellir|enlaidir|améliorer|empirer|réparer|abîmer|casser|détruire|construire|bâtir|édifier|ériger|démolir|raser|nettoyer|salir|laver|sécher|mouiller|tremper|imbiber|absorber|boire|étancher|arroser|inonder|noyer|sauver|couler|flotter|nager|plonger|émerger|remonter|descendre|monter|grimper|escalader|tomber|chuter|glisser|trébucher|se|relever|lever|coucher|allonger|étendre|plier|déplier|courber|redresser|pencher|incliner|balancer|osciller|trembler|frissonner|grelotter|suer|transpirer|haleter|souffler|respirer|inspirer|expirer|suffoquer|étouffer|asphyxier|revivre|ressusciter|renaître|mourir|décéder|périr|succomber|agoniser|survivre|résister|supporter|endurer|souffrir|souffrir|mal|avoir|mal|guérir|soigner|traiter|opérer|panser|bander|déshabiller|habiller|vêtir|revêtir|porter|mettre|enlever|ôter|retirer|chausser|déchausser|coiffer|décoiffer|maquiller|démaquiller|raser|se|raser|couper|tailler|rogner|élaguer|émonder|cueillir|ramasser|récolter|moissonner|semer|planter|arroser|bêcher|labourer|cultiver|jardiner|fleurir|faner|se|faner|pourrir|moisir|fermenter|aigrir|se|gâter|conserver|garder|préserver|protéger|abriter|couvrir|découvrir|dénuder|déshabiller|habiller|envelopper|développer|emballer|déballer|empaqueter|dépaqueter|ficeler|déficeler|nouer|dénouer|attacher|détacher|lier|délier|enchaîner|déchaîner|libérer|délivrer|affranchir|émanciper|asservir|asservir|exploiter|opprimer|dominer|régner|gouverner|diriger|administrer|gérer|organiser|désorganiser|ranger|déranger|classer|déclasser|trier|mélanger|mêler|séparer|diviser|partager|distribuer|répartir|rassembler|réunir|assembler|démonter|monter|installer|désinstaller|brancher|débrancher|connecter|déconnecter|allumer|éteindre|démarrer|arrêter|commencer|finir|terminer|achever|compléter|parfaire|perfectionner|améliorer|corriger|rectifier|redresser|réparer|raccommoder|rapiécer|ravauder|repriser|coudre|découdre|tricoter|détricoter|tisser|détisser|filer|défiler|enrouler|dérouler|plier|déplier|froisser|défroisser|repasser|chiffonner|lisser|aplanir|égaliser|niveler|creuser|combler|boucher|déboucher|percer|trouer|forer|perforateur|clouer|déclouer|visser|dévisser|boulonner|déboulonner|souder|dessouder|coller|décoller|scotcher|scotcher|agrafer|dégrafer|épingler|dépingler|punaise|épingle|attache|détache|accroche|décroche|suspend|pend|balance|oscille|remue|bouge|déplace|transporte|porte|emporte|apporte|ramène|emmène|amène|conduit|mène|guide|accompagne|suit|précède|devance|rattrape|poursuit|fuit|s|enfuit|s|échappe|s|évade|se|sauve|court|courre|galope|trotte|marche|se|promène|déambule|erre|vagabonde|voyage|se|déplace|circule|roule|navigue|vogue|navigue|pilote|conduit|dirige|manie|manipule|manœuvre|actionne|déclenche|provoque|cause|occasionne|entraîne|amène|mène|conduit|aboutit|résulte|découle|provient|vient|sort|émane|jaillit|surgit|apparaît|se|montre|se|manifeste|se|révèle|se|dévoile|cache|dissimule|masque|voile|couvre|recouvre|découvre|dévoile|révèle|expose|présente|montre|fait|voir|exhibe|étale|déploie|déplie|replie|plie|froisse|chiffonne|lisse|aplanit|égalise|nivelle|creuse|comble|bouche|débouche|perce|troue|fore|cloue|décloue|visse|dévisse|boulonne|déboulonne|soude|dessoude|colle|décolle|scotche|agrafe|dégrafe|épingle|dépingle|attache|détache|accroche|décroche|suspend|balance|remue|bouge|déplace|transporte|porte|emporte|apporte|ramène|emmène|amène|conduit|mène|guide|accompagne|suit|précède|devance|rattrape|poursuit|fuit|échappe|évade|sauve|court|galope|trotte|marche|promène|déambule|erre|vagabonde|voyage|déplace|circule|roule|navigue|vogue|pilote|conduit|dirige|manie|manipule|manœuvre|actionne|déclenche|provoque|cause|occasionne|entraîne|amène|mène|conduit|aboutit|résulte|découle|provient|vient|sort|émane|jaillit|surgit|apparaît|montre|manifeste|révèle|dévoile|cache|dissimule|masque|voile|couvre|recouvre|découvre|dévoile|révèle|expose|présente|montre|fait|voir|exhibe|étale|déploie|déplie|replie|plie|froisse|chiffonne|lisse|aplanit|égalise|nivelle|creuse|comble|bouche|débouche|perce|troue|fore|cloue|décloue|visse|dévisse|boulonne|déboulonne|soude|dessoude|colle|décolle|scotche|agrafe|dégrafe|épingle|dépingle|attache|détache|accroche|décroche|suspend|balance|remue|bouge|déplace|transporte|porte|emporte|apporte|ramène|emmène|amène|conduit|mène|guide|accompagne|suit|précède|devance|rattrape|poursuit|fuit|échappe|évade|sauve|court|galope|trotte|marche|promène|déambule|erre|vagabonde|voyage|déplace|circule|roule|navigue|vogue|pilote|conduit|dirige|manie|manipule|manœuvre|actionne|déclenche|provoque|cause|occasionne|entraîne|amène|mène|conduit|aboutit|résulte|découle|provient|vient|sort|émane|jaillit|surgit|apparaît|montre|manifeste|révèle|dévoile|cache|dissimule|masque|voile|couvre|recouvre|découvre|dévoile|révèle|expose|présente|montre|fait|voir|exhibe|étale|déploie)\b/.test(cleanText)) {
      return 'fr';
    }
    
    // German detection (common words and patterns)
    if (/\b(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|und|oder|aber|doch|jedoch|sondern|denn|weil|da|wenn|falls|als|während|nachdem|bevor|seit|bis|ob|dass|damit|um|zu|ohne|mit|bei|von|zu|nach|vor|über|unter|neben|zwischen|durch|für|gegen|wider|trotz|wegen|statt|anstatt|außer|bis|seit|während|wegen|trotz|statt|anstatt|außer|binnen|kraft|laut|mangels|mittels|vermöge|bezüglich|hinsichtlich|angesichts|anläßlich|aufgrund|infolge|zufolge|zwecks|halber|um|willen|ich|du|er|sie|es|wir|ihr|sie|mich|dich|ihn|sie|es|uns|euch|sie|mir|dir|ihm|ihr|ihm|uns|euch|ihnen|mein|dein|sein|ihr|sein|unser|euer|ihr|meine|deine|seine|ihre|seine|unsere|eure|ihre|meinen|deinen|seinen|ihren|seinen|unseren|euren|ihren|meinem|deinem|seinem|ihrem|seinem|unserem|eurem|ihrem|meiner|deiner|seiner|ihrer|seiner|unserer|eurer|ihrer|meines|deines|seines|ihres|seines|unseres|eures|ihres|dieser|diese|dieses|diesen|diesem|dieser|jener|jene|jenes|jenen|jenem|jener|welcher|welche|welches|welchen|welchem|welcher|alle|aller|alles|allen|allem|einige|einiger|einiges|einigen|einigem|viele|vieler|vieles|vielen|vielem|wenige|weniger|weniges|wenigen|wenigem|andere|anderer|anderes|anderen|anderem|beide|beider|beides|beiden|beidem|jede|jeder|jedes|jeden|jedem|keine|keiner|keines|keinen|keinem|solche|solcher|solches|solchen|solchem|sein|haben|werden|können|müssen|sollen|wollen|dürfen|mögen|lassen|gehen|kommen|sehen|hören|sagen|machen|tun|geben|nehmen|bringen|fahren|laufen|stehen|sitzen|liegen|schlafen|essen|trinken|kaufen|verkaufen|arbeiten|spielen|lernen|lehren|lesen|schreiben|sprechen|hören|verstehen|wissen|denken|glauben|meinen|fühlen|lieben|hassen|mögen|wünschen|hoffen|fürchten|sich|freuen|ärgern|wundern|kümmern|sorgen|helfen|danken|bitten|fragen|antworten|rufen|lachen|weinen|lächeln|schauen|blicken|zeigen|verstecken|finden|suchen|verlieren|bekommen|erhalten|geben|schenken|leihen|borgen|zahlen|kosten|wert|sein|wiegen|messen|zählen|rechnen|bauen|zerstören|reparieren|putzen|waschen|kochen|backen|braten|schneiden|öffnen|schließen|beginnen|anfangen|aufhören|enden|weitermachen|fortsetzen|bleiben|gehen|kommen|fahren|fliegen|reisen|besuchen|wohnen|leben|sterben|geboren|werden|heiraten|scheiden|lassen|trennen|verbinden|treffen|kennenlernen|verabschieden|grüßen|winken|rufen|schreien|flüstern|schweigen|reden|erzählen|berichten|erklären|beschreiben|kritisieren|loben|tadeln|ermutigen|trösten|beruhigen|ärgern|aufregen|erschrecken|überraschen|freuen|enttäuschen|langweilen|interessieren|begeistern|faszinieren|anziehen|abstoßen|gefallen|missfallen|passen|gehören|besitzen|haben|brauchen|benötigen|verwenden|benutzen|gebrauchen|anwenden|einsetzen|ausnutzen|missbrauchen|verschwenden|sparen|sammeln|anhäufen|verteilen|teilen|geben|nehmen|tauschen|handeln|verkaufen|kaufen|bezahlen|verdienen|ausgeben|investieren|anlegen|leihen|schulden|besitzen|gehören|erben|vererben|schenken|spenden|stiften|opfern|riskieren|wagen|versuchen|probieren|testen|prüfen|kontrollieren|überwachen|beobachten|zusehen|zuhören|lauschen|horchen|riechen|schmecken|fühlen|berühren|anfassen|streicheln|küssen|umarmen|drücken|schlagen|treten|stoßen|ziehen|schieben|heben|senken|fallen|lassen|werfen|fangen|treffen|verfehlen|zielen|schießen|kämpfen|streiten|sich|versöhnen|vergeben|verzeihen|entschuldigen|bereuen|bedauern|sich|schämen|stolz|sein|sich|freuen|ärgern|aufregen|beruhigen|entspannen|anspannen|müde|sein|sich|ausruhen|erholen|schlafen|träumen|aufwachen|aufstehen|sich|hinlegen|hinsetzen|hinstellen|gehen|laufen|rennen|springen|hüpfen|tanzen|singen|musizieren|malen|zeichnen|fotografieren|filmen|schreiben|lesen|rechnen|studieren|forschen|entdecken|erfinden|entwickeln|konstruieren|herstellen|produzieren|erzeugen|schaffen|kreieren|gestalten|formen|bilden|erziehen|unterrichten|ausbilden|schulen|trainieren|üben|praktizieren|spielen|wettkämpfen|gewinnen|verlieren|siegen|besiegen|unterliegen|scheitern|misslingen|gelingen|schaffen|erreichen|erzielen|verwirklichen|erfüllen|vollenden|beenden|abschließen|fertigstellen|vorbereiten|planen|organisieren|ordnen|sortieren|aufräumen|saubermachen|schmutzig|machen|beschmutzen|reinigen|säubern|waschen|trocknen|bügeln|nähen|stricken|häkeln|weben|spinnen|färben|bemalen|anstreichen|lackieren|polieren|schleifen|hobeln|sägen|bohren|hämmern|nageln|schrauben|kleben|leimen|schweißen|löten|reparieren|flicken|stopfen|ausbessern|erneuern|ersetzen|austauschen|wechseln|ändern|verändern|verwandeln|umwandeln|bekehren|überzeugen|überreden|beeinflussen|manipulieren|kontrollieren|beherrschen|regieren|leiten|führen|anführen|vorangehen|folgen|nachfolgen|begleiten|mitgehen|mitkommen|abholen|bringen|holen|wegbringen|fortbringen|mitnehmen|dalassen|zurücklassen|verlassen|im|Stich|lassen|helfen|unterstützen|beistehen|assistieren|dienen|bedienen|versorgen|pflegen|hegen|hüten|bewachen|beschützen|verteidigen|angreifen|kämpfen|gegen|widersetzen|sich|wehren|gegen|protestieren|demonstrieren|streiken|sich|beschweren|kritisieren|bemängeln|beanstanden|reklamieren|sich|ärgern|über|sich|freuen|über|sich|wundern|über|sich|sorgen|um|sich|kümmern|um|sich|interessieren|für|sich|begeistern|für|sich|einsetzen|für|sich|engagieren|für|sich|bemühen|um|sich|anstrengen|sich|Mühe|geben|sich|beeilen|sich|Zeit|lassen|warten|auf|hoffen|auf|rechnen|mit|zählen|auf|sich|verlassen|auf|vertrauen|auf|glauben|an|zweifeln|an|denken|an|sich|erinnern|an|sich|gewöhnen|an|sich|anpassen|an|reagieren|auf|antworten|auf|eingehen|auf|zurückkommen|auf|sich|beziehen|auf|hinweisen|auf|aufmerksam|machen|auf|achten|auf|aufpassen|auf|sich|konzentrieren|auf|sich|spezialisieren|auf|sich|beschränken|auf|sich|begrenzen|auf|verzichten|auf|ablehnen|verweigern|sich|weigern|protestieren|gegen|sich|wehren|gegen|kämpfen|gegen|ankämpfen|gegen|sich|durchsetzen|gegen|siegen|über|triumphieren|über|gewinnen|gegen|verlieren|gegen|unterliegen|scheitern|an|misslingen|gelingen|glücken|klappen|funktionieren|arbeiten|laufen|gehen|fahren|fliegen|schwimmen|tauchen|klettern|steigen|fallen|sinken|untergehen|aufgehen|scheinen|leuchten|strahlen|glänzen|funkeln|blitzen|donnern|regnen|schneien|hageln|stürmen|wehen|blasen|pfeifen|rauschen|brausen|tosen|dröhnen|klingen|tönen|hallen|schallen|widerhallen|erklingen|ertönen|verstummen|schweigen|still|sein|ruhig|sein|sich|beruhigen|sich|aufregen|sich|ärgern|sich|freuen|sich|wundern|sich|fürchten|sich|erschrecken|sich|schämen|sich|blamieren|sich|genieren|sich|schämen|für|stolz|sein|auf|sich|freuen|über|sich|ärgern|über|sich|wundern|über|sich|fürchten|vor|Angst|haben|vor|sich|sorgen|um|sich|kümmern|um|sich|interessieren|für|sich|begeistern|für|sich|einsetzen|für|sich|engagieren|für|sich|bemühen|um|sich|anstrengen|sich|Mühe|geben|sich|beeilen|sich|Zeit|lassen|warten|auf|hoffen|auf|rechnen|mit|zählen|auf|sich|verlassen|auf|vertrauen|auf|glauben|an|zweifeln|an|denken|an|sich|erinnern|an|sich|gewöhnen|an|sich|anpassen|an|reagieren|auf|antworten|auf|eingehen|auf|zurückkommen|auf|sich|beziehen|auf|hinweisen|auf|aufmerksam|machen|auf|achten|auf|aufpassen|auf|sich|konzentrieren|auf|sich|spezialisieren|auf|sich|beschränken|auf|sich|begrenzen|auf|verzichten|auf|ablehnen|verweigern|sich|weigern|protestieren|gegen|sich|wehren|gegen|kämpfen|gegen|ankämpfen|gegen|sich|durchsetzen|gegen|siegen|über|triumphieren|über|gewinnen|gegen|verlieren|gegen|unterliegen|scheitern|an|misslingen|gelingen|glücken|klappen|funktionieren|arbeiten|laufen|gehen|fahren|fliegen|schwimmen|tauchen|klettern|steigen|fallen|sinken|untergehen|aufgehen|scheinen|leuchten|strahlen|glänzen|funkeln|blitzen|donnern|regnen|schneien|hageln|stürmen|wehen|blasen|pfeifen|rauschen|brausen|tosen|dröhnen|klingen|tönen|hallen|schallen|widerhallen|erklingen|ertönen|verstummen|schweigen|still|sein|ruhig|sein|sich|beruhigen|sich|aufregen|sich|ärgern|sich|freuen|sich|wundern|sich|fürchten|sich|erschrecken|sich|schämen|sich|blamieren|sich|genieren)\b/.test(cleanText)) {
      return 'de';
    }
    
    // Italian detection (common words and patterns)
    if (/\b(il|lo|la|gli|le|un|uno|una|di|a|da|in|con|su|per|tra|fra|e|o|ma|però|quindi|così|quando|dove|come|perché|se|che|cui|quale|chi|cosa|quanto|molto|poco|più|meno|anche|ancora|già|mai|sempre|spesso|qualche|ogni|tutto|tutti|tutte|altro|altri|altre|stesso|stessa|stessi|stesse|proprio|propria|propri|proprie|questo|questa|questi|queste|quello|quella|quelli|quelle|essere|avere|fare|dire|andare|venire|stare|dare|sapere|vedere|dovere|potere|volere|uscire|partire|tornare|rimanere|diventare|sembrare|parere|sentire|vivere|morire|nascere|crescere|amare|odiare|piacere|dispiacere|interessare|annoiare|divertire|sorprendere|stupire|meravigliare|spaventare|rassicurare|calmare|innervosire|arrabbiare|far|arrabbiare|perdonare|scusare|ringraziare|congratulare|incoraggiare|scoraggiare|consolare|compatire|criticare|lodare|ammirare|rispettare|disprezzare|odiare|amare|adorare|preferire|scegliere|eleggere|nominare|chiamare|soprannominare|battezzare|sposare|divorziare|separare|unire|congiungere|legare|attaccare|staccare|annodare|slegare|stringere|allentare|chiudere|aprire|accendere|spegnere|illuminare|oscurare|riscaldare|raffreddare|riscaldare|raffreddare|gelare|sciogliere|bollire|cuocere|arrostire|grigliare|friggere|bollire|cucinare|preparare|servire|assaggiare|mangiare|bere|ingoiare|masticare|mordere|leccare|succhiare|sputare|vomitare|digerire|nutrire|affamare|saziare|soddisfare|accontentare|piacere|dispiacere|annoiare|divertire|interessare|appassionare|commuovere|toccare|impressionare|sorprendere|stupire|scioccare|scandalizzare|indignare|rivoltare|disgustare|fare|schifo|attrarre|respingere|sedurre|affascinare|ipnotizzare|addormentare|svegliare|sognare|incubare|sperare|desiderare|volere|esigere|chiedere|supplicare|pregare|implorare|ordinare|comandare|consigliare|raccomandare|suggerire|proporre|offrire|rifiutare|accettare|accogliere|ricevere|invitare|andare|a|trovare|visitare|incontrare|ritrovare|raggiungere|lasciare|abbandonare|rimanere|restare|abitare|vivere|esistere|nascere|morire|uccidere|assassinare|massacrare|sterminare|salvare|soccorrere|aiutare|assistere|sostenere|incoraggiare|motivare|ispirare|influenzare|persuadere|convincere|sedurre|ingannare|mentire|dire|la|verità|confessare|negare|nascondere|dissimulare|rivelare|svelare|mostrare|nascondere|esporre|presentare|rappresentare|simboleggiare|significare|voler|dire|esprimere|tradurre|interpretare|spiegare|chiarire|precisare|dettagliare|riassumere|abbreviare|accorciare|allungare|estendere|allargare|restringere|crescere|ingrassare|dimagrire|invecchiare|ringiovanire|abbellire|imbruttire|migliorare|peggiorare|riparare|rovinare|rompere|distruggere|costruire|edificare|erigere|demolire|radere|pulire|sporcare|lavare|asciugare|bagnare|inzuppare|imbevere|assorbire|bere|dissetare|innaffiare|inondare|annegare|salvare|affondare|galleggiare|nuotare|tuffarsi|emergere|risalire|scendere|salire|arrampicarsi|scalare|cadere|scivolare|inciampare|rialzarsi|alzare|coricare|stendere|piegare|spiegare|curvare|raddrizzare|piegare|inclinare|dondolare|oscillare|tremare|rabbrividire|sudare|traspirare|ansimare|soffiare|respirare|inspirare|espirare|soffocare|strozzare|asfissiare|rivivere|risuscitare|rinascere|morire|decedere|perire|soccombere|agonizzare|sopravvivere|resistere|sopportare|sopportare|soffrire|star|male|aver|male|guarire|curare|trattare|operare|fasciare|bendare|svestire|vestire|indossare|portare|mettere|togliere|levare|calzare|scalzare|pettinare|spettinare|truccare|struccare|radere|radersi|tagliare|potare|cogliere|raccogliere|mietere|seminare|piantare|innaffiare|zappare|arare|coltivare|far|giardinaggio|fiorire|appassire|marcire|ammuffire|fermentare|inacidire|guastarsi|conservare|mantenere|preservare|proteggere|riparare|coprire|scoprire|denudare|svestire|vestire|avvolgere|sviluppare|imballare|disimballare|impacchettare|spacchettare|legare|slegare|attaccare|staccare|incatenare|liberare|schiavizzare|emancipare|sfruttare|opprimere|dominare|regnare|governare|dirigere|amministrare|gestire|organizzare|disorganizzare|sistemare|mettere|in|disordine|classificare|declassificare|selezionare|mescolare|separare|dividere|condividere|distribuire|ripartire|raccogliere|riunire|assemblare|smontare|montare|installare|disinstallare|collegare|scollegare|connettere|disconnettere|accendere|spegnere|avviare|fermare|iniziare|finire|terminare|completare|perfezionare|migliorare|correggere|rettificare|riparare|rammendare|cucire|scucire|lavorare|a|maglia|tessere|filare|sfilare|arrotolare|srotolare|piegare|spiegare|stropiicciare|stirare|sgualcire|lisciare|spianare|livellare|scavare|riempire|tappare|stappare|bucare|forare|inchiodare|schiodare|avvitare|svitare|imbullonare|sbullonare|saldare|dissaldare|incollare|scollare|attaccare|staccare|appendere|staccare|sospendere|dondolare|muovere|spostare|trasportare|portare|portar|via|portare|via|riportare|condurre|guidare|accompagnare|seguire|precedere|superare|raggiungere|inseguire|fuggire|scappare|evadere|salvarsi|correre|galoppare|trottare|camminare|passeggiare|vagare|viaggiare|spostarsi|circolare|rotolare|navigare|veleggiare|pilotare|guidare|dirigere|manovrare|azionare|far|scattare|provocare|causare|occasionare|trascinare|portare|condurre|risultare|derivare|provenire|venire|uscire|emanare|scaturire|sorgere|apparire|mostrarsi|manifestarsi|rivelarsi|svelarsi|nascondere|dissimulare|mascherare|velare|coprire|ricoprire|scoprire|svelare|rivelare|esporre|presentare|mostrare|far|vedere|esibire|mettere|in|mostra|spiegare|ripiegare|stropiicciare|sgualcire|lisciare|spianare|livellare|scavare|riempire|tappare|stappare|bucare|forare|inchiodare|schiodare|avvitare|svitare|imbullonare|sbullonare|saldare|dissaldare|incollare|scollare|attaccare|staccare|appendere|staccare|sospendere|dondolare|muovere|spostare|trasportare|portare|portar|via|portare|via|riportare|condurre|guidare|accompagnare|seguire|precedere|superare|raggiungere|inseguire|fuggire|scappare|evadere|salvarsi|correre|galoppare|trottare|camminare|passeggiare|vagare|viaggiare|spostarsi|circolare|rotolare|navigare|veleggiare|pilotare|guidare|dirigere|manovrare|azionare|far|scattare|provocare|causare|occasionare|trascinare|portare|condurre|risultare|derivare|provenire|venire|uscire|emanare|scaturire|sorgere|apparire|mostrarsi|manifestarsi|rivelarsi|svelarsi|nascondere|dissimulare|mascherare|velare|coprire|ricoprire|scoprire|svelare|rivelare|esporre|presentare|mostrare|far|vedere|esibire|mettere|in|mostra|spiegare|ripiegare)\b/.test(cleanText)) {
      return 'it';
    }
    
    // Portuguese detection (common words and patterns)
    if (/\b(o|a|os|as|um|uma|uns|umas|de|do|da|dos|das|em|no|na|nos|nas|para|por|pelo|pela|pelos|pelas|com|sem|sobre|sob|entre|desde|até|durante|através|mediante|conforme|segundo|contra|perante|ante|após|diante|atrás|dentro|fora|cima|baixo|perto|longe|aqui|ali|lá|aí|onde|quando|como|porque|porquê|se|que|quem|qual|quanto|muito|pouco|mais|menos|também|ainda|já|nunca|sempre|às|vezes|talvez|sim|não|eu|tu|você|ele|ela|nós|vocês|eles|elas|me|te|lhe|nos|vos|lhes|meu|teu|seu|nosso|vosso|minha|tua|sua|nossa|vossa|meus|teus|seus|nossos|vossos|minhas|tuas|suas|nossas|vossas|este|esta|estes|estas|esse|essa|esses|essas|aquele|aquela|aqueles|aquelas|isto|isso|aquilo|ser|estar|ter|haver|fazer|dizer|ir|vir|ficar|dar|saber|ver|dever|poder|querer|sair|partir|voltar|ficar|tornar|parecer|sentir|viver|morrer|nascer|crescer|amar|odiar|gostar|desgostar|interessar|aborrecer|divertir|surpreender|espantar|maravilhar|assustar|tranquilizar|acalmar|irritar|zangar|perdoar|desculpar|agradecer|parabenizar|encorajar|desencorajar|consolar|lastimar|criticar|elogiar|admirar|respeitar|desprezar|odiar|amar|adorar|preferir|escolher|eleger|nomear|chamar|apelidar|batizar|casar|divorciar|separar|unir|juntar|ligar|atar|desatar|anodar|desanodar|apertar|afrouxar|fechar|abrir|acender|apagar|iluminar|escurecer|aquecer|esfriar|esquentar|resfriar|gelar|derreter|ferver|cozinhar|assar|grelhar|fritar|ferver|cozinhar|preparar|servir|provar|comer|beber|engolir|mastigar|morder|lamber|chupar|cuspir|vomitar|digerir|nutrir|faminto|saciar|satisfazer|contentar|agradar|desagradar|aborrecer|divertir|interessar|apaixonar|emocionar|tocar|impressionar|surpreender|espantar|chocar|escandalizar|indignar|revoltar|enojar|atrair|repelir|seduzir|encantar|fascinar|hipnotizar|adormecer|acordar|sonhar|ter|pesadelo|esperar|desejar|querer|exigir|pedir|suplicar|rezar|implorar|ordenar|mandar|aconselhar|recomendar|sugerir|propor|oferecer|recusar|aceitar|acolher|receber|convidar|ir|ver|visitar|encontrar|reencontrar|juntar|deixar|abandonar|ficar|permanecer|morar|viver|existir|nascer|morrer|matar|assassinar|massacrar|exterminar|salvar|socorrer|ajudar|auxiliar|apoiar|encorajar|motivar|inspirar|influenciar|persuadir|convencer|seduzir|enganar|mentir|dizer|verdade|confessar|negar|esconder|dissimular|revelar|desvelar|mostrar|esconder|expor|apresentar|representar|simbolizar|significar|querer|dizer|expressar|traduzir|interpretar|explicar|esclarecer|precisar|detalhar|resumir|abreviar|encurtar|alongar|estender|alargar|estreitar|crescer|engordar|emagrecer|envelhecer|rejuvenescer|embelezar|enfear|melhorar|piorar|reparar|estragar|quebrar|destruir|construir|edificar|erguer|demolir|arrasar|limpar|sujar|lavar|secar|molhar|ensopar|embeber|absorver|beber|matar|sede|regar|inundar|afogar|salvar|afundar|flutuar|nadar|mergulhar|emergir|subir|descer|subir|escalar|cair|escorregar|tropeçar|levantar|erguer|deitar|esticar|dobrar|desdobrar|curvar|endireitar|inclinar|balançar|oscilar|tremer|tiritar|suar|transpirar|ofegar|soprar|respirar|inspirar|expirar|sufocar|estrangular|asfixiar|reviver|ressuscitar|renascer|morrer|falecer|perecer|sucumbir|agonizar|sobreviver|resistir|suportar|aguentar|sofrer|doer|curar|tratar|operar|enfaixar|despir|vestir|usar|pôr|tirar|calçar|descalçar|pentear|despentear|maquiar|desmaquiar|barbear|fazer|barba|cortar|podar|colher|apanhar|ceifar|semear|plantar|regar|capinar|arar|cultivar|jardinar|florescer|murchar|apodrecer|bolorento|fermentar|azedar|estragar|conservar|manter|preservar|proteger|abrigar|cobrir|descobrir|despir|vestir|embrulhar|desenvolver|embalar|desembalar|empacotar|despacotar|amarrar|desamarrar|atar|desatar|acorrentar|libertar|escravizar|emancipar|explorar|oprimir|dominar|reinar|governar|dirigir|administrar|gerir|organizar|desorganizar|arrumar|desarrumar|classificar|desclassificar|escolher|misturar|separar|dividir|compartilhar|distribuir|repartir|juntar|reunir|montar|desmontar|montar|instalar|desinstalar|ligar|desligar|conectar|desconectar|acender|apagar|ligar|desligar|começar|acabar|terminar|completar|aperfeiçoar|melhorar|corrigir|consertar|remendar|costurar|descosturar|tricotar|destricotar|tecer|destecer|fiar|desfiar|enrolar|desenrolar|dobrar|desdobrar|amassar|desamassar|passar|amarrotar|alisar|aplanar|nivelar|cavar|encher|tapar|destapar|furar|pregar|despregar|aparafusar|desaparafusar|parafusar|desparafusar|soldar|dessoldar|colar|descolar|grudar|desgrudar|pendurar|despendurar|suspender|balançar|mexer|mover|deslocar|transportar|levar|trazer|conduzir|guiar|acompanhar|seguir|preceder|ultrapassar|alcançar|perseguir|fugir|escapar|evadir|salvar|correr|galopar|trotar|andar|passear|vagar|viajar|deslocar|circular|rolar|navegar|velejar|pilotar|conduzir|dirigir|manobrar|acionar|disparar|provocar|causar|ocasionar|arrastar|levar|conduzir|resultar|derivar|provir|vir|sair|emanar|brotar|surgir|aparecer|mostrar|manifestar|revelar|desvelar|esconder|dissimular|mascarar|velar|cobrir|recobrir|descobrir|desvelar|revelar|expor|apresentar|mostrar|fazer|ver|exibir|espalhar|explicar|redobrar)\b/.test(cleanText)) {
      return 'pt';
    }
    
    // Default to English if no other language is detected
    return 'en';
  };

  // Get the best voice for a specific language
  const getBestVoiceForLanguage = (lang: string, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    // Language-specific voice preferences
    const languagePreferences: { [key: string]: string[] } = {
      'en': ['Neural', 'Natural', 'Enhanced', 'Premium', 'Google', 'Microsoft', 'Amazon'],
      'es': ['Google español', 'Microsoft', 'Neural', 'Natural', 'Enhanced'],
      'fr': ['Google français', 'Microsoft', 'Neural', 'Natural', 'Enhanced'],
      'de': ['Google Deutsch', 'Microsoft', 'Neural', 'Natural', 'Enhanced'],
      'it': ['Google italiano', 'Microsoft', 'Neural', 'Natural', 'Enhanced'],
      'pt': ['Google português', 'Microsoft', 'Neural', 'Natural', 'Enhanced'],
      'ru': ['Google русский', 'Microsoft', 'Neural', 'Natural', 'Enhanced'],
      'zh': ['Google 中文', 'Microsoft', 'Neural', 'Natural', 'Enhanced'],
      'ja': ['Google 日本語', 'Microsoft', 'Neural', 'Natural', 'Enhanced'],
      'ko': ['Google 한국어', 'Microsoft', 'Neural', 'Natural', 'Enhanced'],
      'ar': ['Google العربية', 'Microsoft', 'Neural', 'Natural', 'Enhanced'],
      'hi': ['Google हिन्दी', 'Microsoft', 'Neural', 'Natural', 'Enhanced'],
      'bn': ['Google বাংলা', 'Microsoft', 'Neural', 'Natural', 'Enhanced']
    };

    const preferences = languagePreferences[lang] || languagePreferences['en'];
    
    // First, try to find voices that match the language
    const languageVoices = voices.filter(voice => voice.lang.startsWith(lang));
    
    if (languageVoices.length === 0) {
      // Fallback to English if no voices found for the language
      return voices.find(voice => voice.lang.startsWith('en')) || voices[0] || null;
    }

    // Try to find the best quality voice based on preferences
    for (const preference of preferences) {
      const preferredVoice = languageVoices.find(voice => 
        voice.name.toLowerCase().includes(preference.toLowerCase())
      );
      if (preferredVoice) {
        return preferredVoice;
      }
    }

    // If no preferred voice found, return the first available voice for the language
    return languageVoices[0];
  };

  // Play message content as audio using text-to-speech with multi-language support
  const playMessageAudio = (content: string, messageIndex: number, forceLanguage?: string) => {
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

      // Use forced language, selected language, or detect language
      const targetLanguage = forceLanguage || selectedLanguages[messageIndex] || detectLanguage(content);
      
      // Store the detected/selected language for this message
      setDetectedLanguages(prev => ({
        ...prev,
        [messageIndex]: targetLanguage
      }));

      if (forceLanguage) {
        setSelectedLanguages(prev => ({
          ...prev,
          [messageIndex]: forceLanguage
        }));
      }

      // Create speech utterance
      const utterance = new SpeechSynthesisUtterance(content);

      // Configure speech settings based on language
      utterance.rate = targetLanguage === 'ja' || targetLanguage === 'ko' ? 0.8 : 0.9; // Slower for complex languages
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
        const languageNames: { [key: string]: string } = {
          'en': 'English',
          'es': 'Spanish',
          'fr': 'French',
          'de': 'German',
          'it': 'Italian',
          'pt': 'Portuguese',
          'ru': 'Russian',
          'zh': 'Chinese',
          'ja': 'Japanese',
          'ko': 'Korean',
          'ar': 'Arabic',
          'hi': 'Hindi',
          'bn': 'Bangla'
        };
        
        const languageName = languageNames[targetLanguage] || 'Auto-detected';
        const modeText = forceLanguage ? 'Selected' : selectedLanguages[messageIndex] ? 'Selected' : 'Auto-detected';
        toast.success(`Playing audio in ${languageName} (${modeText})...`);
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

  return (
    <div className="min-h-screen bg-[#030637] flex overflow-hidden font-sans relative">
      {/* Backdrop overlay for mobile settings */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-25 lg:hidden"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <div
        className={`w-80 lg:w-80 md:w-72 sm:w-64 bg-gradient-to-b from-[#030637] to-[#2a1a3e] backdrop-blur-xl border-r border-white/10 flex flex-col fixed left-0 top-0 h-full z-20 shadow-2xl shadow-black/20 transition-transform duration-300 ${
          showSettings
            ? "transform -translate-x-full lg:translate-x-0"
            : "transform translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="bg-gradient-to-br from-[#00f5ff] to-[#9d4edd] rounded-xl lg:rounded-2xl p-2 lg:p-3 shadow-lg shadow-[#00f5ff]/20">
                <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-base lg:text-lg tracking-tight">
                  AI Bondhu
                </h1>
                <p className="text-[#D0D0D0] text-xs">Chat Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-[#D0D0D0] hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
              title="Settings"
            >
              <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={startNewChat}
            className="w-full bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] text-white py-2.5 lg:py-3 px-3 lg:px-4 rounded-xl lg:rounded-2xl flex items-center justify-center space-x-2 transition-all duration-500 shadow-lg shadow-[#00f5ff]/20 hover:shadow-[#9d4edd]/30 transform hover:scale-105 font-semibold text-sm lg:text-base"
          >
            <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
            <span>New Chat</span>
          </button>

          {/* User Info */}
          <div className="mt-3 lg:mt-4 p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 lg:space-x-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-[#00f5ff] to-[#9d4edd] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xs lg:text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-xs lg:text-sm">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[#D0D0D0] text-xs truncate max-w-24 lg:max-w-none">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-[#D0D0D0] hover:text-red-400 p-1.5 lg:p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
                title="Logout"
              >
                <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat List - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
          <div className="space-y-2 lg:space-y-3">
            {chats.length === 0 ? (
              <div className="text-center text-white/50 py-6 lg:py-8">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-white/10">
                  <MessageCircle className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-3 lg:mb-4 text-[#00f5ff]" />
                  <h3 className="text-base lg:text-lg font-semibold text-white mb-2">
                    No Conversations Yet
                  </h3>
                  <p className="text-xs lg:text-sm text-[#D0D0D0]">
                    Start a new chat to begin your AI conversation journey
                  </p>
                </div>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`group p-3 lg:p-4 rounded-xl lg:rounded-2xl cursor-pointer transition-all duration-300 backdrop-blur-xl border ${
                    currentChat?._id === chat._id
                      ? "bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 border-[#00f5ff]/30 shadow-lg shadow-[#00f5ff]/10"
                      : "bg-gradient-to-r from-white/5 to-white/10 border-white/10 hover:from-white/10 hover:to-white/15 hover:border-[#40e0d0]/20 hover:shadow-lg hover:shadow-[#40e0d0]/5"
                  }`}
                  onClick={() => selectChat(chat)}
                >
                  <div className="flex items-center justify-between">
                    {editingTitle === chat._id ? (
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onBlur={() => updateChatTitle(chat._id, newTitle)}
                        onKeyPress={(e) =>
                          e.key === "Enter" &&
                          updateChatTitle(chat._id, newTitle)
                        }
                        className="bg-transparent text-white text-xs lg:text-sm outline-none flex-1 placeholder-[#D0D0D0]"
                        autoFocus
                      />
                    ) : (
                      <h3 className="text-white text-xs lg:text-sm font-semibold truncate flex-1">
                        {chat.title || "New Chat"}
                      </h3>
                    )}

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTitle(chat._id);
                          setNewTitle(chat.title || "");
                        }}
                        className="p-1.5 lg:p-2 hover:bg-white/20 rounded-lg lg:rounded-xl transition-all duration-300 hover:shadow-lg"
                        title="Edit title"
                      >
                        <Edit2 className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-[#D0D0D0] hover:text-[#00f5ff]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareChat(chat._id);
                        }}
                        className="p-1.5 lg:p-2 hover:bg-white/20 rounded-lg lg:rounded-xl transition-all duration-300 hover:shadow-lg"
                        title="Share chat"
                      >
                        <Share2 className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-[#D0D0D0] hover:text-[#9d4edd]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat._id);
                        }}
                        className="p-1.5 lg:p-2 hover:bg-red-500/20 rounded-lg lg:rounded-xl transition-all duration-300 hover:shadow-lg"
                        title="Delete chat"
                      >
                        <Trash2 className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-[#D0D0D0] hover:text-red-400" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[#D0D0D0] text-xs mt-1.5 lg:mt-2 truncate leading-relaxed">
                    {chat.messages[chat.messages.length - 1]?.content?.slice(
                      0,
                      60
                    ) + "..." || "No messages yet"}
                  </p>

                  <div className="flex items-center justify-between mt-1.5 lg:mt-2">
                    <span className="text-[#40e0d0] text-xs font-medium">
                      {chat.messages.length} messages
                    </span>
                    <span className="text-[#D0D0D0] text-xs">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Settings Panel - Slides from right */}
      <div
        className={`fixed right-0 top-0 h-full w-80 lg:w-96 bg-gradient-to-b from-[#030637] to-[#2a1a3e] backdrop-blur-xl border-l border-white/10 z-30 shadow-2xl shadow-black/20 transform transition-transform duration-300 flex flex-col ${
          showSettings ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Fixed Header */}
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <button
              onClick={() => setShowSettings(false)}
              className="text-[#D0D0D0] hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
          <div className="p-6 space-y-6 pb-8">
            {/* Settings Tabs */}
            <div className="flex space-x-2 border-b border-white/20 pb-4">
              <button
                onClick={() => setSettingsTab("account")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  settingsTab === "account"
                    ? "bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 border border-[#00f5ff]/30 text-white"
                    : "text-[#D0D0D0] hover:text-white hover:bg-white/10"
                }`}
              >
                <User className="h-4 w-4" />
                <span className="text-sm">Account</span>
              </button>
              <button
                onClick={() => setSettingsTab("password")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  settingsTab === "password"
                    ? "bg-gradient-to-r from-[#00f5ff]/20 to-[#9d4edd]/20 border border-[#00f5ff]/30 text-white"
                    : "text-[#D0D0D0] hover:text-white hover:bg-white/10"
                }`}
              >
                <Lock className="h-4 w-4" />
                <span className="text-sm">Password</span>
              </button>
            </div>

            {/* Account Tab */}
            {settingsTab === "account" && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Profile Information</span>
                  </h3>

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label className="block text-[#D0D0D0] text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/5 text-white placeholder-[#D0D0D0] rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/50 focus:border-[#00f5ff]/30 transition-all duration-300 text-sm"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[#D0D0D0] text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/5 text-white placeholder-[#D0D0D0] rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/50 focus:border-[#00f5ff]/30 transition-all duration-300 text-sm"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className={`w-full px-4 py-2 bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] text-white rounded-xl font-medium transition-all duration-500 shadow-lg shadow-[#00f5ff]/20 hover:shadow-[#9d4edd]/30 transform hover:scale-105 text-sm ${
                        settingsLoading
                          ? "opacity-50 cursor-not-allowed transform-none"
                          : ""
                      }`}
                    >
                      {settingsLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Updating...</span>
                        </div>
                      ) : (
                        "Update Profile"
                      )}
                    </button>
                  </form>
                </div>

                {/* Current Account Info */}
                <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-3">
                    Account Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2">
                      <span className="text-[#D0D0D0] text-sm">Plan</span>
                      <span className="text-[#40e0d0] font-medium text-sm">
                        Free
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2">
                      <span className="text-[#D0D0D0] text-sm">
                        Member Since
                      </span>
                      <span className="text-white text-sm">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {settingsTab === "password" && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Change Password</span>
                  </h3>

                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-[#D0D0D0] text-sm font-medium mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/5 text-white placeholder-[#D0D0D0] rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#9d4edd]/50 focus:border-[#9d4edd]/30 transition-all duration-300 text-sm"
                        placeholder="Enter current password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[#D0D0D0] text-sm font-medium mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/5 text-white placeholder-[#D0D0D0] rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#9d4edd]/50 focus:border-[#9d4edd]/30 transition-all duration-300 text-sm"
                        placeholder="Enter new password"
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-[#D0D0D0] text-sm font-medium mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-white/5 text-white placeholder-[#D0D0D0] rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#9d4edd]/50 focus:border-[#9d4edd]/30 transition-all duration-300 text-sm"
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="bg-gradient-to-r from-[#00f5ff]/10 to-[#9d4edd]/10 rounded-xl p-3 border border-[#00f5ff]/20">
                      <h4 className="text-white font-medium mb-2 text-sm">
                        Password Requirements
                      </h4>
                      <ul className="text-[#D0D0D0] text-xs space-y-1">
                        <li>• Minimum 6 characters long</li>
                        <li>• Include both letters and numbers</li>
                        <li>• Use a unique password</li>
                      </ul>
                    </div>

                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className={`w-full px-4 py-2 bg-gradient-to-r from-[#9d4edd] to-[#40e0d0] hover:from-[#40e0d0] hover:to-[#9d4edd] text-white rounded-xl font-medium transition-all duration-500 shadow-lg shadow-[#9d4edd]/20 hover:shadow-[#40e0d0]/30 transform hover:scale-105 text-sm ${
                        settingsLoading
                          ? "opacity-50 cursor-not-allowed transform-none"
                          : ""
                      }`}
                    >
                      {settingsLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Changing...</span>
                        </div>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* AI Model Info */}
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">AI Model</h3>
              <div className="bg-gradient-to-r from-[#00f5ff]/10 to-[#9d4edd]/10 rounded-xl p-3 border border-[#00f5ff]/20">
                <p className="text-[#00f5ff] font-medium text-sm">
                  Claude 3.5 Sonnet
                </p>
                <p className="text-[#D0D0D0] text-xs">
                  Advanced reasoning and analysis
                </p>
              </div>
            </div>

            {/* Export Data */}
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Data Export</h3>
              <button className="w-full p-3 bg-gradient-to-r from-[#9d4edd]/20 to-[#40e0d0]/20 border border-[#9d4edd]/30 rounded-xl text-white hover:from-[#9d4edd]/30 hover:to-[#40e0d0]/30 transition-all duration-300 text-sm">
                Export Chat History
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="w-full p-3 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl text-red-400 hover:from-red-500/30 hover:to-red-600/30 hover:text-red-300 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area - Responsive layout */}
      <div
        className={`flex-1 flex flex-col h-screen bg-gradient-to-br from-[#030637] via-[#1a1a2e] to-[#16213e] backdrop-blur-xl transition-all duration-300 ${
          showSettings ? "lg:mr-96" : "mr-0"
        } ml-64 lg:ml-80`}
      >
        {/* Chat Header */}
        <div className="p-4 lg:p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl flex-shrink-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-xl lg:rounded-2xl p-2 lg:p-3 border border-[#00f5ff]/30">
                <MessageCircle className="h-5 w-5 lg:h-6 lg:w-6 text-[#00f5ff]" />
              </div>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold text-white tracking-tight">
                  {currentChat?.title || "New Conversation"}
                </h1>
                <p className="text-[#D0D0D0] text-xs lg:text-sm">
                  {currentChat
                    ? `${messages.length} messages`
                    : "Start typing to begin"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-r from-[#00f5ff]/10 to-[#9d4edd]/10 rounded-lg lg:rounded-xl border border-[#00f5ff]/20">
                <span className="text-[#00f5ff] text-xs lg:text-sm font-medium">
                  Claude 3.5 Sonnet
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages - Scrollable Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
          <div className="max-w-4xl lg:max-w-5xl mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
            {messages.length === 0 ? (
              <div className="text-center mt-12 lg:mt-20">
                <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl p-8 lg:p-12 border border-white/10 max-w-xl lg:max-w-2xl mx-auto">
                  <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-full p-4 lg:p-6 w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-4 lg:mb-6 border border-[#00f5ff]/30">
                    <MessageCircle className="h-8 w-8 lg:h-12 lg:w-12 text-[#00f5ff] mx-auto" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-4">
                    Ready to Chat
                  </h3>
                  <p className="text-[#D0D0D0] text-base lg:text-lg leading-relaxed">
                    I'm here to help you with any questions or tasks. Start a
                    conversation and let's explore what we can accomplish
                    together.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mt-6 lg:mt-8">
                    <div className="bg-gradient-to-r from-[#00f5ff]/10 to-[#40e0d0]/10 p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-[#00f5ff]/20">
                      <h4 className="text-[#00f5ff] font-semibold mb-1 lg:mb-2 text-sm lg:text-base">
                        Ask Questions
                      </h4>
                      <p className="text-[#D0D0D0] text-xs lg:text-sm">
                        Get detailed answers on any topic
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-[#9d4edd]/10 to-[#40e0d0]/10 p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-[#9d4edd]/20">
                      <h4 className="text-[#9d4edd] font-semibold mb-1 lg:mb-2 text-sm lg:text-base">
                        Get Help
                      </h4>
                      <p className="text-[#D0D0D0] text-xs lg:text-sm">
                        Solve problems and learn new things
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex items-start space-x-2 lg:space-x-4 max-w-3xl lg:max-w-4xl">
                    {message.role === "assistant" && (
                      <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-xl lg:rounded-2xl p-2 lg:p-3 border border-[#00f5ff]/30 flex-shrink-0">
                        <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5 text-[#00f5ff]" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div
                        className={`p-4 lg:p-6 rounded-2xl lg:rounded-3xl backdrop-blur-xl shadow-lg ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-[#9d4edd]/20 to-[#40e0d0]/20 border border-[#9d4edd]/30 text-white ml-auto"
                            : "bg-gradient-to-r from-white/5 to-white/10 border border-white/10 text-white"
                        }`}
                      >
                        <div className="prose prose-invert max-w-none">
                          <p className="whitespace-pre-wrap leading-relaxed text-sm lg:text-base">
                            {message.content}
                          </p>
                        </div>

                        {/* Copy, Share and Audio buttons for AI responses */}
                        {message.role === "assistant" && (
                          <div className="flex items-center justify-end space-x-2 mt-4 pt-3 border-t border-white/10 flex-wrap gap-2">
                            <button
                              onClick={() =>
                                copyMessageContent(message.content)
                              }
                              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-[#00f5ff]/30 text-[#D0D0D0] hover:text-white transition-all duration-300 text-xs font-medium shadow-sm hover:shadow-lg hover:shadow-[#00f5ff]/10 transform hover:scale-105"
                              title="Copy message to clipboard"
                            >
                              <Copy className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Copy</span>
                            </button>
                            <button
                              onClick={() =>
                                shareMessageContent(message.content)
                              }
                              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-[#9d4edd]/30 text-[#D0D0D0] hover:text-white transition-all duration-300 text-xs font-medium shadow-sm hover:shadow-lg hover:shadow-[#9d4edd]/10 transform hover:scale-105"
                              title="Share this message"
                            >
                              <Share2 className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Share</span>
                            </button>
                            <button
                              onClick={() =>
                                playMessageAudio(message.content, index)
                              }
                              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-[#40e0d0]/30 text-[#D0D0D0] hover:text-white transition-all duration-300 text-xs font-medium shadow-sm hover:shadow-lg hover:shadow-[#40e0d0]/10 transform hover:scale-105 ${
                                playingMessageIndex === index
                                  ? "bg-[#40e0d0]/20 border-[#40e0d0]/50 text-[#40e0d0]"
                                  : ""
                              }`}
                              title={
                                playingMessageIndex === index
                                  ? "Stop audio"
                                  : `Play message as audio${detectedLanguages[index] ? ` (${(() => {
                                      const languageNames: { [key: string]: string } = {
                                        'en': 'EN',
                                        'es': 'ES',
                                        'fr': 'FR',
                                        'de': 'DE',
                                        'it': 'IT',
                                        'pt': 'PT',
                                        'ru': 'RU',
                                        'zh': 'ZH',
                                        'ja': 'JA',
                                        'ko': 'KO',
                                        'ar': 'AR',
                                        'hi': 'HI',
                                        'bn': 'BN'
                                      };
                                      return languageNames[detectedLanguages[index]] || 'AUTO';
                                    })()})` : ''}`
                              }
                            >
                              <Volume2
                                className={`h-3.5 w-3.5 ${
                                  playingMessageIndex === index
                                    ? "animate-pulse"
                                    : ""
                                }`}
                              />
                              <span className="hidden sm:inline">
                                {playingMessageIndex === index ? "Stop" : "Listen"}
                                {detectedLanguages[index] && (
                                  <span className="ml-1 opacity-70 text-xs">
                                    ({(() => {
                                      const languageNames: { [key: string]: string } = {
                                        'en': 'EN',
                                        'es': 'ES',
                                        'fr': 'FR',
                                        'de': 'DE',
                                        'it': 'IT',
                                        'pt': 'PT',
                                        'ru': 'RU',
                                        'zh': 'ZH',
                                        'ja': 'JA',
                                        'ko': 'KO',
                                        'ar': 'AR',
                                        'hi': 'HI',
                                        'bn': 'BN'
                                      };
                                      return languageNames[detectedLanguages[index]] || 'AUTO';
                                    })()})
                                  </span>
                                )}
                              </span>
                            </button>
                            {/* Language selector dropdown */}
                            <div className="relative">
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    playMessageAudio(message.content, index, e.target.value);
                                  }
                                }}
                                className="appearance-none bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 hover:border-[#40e0d0]/30 text-[#D0D0D0] hover:text-white rounded-xl px-2 py-2 text-xs font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#40e0d0]/50 cursor-pointer min-w-[45px] text-center"
                                title="Select language for audio playback"
                                value=""
                              >
                                <option value="" disabled className="bg-[#1a1a2e] text-[#D0D0D0]">
                                  🌐
                                </option>
                                <option value="en" className="bg-[#1a1a2e] text-white">🇺🇸 English</option>
                                <option value="es" className="bg-[#1a1a2e] text-white">🇪🇸 Spanish</option>
                                <option value="fr" className="bg-[#1a1a2e] text-white">🇫🇷 French</option>
                                <option value="de" className="bg-[#1a1a2e] text-white">🇩🇪 German</option>
                                <option value="it" className="bg-[#1a1a2e] text-white">🇮🇹 Italian</option>
                                <option value="pt" className="bg-[#1a1a2e] text-white">🇵🇹 Portuguese</option>
                                <option value="ru" className="bg-[#1a1a2e] text-white">🇷🇺 Russian</option>
                                <option value="zh" className="bg-[#1a1a2e] text-white">🇨🇳 Chinese</option>
                                <option value="ja" className="bg-[#1a1a2e] text-white">🇯🇵 Japanese</option>
                                <option value="ko" className="bg-[#1a1a2e] text-white">🇰🇷 Korean</option>
                                <option value="ar" className="bg-[#1a1a2e] text-white">🇸🇦 Arabic</option>
                                <option value="hi" className="bg-[#1a1a2e] text-white">🇮🇳 Hindi</option>
                                <option value="bn" className="bg-[#1a1a2e] text-white">🇧🇩 Bangla</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {message.role === "user" && (
                      <div className="bg-gradient-to-br from-[#9d4edd]/20 to-[#40e0d0]/20 rounded-xl lg:rounded-2xl p-2 lg:p-3 border border-[#9d4edd]/30 flex-shrink-0">
                        <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-br from-[#9d4edd] to-[#40e0d0] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 lg:space-x-4 max-w-3xl lg:max-w-4xl">
                  <div className="bg-gradient-to-br from-[#00f5ff]/20 to-[#9d4edd]/20 rounded-xl lg:rounded-2xl p-2 lg:p-3 border border-[#00f5ff]/30 flex-shrink-0">
                    <MessageCircle className="h-4 w-4 lg:h-5 lg:w-5 text-[#00f5ff]" />
                  </div>
                  <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/10 text-white p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-lg">
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#00f5ff] rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#9d4edd] rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#40e0d0] rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-[#D0D0D0] font-medium text-sm lg:text-base">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area - Integrated */}

        <div className=" mx-auto">
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-white/20 shadow-2xl shadow-black/20 p-2">
            <div className="flex items-end space-x-2 lg:space-x-4">
              {/* Input field */}
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !loading) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your message... (Shift + Enter for new line)"
                  className="w-full px-4 lg:px-6 py-3 lg:py-4 bg-transparent text-white placeholder-[#D0D0D0] rounded-xl lg:rounded-2xl border-none focus:outline-none resize-none scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent text-sm lg:text-base leading-relaxed"
                  disabled={loading}
                  rows={1}
                  style={{
                    minHeight: "20px",
                    maxHeight: "100px",
                    overflow: "auto",
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "20px";
                    target.style.height = target.scrollHeight + "px";
                  }}
                />
                {inputMessage && (
                  <button
                    onClick={() => setInputMessage("")}
                    className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-[#D0D0D0] hover:text-white transition-colors p-1 rounded-xl hover:bg-white/10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 lg:h-4 lg:w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={loading || !inputMessage.trim()}
                className="px-4 lg:px-6 py-3 lg:py-4 bg-gradient-to-r from-[#00f5ff] to-[#9d4edd] hover:from-[#9d4edd] hover:to-[#00f5ff] disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl lg:rounded-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#00f5ff]/50 flex items-center justify-center min-w-[50px] lg:min-w-[60px] shadow-lg shadow-[#00f5ff]/20 hover:shadow-[#9d4edd]/30 transform hover:scale-105 disabled:transform-none disabled:shadow-none"
              >
                {loading ? (
                  <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Send className="h-4 w-4 lg:h-5 lg:w-5" />
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-[#D0D0D0]/70 mt-3 lg:mt-4 text-center leading-relaxed">
            AI responses are generated and may contain inaccuracies. Please
            verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
