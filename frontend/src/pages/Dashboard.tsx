import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { MessageCircle, Send, Plus, Settings, LogOut, Edit2, Trash2, Share2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Chat {
  _id: string
  title: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  createdAt: Date
  updatedAt: Date
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChat, setCurrentChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingTitle, setEditingTitle] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    fetchChats()
  }, [])

  const fetchChats = async () => {
    try {
      const response = await axios.get('/api/chat')
      setChats(response.data.chats)
    } catch (error) {
      toast.error('Failed to fetch chats')
    }
  }

  const startNewChat = () => {
    setCurrentChat(null)
    setMessages([])
  }

  const selectChat = (chat: Chat) => {
    setCurrentChat(chat)
    setMessages(chat.messages)
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = { role: 'user', content: inputMessage }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInputMessage('')
    setLoading(true)

    try {
      const response = await axios.post('/api/chat', {
        message: inputMessage,
        chatId: currentChat?._id,
      })

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response,
      }

      setMessages([...newMessages, assistantMessage])
      
      if (!currentChat) {
        // New chat created
        setCurrentChat(response.data.chat)
        fetchChats()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const deleteChat = async (chatId: string) => {
    if (!confirm('Are you sure you want to delete this chat?')) return

    try {
      await axios.delete(`/api/chat/${chatId}`)
      setChats(chats.filter(chat => chat._id !== chatId))
      if (currentChat?._id === chatId) {
        setCurrentChat(null)
        setMessages([])
      }
      toast.success('Chat deleted successfully')
    } catch (error) {
      toast.error('Failed to delete chat')
    }
  }

  const updateChatTitle = async (chatId: string, title: string) => {
    try {
      await axios.patch(`/api/chat/${chatId}`, { title })
      setChats(chats.map(chat => 
        chat._id === chatId ? { ...chat, title } : chat
      ))
      if (currentChat?._id === chatId) {
        setCurrentChat({ ...currentChat, title })
      }
      setEditingTitle(null)
      toast.success('Chat title updated')
    } catch (error) {
      toast.error('Failed to update chat title')
    }
  }

  const shareChat = async (chatId: string) => {
    try {
      await axios.post(`/api/chat/${chatId}/share`)
      const shareUrl = `${window.location.origin}/chat/${chatId}`
      navigator.clipboard.writeText(shareUrl)
      toast.success('Share link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to share chat')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-80 bg-white/5 backdrop-blur-sm border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Private GPT</h2>
            <button
              onClick={startNewChat}
              className="btn-primary p-2"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat._id}
                className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentChat?._id === chat._id
                    ? 'bg-primary-600/20 border border-primary-500/30'
                    : 'hover:bg-white/5'
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
                      onKeyPress={(e) => e.key === 'Enter' && updateChatTitle(chat._id, newTitle)}
                      className="bg-transparent text-white text-sm outline-none flex-1"
                      autoFocus
                    />
                  ) : (
                    <h3 className="text-white text-sm font-medium truncate flex-1">
                      {chat.title || 'New Chat'}
                    </h3>
                  )}
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingTitle(chat._id)
                        setNewTitle(chat.title || '')
                      }}
                      className="p-1 hover:bg-white/10 rounded"
                      title="Edit title"
                    >
                      <Edit2 className="h-3 w-3 text-white/60" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        shareChat(chat._id)
                      }}
                      className="p-1 hover:bg-white/10 rounded"
                      title="Share chat"
                    >
                      <Share2 className="h-3 w-3 text-white/60" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteChat(chat._id)
                      }}
                      className="p-1 hover:bg-white/10 rounded"
                      title="Delete chat"
                    >
                      <Trash2 className="h-3 w-3 text-white/60" />
                    </button>
                  </div>
                </div>
                
                <p className="text-white/50 text-xs mt-1 truncate">
                  {chat.messages[chat.messages.length - 1]?.content || 'No messages yet'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/settings"
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
          
          <button
            onClick={logout}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
          <h1 className="text-xl font-semibold text-white">
            {currentChat?.title || 'New Chat'}
          </h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-white/50 mt-20">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Start a conversation</h3>
              <p>Ask me anything and I'll help you with detailed responses.</p>
            </div>
          ) : (
            messages.map((message, index) => (
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
                </div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-sm text-white p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse">Thinking...</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 input-field"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !inputMessage.trim()}
              className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
