import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Share2, Copy } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Chat {
  _id: string
  title: string
  messages: Message[]
  isShared: boolean
  createdAt: Date
}

const ChatView: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>()
  const [chat, setChat] = useState<Chat | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (chatId) {
      fetchChat(chatId)
    }
  }, [chatId])

  const fetchChat = async (id: string) => {
    try {
      const response = await axios.get(`/api/chat/${id}`)
      setChat(response.data.chat)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load chat')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast.success('Link copied to clipboard!')
  }

  const copyChat = () => {
    if (!chat) return
    
    const chatText = chat.messages
      .map(msg => `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`)
      .join('\n\n')
    
    navigator.clipboard.writeText(chatText)
    toast.success('Chat copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!chat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Chat Not Found</h1>
          <p className="text-white/70 mb-6">The chat you're looking for doesn't exist or is private.</p>
          <Link to="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="mr-4 p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{chat.title}</h1>
              <p className="text-white/50 text-sm">
                {new Date(chat.createdAt).toLocaleDateString()}
                {chat.isShared && <span className="ml-2 text-green-400">• Shared</span>}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="btn-secondary p-2"
              title="Copy link"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={copyChat}
              className="btn-secondary p-2"
              title="Copy chat"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-6">
          {chat.messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/10 backdrop-blur-sm text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-60 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/50 text-sm">
            This conversation was generated using Private GPT Chat
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChatView
