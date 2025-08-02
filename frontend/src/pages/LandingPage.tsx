import React from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Shield, Zap, Brain } from 'lucide-react'

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <Brain className="h-16 w-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            Private GPT Chat
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 animate-slide-up">
            Experience AI-powered conversations with complete privacy and security. 
            Your chats, your data, your control.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/auth/signup" className="btn-primary text-lg px-8 py-4">
              Get Started Free
            </Link>
            <Link to="/auth/signin" className="btn-secondary text-lg px-8 py-4">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center animate-slide-up">
            <div className="flex justify-center mb-4">
              <MessageCircle className="h-12 w-12 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Smart Conversations</h3>
            <p className="text-white/70">
              Powered by advanced AI, engage in natural, intelligent conversations 
              that understand context and provide helpful responses.
            </p>
          </div>
          
          <div className="card text-center animate-slide-up">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Complete Privacy</h3>
            <p className="text-white/70">
              Your conversations are encrypted and stored securely. 
              Only you have access to your chat history and data.
            </p>
          </div>
          
          <div className="card text-center animate-slide-up">
            <div className="flex justify-center mb-4">
              <Zap className="h-12 w-12 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Lightning Fast</h3>
            <p className="text-white/70">
              Get instant responses with our optimized infrastructure. 
              No waiting, just seamless conversations.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="card max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Private AI Journey?
          </h2>
          <p className="text-white/70 mb-8">
            Join thousands of users who trust Private GPT Chat for their AI conversations.
          </p>
          <Link to="/auth/signup" className="btn-primary text-lg px-8 py-4">
            Create Your Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
