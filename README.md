# 🤖 AI Bondhu - Private GPT Chat Application

A comprehensive, full-stack AI chat application built with React, Node.js, and TypeScript. Features **persistent authentication with HttpOnly cookies**, **intelligent AI conversations powered by OpenRouter API**, **advanced voice chat capabilities**, **cross-platform mobile support**, and a stunning deep-space themed UI with glassmorphism effects.

![Private GPT Chat](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3.0-blue)
![Capacitor](https://img.shields.io/badge/Capacitor-Mobile-purple)

## 🌟 **Live Demo**

- **🌐 Web App**: [https://ai-bondhu-tau.vercel.app/](https://ai-bondhu-tau.vercel.app/)
- **📱 Android APK**: Available on request
- **🍎 iOS App**: Available on request

## ✨ Features

### 🔐 **Enterprise-Grade Persistent Authentication**

- **HttpOnly Cookie Security**: Secure token storage immune to XSS attacks
- **Cross-Tab Synchronization**: Login/logout events sync across all browser tabs instantly
- **Automatic Session Persistence**: Maintains authentication across browser restarts
- **JWT Token Management**: Access and refresh tokens with automatic renewal
- **Social OAuth Integration**: Google and Facebook login with Passport.js
- **Session Health Monitoring**: Automatic session validation and refresh
- **Fallback Token Support**: LocalStorage backup for environments without cookie support
- **Remember Me Functionality**: Extended session persistence for user convenience

### 🎤 **Advanced Voice Chat System**

- **Full Voice Conversations**: Complete hands-free chat experience with AI
- **Speech-to-Text Integration**: Real-time voice input with Web Speech API
- **Text-to-Speech Streaming**: Live audio playback as AI responds
- **Voice Activity Detection**: Visual feedback during speaking and listening
- **Intelligent Voice Control**: Start/stop voice interactions with single button
- **Multi-Language Voice Support**: English optimized with premium voice selection
- **Audio Status Indicators**: Real-time feedback for all voice states
- **Streaming Audio Management**: Uninterrupted playback with manual stop controls

### 💬 **Advanced AI-Powered Conversations**

- **Enhanced AI Responses**: Configured for comprehensive, detailed answers instead of brief responses
- **OpenRouter API Integration**: Multiple AI model support with intelligent fallbacks
- **Model Selection**: GPT-4o-mini, Claude-3-haiku, Claude-3.5-Sonnet, and more
- **Increased Token Limits**: Up to 2000 tokens for detailed, in-depth responses
- **Smart Prompt Engineering**: System prompts optimized for educational, comprehensive answers
- **Real-time Chat Interface**: Instant message display with typing indicators
- **Context-Aware Responses**: Maintains conversation context across messages
- **Message Persistence**: Complete chat history stored in MongoDB
- **Error Handling**: Robust retry logic and fallback mechanisms
- **Rate Limiting**: API abuse prevention with configurable limits

### 📱 **Cross-Platform Mobile Support**

- **Capacitor Integration**: Native iOS and Android app support
- **Mobile-Optimized UI**: Touch-friendly interface with mobile gestures
- **Native App Features**: Custom splash screen, status bar, and deep linking
- **OAuth Mobile Flow**: Seamless social login in mobile apps
- **Responsive Design**: Adaptive layout for all screen sizes
- **Progressive Web App**: Install as native app on any platform
- **Deep Link Support**: Custom URL scheme (aibondhu://) for OAuth callbacks
- **Mobile Performance**: Optimized for mobile hardware and network conditions

### **Modern Glassmorphism UI/UX**

- **Deep-Space Theme**: Stunning #030637 background with neon accents
- **Color Palette**: Cyan (#00f5ff), Purple (#9d4edd), Turquoise (#40e0d0)
- **Glassmorphism Effects**: Backdrop blur with rgba transparency
- **Responsive Dashboard**: Integrated sidebar with sliding settings panel
- **Voice Chat Interface**: Dedicated full-screen voice interaction mode
- **Custom Favicon System**: SVG favicons with AI chat branding
- **Enhanced Input Areas**: Auto-expanding textarea with voice input buttons
- **Mobile-First Design**: Optimized for all screen sizes and touch interactions
- **Smooth Animations**: CSS transitions and hover effects throughout
- **Interactive Voice Controls**: Visual feedback for voice states and audio playback

### 🗂️ **Comprehensive Chat Management**

- **Integrated Chat Interface**: Seamless message flow with real-time updates
- **Chat Operations**: Create, edit, rename, and delete conversations
- **Message Actions**: Copy, share, and listen to individual messages
- **Public Sharing**: Generate shareable links for conversations
- **Chat History**: Persistent storage with message timestamps
- **Search & Filter**: Quick access to conversation history
- **Export Functionality**: Download chat history for backup

### 👤 **Advanced User Management**

- **Integrated Settings Panel**: In-dashboard profile and password management
- **Account Information**: Display current plan, member since date
- **Profile Updates**: Real-time name and email modification
- **Password Management**: Secure password changes with validation
- **Social Account Display**: Show connected OAuth providers
- **Account Deletion**: Complete user data removal options
- **Profile Pictures**: Avatar support from social providers

### 🛡️ **Enterprise-Grade Security**

- **HttpOnly Cookie Protection**: Immune to XSS attacks with secure token storage
- **CORS Protection**: Configurable origins with credentials support
- **Cross-Tab Security**: Synchronized authentication across multiple tabs
- **Input Validation**: Zod schemas for type-safe API requests
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **SQL Injection Prevention**: MongoDB ODM with parameterized queries
- **XSS Protection**: Content sanitization and CSP headers
- **Authentication Middleware**: Route-level access control
- **Session Security**: Secure cookie settings with SameSite protection
- **Token Encryption**: JWT tokens with secure secret keys and expiration

## 🛠️ Tech Stack

### **Frontend Architecture**

- **React 18** - Modern React with hooks, functional components, and Suspense
- **TypeScript** - Full type safety with strict mode enabled
- **Vite** - Lightning-fast development with hot module replacement
- **Tailwind CSS** - Utility-first CSS with custom design system
- **React Router** - Client-side routing with protected route components
- **Axios** - HTTP client with request/response interceptors and cookie support
- **React Hot Toast** - Beautiful toast notifications with custom styling
- **Lucide React** - Modern icon library with consistent styling
- **Context API** - State management for authentication and user data
- **Capacitor** - Cross-platform mobile app framework for iOS/Android
- **Web Speech API** - Voice-to-text and text-to-speech capabilities

### **Backend Architecture**

- **Node.js** with **Express.js** - RESTful API server with middleware
- **TypeScript** - Type-safe backend development with interfaces
- **MongoDB** with **Mongoose ODM** - NoSQL database with schema validation
- **Passport.js** - Authentication middleware with OAuth strategies
- **JWT** - JSON Web Tokens for stateless authentication
- **Zod** - Runtime type validation and schema parsing
- **bcryptjs** - Password hashing with configurable salt rounds
- **express-rate-limit** - Rate limiting middleware with Redis support
- **CORS** - Cross-origin resource sharing with custom configuration

### **AI & External Services**

- **OpenRouter API** - Access to multiple AI models with unified interface
- **Multiple AI Models** - GPT-4o-mini, Claude-3-haiku, Claude-3.5-Sonnet, GPT-3.5-turbo
- **Enhanced Response Configuration** - Optimized for detailed, comprehensive answers
- **Google OAuth 2.0** - Social authentication with Google accounts
- **Facebook OAuth 2.0** - Social authentication with Facebook accounts
- **Web Speech API** - Browser-native text-to-speech and speech-to-text
- **Capacitor Plugins** - Native mobile features (App, Browser, SplashScreen, StatusBar)

### **Development & Deployment**

- **ESLint** - Code linting with TypeScript and React configurations
- **Prettier** - Code formatting with consistent style rules
- **Nodemon** - Development server with auto-reload functionality
- **VS Code Tasks** - Integrated development workflow automation
- **Vercel** - Frontend and backend deployment with automatic previews
- **Capacitor CLI** - Mobile app build and deployment tools
- **Android Studio** - Android app development and testing
- **Xcode** - iOS app development and testing (macOS required)

### **Design System & Theming**

- **Color Palette**:
  - Primary: `#030637` (Deep Space Blue)
  - Accent: `#00f5ff` (Cyan), `#9d4edd` (Purple), `#40e0d0` (Turquoise)
  - Glass Effects: Backdrop blur with rgba(255,255,255,0.1) transparency
- **Typography**: Inter font family with optimized font loading
- **Component Architecture**: Modular, reusable components with consistent theming
- **Responsive Design**: Mobile-first approach with 4 breakpoint system
- **Animation Library**: CSS transitions with easing functions

## 🏗️ Project Architecture

### **Frontend Structure**

```
frontend/
├── 📁 public/                    # Static assets and favicons
│   ├── favicon.svg              # Custom AI-themed SVG favicon
│   ├── favicon-16x16.svg        # Fallback favicon for older browsers
│   └── index.html               # Main HTML template with meta tags
├── 📁 src/
│   ├── 📄 main.tsx              # Application entry point with providers
│   ├── 📄 App.tsx               # Main app component with routing
│   ├── 📄 index.css             # Global styles and Tailwind imports
│   ├── 📁 components/           # Reusable React components
│   │   ├── 📁 landing/          # Landing page components
│   │   │   ├── Header.tsx       # Navigation with mobile menu
│   │   │   ├── Hero.tsx         # Hero section with gradient text
│   │   │   ├── Features.tsx     # Three-column feature showcase
│   │   │   ├── CallToAction.tsx # Secondary CTA with gradient button
│   │   │   ├── Contact.tsx      # Contact form with validation
│   │   │   └── Footer.tsx       # Footer with social links
│   │   ├── 📁 dashboard/        # Dashboard components
│   │   │   ├── DashboardLayout.tsx     # Main container
│   │   │   ├── 📁 sidebar/
│   │   │   │   └── Sidebar.tsx         # Left sidebar navigation
│   │   │   ├── 📁 chat/
│   │   │   │   ├── ChatArea.tsx        # Chat container
│   │   │   │   ├── ChatHeader.tsx      # Chat header
│   │   │   │   ├── ChatMessages.tsx    # Messages display
│   │   │   │   ├── ChatInput.tsx       # Input form with voice controls
│   │   │   │   ├── VoiceChat.tsx       # Full-screen voice chat interface
│   │   │   │   └── 📁 components/      # Chat sub-components
│   │   │   │       ├── VoiceToTextButton.tsx    # Microphone input button
│   │   │   │       ├── VoiceModeToggleButton.tsx # Voice mode toggle
│   │   │   │       ├── SendButton.tsx           # Message send button
│   │   │   │       ├── ClearButton.tsx          # Clear input button
│   │   │   │       ├── TextInputField.tsx       # Enhanced text input
│   │   │   │       ├── SingleMessage.tsx        # Individual message display
│   │   │   │       ├── MessageActions.tsx       # Message action buttons
│   │   │   │       ├── LoadingMessage.tsx       # Loading state display
│   │   │   │       └── StatusMessages.tsx       # Status indicators
│   │   │   │   └── 📁 voice/           # Voice chat components
│   │   │   │       ├── VoiceControlButton.tsx   # Main voice control
│   │   │   │       ├── VoiceActivityIndicator.tsx # Voice activity display
│   │   │   │       ├── VoiceStatusDisplay.tsx   # Voice status text
│   │   │   │       └── VoiceBackButton.tsx      # Back to text mode
│   │   │   └── 📁 settings/
│   │   │       └── SettingsPanel.tsx   # User settings panel
│   │   ├── GoogleLoginButton.tsx # Google OAuth integration
│   │   ├── FacebookLoginButton.tsx # Facebook OAuth integration
│   │   ├── LoadingSpinner.tsx   # Reusable loading component
│   │   ├── MarkdownMessage.tsx  # Markdown rendering for AI responses
│   │   ├── TypingIndicator.tsx  # AI typing animation
│   │   ├── ProtectedRoute.tsx   # Authentication wrapper
│   │   ├── PublicRoute.tsx      # Public route wrapper
│   │   ├── OAuthCallback.tsx    # OAuth callback handler
│   │   └── MobileAppEnforcer.tsx # Mobile app detection
│   ├── 📁 hooks/                # Custom React hooks
│   │   ├── useChat.ts           # Chat functionality with streaming
│   │   ├── useSpeechSynthesis.ts # Text-to-speech functionality
│   │   ├── useVoiceToText.ts    # Speech-to-text functionality
│   │   └── useSessionPersistence.ts # Session persistence management
│   ├── 📁 contexts/             # React Context providers
│   │   └── AuthContext.tsx      # Authentication state with cross-tab sync
│   ├── 📁 pages/                # Page components
│   │   ├── LandingPage.tsx      # Public homepage
│   │   ├── Dashboard.tsx        # Main chat interface with voice support
│   │   ├── ChatView.tsx         # Individual chat view
│   │   ├── Settings.tsx         # User settings panel
│   │   └── 📁 auth/             # Authentication pages
│   │       ├── SignIn.tsx       # Login form with OAuth and Remember Me
│   │       └── SignUp.tsx       # Registration form with OAuth and Remember Me
│   ├── 📁 types/                # TypeScript type definitions
│   │   └── auth.ts              # Authentication interfaces
│   └── 📁 utils/                # Utility functions
│       ├── api.ts               # Axios config with cookies and session management
│       └── clipboard.ts         # Clipboard utilities
├── 📄 capacitor.config.ts       # Capacitor mobile app configuration
├── 📄 package.json              # Dependencies and scripts
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 tailwind.config.js        # Tailwind CSS configuration
├── 📄 vite.config.ts            # Vite build configuration
└── 📄 vercel.json               # Vercel deployment configuration
```

### **Backend Structure**

```
backend/
├── 📁 src/
│   ├── 📄 app.ts                # Express app with HttpOnly cookie config
│   ├── 📄 server.ts             # Server startup and database connection
│   ├── 📁 auth/                 # Authentication module
│   │   ├── auth.controller.ts   # OAuth, JWT, and HttpOnly cookie controllers
│   │   ├── auth.service.ts      # Authentication business logic with enhanced security
│   │   ├── auth.routes.ts       # Auth route definitions with session verification
│   │   ├── auth.interface.ts    # Authentication interfaces
│   │   └── auth.validation.ts   # Zod validation schemas
│   ├── 📁 chat/                 # Chat management module
│   │   ├── chat.controller.ts   # Chat CRUD operations
│   │   ├── chat.service.ts      # Enhanced AI integration with detailed responses
│   │   ├── chat.model.ts        # MongoDB chat schema
│   │   ├── chat.routes.ts       # Chat route definitions
│   │   ├── chat.interface.ts    # Chat type definitions
│   │   ├── chat.validation.ts   # Chat validation schemas
│   │   └── test.controller.ts   # Testing utilities
│   ├── 📁 user/                 # User management module
│   │   ├── user.controller.ts   # User profile operations
│   │   ├── user.service.ts      # User business logic
│   │   ├── user.model.ts        # MongoDB user schema
│   │   ├── user.routes.ts       # User route definitions
│   │   ├── user.interface.ts    # User interfaces
│   │   └── user.validation.ts   # User validation schemas
│   ├── 📁 config/               # Configuration modules
│   │   ├── env.ts               # Environment variable validation
│   │   ├── passport.ts          # Passport OAuth strategies (Google, Facebook)
│   │   └── database.ts          # MongoDB connection setup
│   ├── 📁 shared/               # Shared utilities
│   │   ├── database.ts          # Database connection utilities
│   │   └── 📁 middleware/       # Express middleware
│   │       ├── auth.ts          # JWT and cookie authentication middleware
│   │       ├── errorHandler.ts  # Global error handling
│   │       └── validation.ts    # Request validation middleware
│   └── 📁 types/                # Global type definitions
│       └── express.d.ts         # Express type extensions
├── 📄 package.json              # Dependencies and scripts
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 nodemon.json              # Development server configuration
└── 📄 vercel.json               # Deployment configuration
```

## ⚙️ Environment Variables

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5001

# Database Configuration
# Local MongoDB
MONGO_URI=mongodb://localhost:27017/private-gpt-chat
# Or MongoDB Atlas (recommended for production)
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/private-gpt-chat

# JWT Configuration (Generate secure 64+ character strings)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure_2024
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here_make_it_long_and_secure_2024

# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENAI_API_BASE_URL=https://openrouter.ai/api/v1

# Client Configuration
CLIENT_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# Session Secret for Passport
SESSION_SECRET=your_session_secret_key_here_make_it_secure

# Google OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Facebook OAuth Configuration (Optional)
FACEBOOK_CLIENT_ID=your_facebook_app_id_here
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret_here
FACEBOOK_CALLBACK_URL=http://localhost:5001/api/auth/facebook/callback
```

### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5001

# App Configuration
VITE_APP_NAME=AI Bondhu
VITE_APP_VERSION=1.0.0
```

### Mobile App Configuration (Optional)

For mobile app development with Capacitor:

```bash
# Install Capacitor CLI
npm install -g @capacitor/cli

# Add platforms
npx cap add android
npx cap add ios

# Configure capacitor.config.ts with your app details
```

### OAuth Setup Instructions

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5001/api/auth/google/callback`
   - `https://yourdomain.com/api/auth/google/callback`

#### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure Valid OAuth Redirect URIs:
   - `http://localhost:5001/api/auth/facebook/callback`
   - `https://yourdomain.com/api/auth/facebook/callback`

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **OpenRouter API Account** (get your key from [OpenRouter](https://openrouter.ai/keys))
- **Google OAuth App** (optional, for Google login)
- **Facebook OAuth App** (optional, for Facebook login)
- **Android Studio** (optional, for Android app development)
- **Xcode** (optional, for iOS app development on macOS)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/reduanahmadswe/private-gpt-chat-app.git
   cd private-gpt-chat-app
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration (see Environment Variables section)
   npm run build
   npm start
   ```

3. **Setup Frontend** (in a new terminal)

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Setup Mobile App** (optional)

   ```bash
   cd frontend

   # Build for web first
   npm run build

   # Add mobile platforms
   npx cap add android
   npx cap add ios

   # Sync web assets to mobile
   npx cap sync

   # Open in Android Studio
   npx cap open android

   # Open in Xcode (macOS only)
   npx cap open ios
   ```

5. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5001`
   - Health Check: `http://localhost:5001/api/health`
   - Mobile App: Build and install APK/IPA file

## 🔧 Development Commands

### Backend Development

```bash
# Development with auto-reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

### Frontend Development

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Build mobile app
npm run build
npx cap sync
npx cap run android
npx cap run ios
```

### Mobile Development Commands

```bash
# Add mobile platforms
npx cap add android
npx cap add ios

# Sync web build to mobile
npx cap sync

# Open in native IDEs
npx cap open android
npx cap open ios

# Run on device/emulator
npx cap run android
npx cap run ios

# Update Capacitor
npx cap update
```

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint                      | Description             | Auth Required |
| ------ | ----------------------------- | ----------------------- | ------------- |
| `POST` | `/api/auth/signup`            | Register new user       | ❌            |
| `POST` | `/api/auth/signin`            | User login              | ❌            |
| `POST` | `/api/auth/refresh`           | Refresh JWT token       | ❌            |
| `GET`  | `/api/auth/verify`            | Verify current session  | ✅            |
| `GET`  | `/api/auth/me`                | Get current user info   | ✅            |
| `POST` | `/api/auth/logout`            | User logout             | ✅            |
| `GET`  | `/api/auth/google`            | Google OAuth login      | ❌            |
| `GET`  | `/api/auth/facebook`          | Facebook OAuth login    | ❌            |
| `GET`  | `/api/auth/google/callback`   | Google OAuth callback   | ❌            |
| `GET`  | `/api/auth/facebook/callback` | Facebook OAuth callback | ❌            |

### User Management Endpoints

| Method   | Endpoint             | Description         | Auth Required |
| -------- | -------------------- | ------------------- | ------------- |
| `GET`    | `/api/user/profile`  | Get user profile    | ✅            |
| `PATCH`  | `/api/user/update`   | Update user profile | ✅            |
| `PATCH`  | `/api/user/password` | Change password     | ✅            |
| `DELETE` | `/api/user/account`  | Delete user account | ✅            |

### Chat Management Endpoints

| Method   | Endpoint                | Description                 | Auth Required |
| -------- | ----------------------- | --------------------------- | ------------- |
| `GET`    | `/api/chat`             | Get all user chats          | ✅            |
| `POST`   | `/api/chat`             | Create chat or send message | ✅            |
| `GET`    | `/api/chat/:id`         | Get specific chat           | ✅            |
| `PATCH`  | `/api/chat/:id`         | Update chat title           | ✅            |
| `DELETE` | `/api/chat/:id`         | Delete chat                 | ✅            |
| `POST`   | `/api/chat/:id/share`   | Share chat publicly         | ✅            |
| `POST`   | `/api/chat/:id/unshare` | Unshare chat                | ✅            |

### System Endpoints

| Method | Endpoint      | Description  | Auth Required |
| ------ | ------------- | ------------ | ------------- |
| `GET`  | `/api/health` | Health check | ❌            |

## 🎯 Key Features Breakdown

### 🔒 **Persistent Authentication System**

1. **HttpOnly Cookie Security**: Tokens stored securely on server-side, immune to XSS attacks
2. **Cross-Tab Synchronization**: Login/logout events automatically sync across all browser tabs
3. **Session Persistence**: Maintains authentication across browser restarts and tab reloads
4. **Automatic Token Refresh**: Background session renewal with zero user interruption
5. **Fallback Token Support**: LocalStorage backup for environments without cookie support
6. **Remember Me Functionality**: Extended 30-day sessions for user convenience

### 🎤 **Advanced Voice Chat System**

1. **Complete Voice Conversations**: Full hands-free interaction with AI
2. **Real-time Speech Recognition**: Instant voice-to-text with Web Speech API
3. **Streaming Audio Playback**: AI responses play as they're generated
4. **Voice State Management**: Visual feedback for listening, processing, and speaking states
5. **Intelligent Audio Control**: Stop/start voice interactions seamlessly
6. **Multi-language Support**: Optimized for English with premium voice selection

### 💬 **Enhanced AI Chat Experience**

1. **Detailed Response Configuration**: System prompts optimized for comprehensive answers
2. **Multiple AI Models**: GPT-4o-mini, Claude-3-haiku, Claude-3.5-Sonnet fallbacks
3. **Increased Token Limits**: Up to 2000 tokens for detailed, educational responses
4. **Smart Error Handling**: Automatic model fallbacks and retry mechanisms
5. **Real-time Streaming**: Live message updates as AI generates responses

### 📱 **Mobile App Features**

1. **Native App Experience**: Full-featured iOS and Android apps via Capacitor
2. **Deep Link Support**: Custom URL scheme (aibondhu://) for OAuth callbacks
3. **Native Mobile UI**: Touch-optimized interface with mobile gestures
4. **Offline Capability**: Progressive Web App features for offline access
5. **Push Notifications**: (Ready for implementation)
6. **Mobile Performance**: Optimized for mobile hardware and networks

### 🎨 **UI/UX Features**

1. **Deep-Space Theme**: Consistent #030637 background with neon accent colors
2. **Glassmorphism Design**: Modern frosted glass effects with backdrop blur
3. **Voice Chat Interface**: Dedicated full-screen mode for voice interactions
4. **Modular Components**: Separated landing page into reusable components
5. **Integrated Dashboard**: Settings panel slides seamlessly within the main interface
6. **Enhanced Form Controls**: Input fields with hover, focus, and shadow states
7. **Responsive Layout**: Mobile-first design with optimized breakpoints
8. **Interactive Elements**: Smooth transitions and micro-animations
9. **Accessibility**: Proper ARIA labels and keyboard navigation support
10. **Cross-Platform Consistency**: Unified experience across web and mobile

### 🛡️ **Security Measures**

1. **HttpOnly Cookie Protection**: Secure token storage immune to XSS attacks
2. **Cross-Tab Security**: Synchronized authentication state across tabs
3. **Input Validation**: Zod schema validation for all API endpoints
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **CORS Protection**: Configurable origin restrictions with credentials support
6. **Password Security**: bcryptjs hashing with salt rounds
7. **JWT Security**: Secure token generation with configurable expiration
8. **Session Management**: Automatic cleanup and secure logout processes

## 🚀 Production Deployment

### **Backend Deployment (Vercel)**

1. **Prepare for deployment**

   ```bash
   npm run build
   ```

2. **Environment Variables**

   - Set `NODE_ENV=production`
   - Use MongoDB Atlas for database
   - Generate secure JWT secrets (64+ characters)
   - Add OpenRouter API key
   - Configure CORS for your domain
   - Set secure cookie settings

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

### **Frontend Deployment (Vercel)**

1. **Build for production**

   ```bash
   npm run build
   ```

2. **Configure environment**

   - Set `VITE_API_BASE_URL` to your backend URL

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

### **Mobile App Deployment**

#### **Android App (Google Play Store)**

1. **Generate signed APK**

   ```bash
   cd frontend
   npm run build
   npx cap sync android
   npx cap open android
   # Build signed APK in Android Studio
   ```

2. **Configuration**
   - Update `capacitor.config.ts` with production API URL
   - Configure app signing in Android Studio
   - Generate upload key for Play Store

#### **iOS App (Apple App Store)**

1. **Build for iOS**

   ```bash
   cd frontend
   npm run build
   npx cap sync ios
   npx cap open ios
   # Build and archive in Xcode
   ```

2. **Configuration**
   - Configure App Store Connect
   - Set up provisioning profiles
   - Configure Info.plist for OAuth redirects
     vercel --prod

### **Alternative Deployment Options**

- **Backend**: Railway, Render, Heroku, DigitalOcean, AWS Lambda
- **Frontend**: Netlify, Vercel, GitHub Pages, AWS S3, Firebase Hosting
- **Database**: MongoDB Atlas, AWS DocumentDB, Azure Cosmos DB
- **Mobile Apps**: Google Play Store, Apple App Store, F-Droid (Android)

## 🔧 Configuration Options

### **AI Response Enhancement**

The app is configured to provide detailed, comprehensive responses:

```typescript
// In backend/src/chat/chat.service.ts
max_tokens: model.includes(':free') ? 800 : 2000, // Increased for detailed responses
temperature: 0.7,
top_p: 0.95,
frequency_penalty: 0.1,
presence_penalty: 0.1,

// Enhanced system prompt for comprehensive responses
RESPONSE_QUALITY_RULES: {
  "Always provide COMPREHENSIVE, DETAILED, and IN-DEPTH responses",
  "Break down complex topics step-by-step with detailed explanations",
  "Include practical examples, code implementations with comments",
  "Structure responses with clear headings and formatting"
}
```

### **OpenRouter API Models**

The app supports multiple AI models with automatic fallbacks:

```typescript
// In backend/src/chat/chat.service.ts
const models = [
  "openai/gpt-4o-mini", // Fast and reliable OpenAI model
  "anthropic/claude-3-haiku", // Fast premium model
  "openai/gpt-3.5-turbo", // Popular OpenAI model
  "anthropic/claude-3.5-sonnet", // Premium model - detailed responses
  "google/gemma-2-9b-it:free", // Free fallback
  "microsoft/phi-3-mini-128k-instruct:free", // Free fallback
];
```

### **Persistent Authentication Configuration**

```typescript
// HttpOnly Cookie Settings
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 30 days or 7 days
  path: "/",
};

// Cross-tab synchronization
localStorage.setItem("auth_event", "login"); // Triggers cross-tab sync
```

### **Voice Chat Configuration**

```typescript
// Voice recognition settings
recognition.continuous = true; // Keep listening continuously
recognition.interimResults = true; // Show interim results
recognition.lang = "en-US"; // Language setting
recognition.maxAlternatives = 1; // Number of alternatives

// Speech synthesis settings
utterance.rate = 0.9; // Speech rate
utterance.pitch = 1.0; // Voice pitch
utterance.volume = 1.0; // Audio volume
utterance.lang = "en-US"; // Speech language
```

### **Mobile App Configuration**

```typescript
// In capacitor.config.ts
const config: CapacitorConfig = {
  appId: "com.aibondhu.chat",
  appName: "AI Bondhu",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#030637",
      spinnerColor: "#00f5ff",
    },
  },
};
```

## 🧪 Testing

### **Manual Testing Checklist**

1. **Persistent Authentication**

   - [ ] User registration with email validation
   - [ ] User login with credential verification and Remember Me
   - [ ] HttpOnly cookie authentication persistence
   - [ ] Cross-tab login/logout synchronization
   - [ ] Session persistence across browser restarts
   - [ ] Automatic token refresh functionality
   - [ ] Protected route access and redirection

2. **Voice Chat Functionality**

   - [ ] Voice-to-text recognition accuracy
   - [ ] Text-to-speech audio playback
   - [ ] Voice state management (idle, listening, processing, speaking)
   - [ ] Manual stop/start voice interactions
   - [ ] Voice mode toggle functionality
   - [ ] Audio streaming during AI response generation

3. **Enhanced AI Chat**

   - [ ] Detailed, comprehensive AI responses
   - [ ] Multiple AI model fallbacks
   - [ ] Real-time message streaming
   - [ ] Error handling and retry mechanisms
   - [ ] Chat history persistence and retrieval

4. **Mobile App Features**

   - [ ] Android APK installation and functionality
   - [ ] iOS app installation and functionality
   - [ ] OAuth deep link handling
   - [ ] Mobile-optimized UI interactions
   - [ ] Voice features on mobile devices

5. **Chat Management**

   - [ ] Create new chat conversation
   - [ ] Send messages and receive AI responses
   - [ ] Edit chat titles
   - [ ] Delete chat conversations
   - [ ] Share/unshare chats publicly

6. **User Management**

   - [ ] View user profile information
   - [ ] Update profile information
   - [ ] Change password securely
   - [ ] Delete user account completely

7. **UI/UX Features**
   - [ ] Responsive design across all devices
   - [ ] Settings panel integration and functionality
   - [ ] Form validation and user feedback
   - [ ] Deep-space theme consistency
   - [ ] Voice chat interface usability
   - [ ] Cross-platform consistency (web/mobile)

## 🛠️ Troubleshooting

### **Common Issues**

1. **HttpOnly Cookie Authentication Error**

   ```
   Solution: Ensure withCredentials: true in axios config and CORS credentials enabled
   ```

2. **Cross-Tab Synchronization Not Working**

   ```
   Solution: Check localStorage events and authEventEmitter implementation
   ```

3. **Voice Chat Not Working**

   ```
   Solution: Check microphone permissions and Web Speech API browser support
   ```

4. **Mobile OAuth Redirects Failing**

   ```
   Solution: Configure proper deep link URL scheme (aibondhu://) in mobile app
   ```

5. **MongoDB Connection Error**

   ```
   Solution: Check MONGO_URI in .env and ensure MongoDB is running
   ```

6. **OpenRouter API Error**

   ```
   Solution: Verify OPENROUTER_API_KEY and check your account credits
   ```

7. **CORS Error**

   ```
   Solution: Update CLIENT_URL in backend .env to match frontend URL
   ```

8. **Token Expiration**

   ```
   Solution: The app automatically handles token refresh, clear localStorage if issues persist
   ```

9. **Build Errors**

   ```
   Solution: Delete node_modules and package-lock.json, then npm install
   ```

10. **Mobile App Build Issues**
    ```
    Solution: Ensure Android Studio/Xcode properly configured, sync Capacitor: npx cap sync
    ```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**

   ```bash
   git fork https://github.com/reduanahmadswe/private-gpt-chat-app.git
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**

   - Follow the existing code style and patterns
   - Add TypeScript types for new features
   - Update documentation as needed

4. **Test your changes**

   - Ensure both frontend and backend build successfully
   - Test all affected functionality manually

5. **Commit and push**

   ```bash
   git commit -m 'Add amazing feature'
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description of changes
   - Include screenshots for UI changes
   - Reference any related issues

### **Development Guidelines**

- **Code Style**: Follow existing TypeScript and React patterns
- **Commits**: Use conventional commit messages
- **Testing**: Manually test all changes including voice features and mobile functionality
- **Documentation**: Update README.md for new features
- **Mobile Compatibility**: Test changes on both web and mobile platforms
- **Voice Features**: Ensure voice chat functionality works across different browsers
- **Authentication**: Test persistent login and cross-tab synchronization

### **Feature Request Guidelines**

When requesting new features, please consider:

- **Voice Enhancement**: Improvements to speech recognition accuracy
- **Mobile Features**: Native mobile functionality requests
- **AI Capabilities**: Enhanced AI model integration
- **Security Features**: Additional authentication and security measures
- **UI/UX Improvements**: Design and usability enhancements
- **Accessibility**: Features for users with disabilities

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### **Technologies & Libraries**

- [OpenRouter](https://openrouter.ai/) - AI API gateway with multiple model access
- [Anthropic](https://www.anthropic.com/) - Claude AI models for intelligent conversations
- [OpenAI](https://openai.com/) - GPT models for chat functionality
- [React](https://reactjs.org/) - Frontend framework with hooks and context
- [Node.js](https://nodejs.org/) - Backend runtime environment
- [MongoDB](https://www.mongodb.com/) - NoSQL database solution
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Vite](https://vitejs.dev/) - Build tool and development server
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development
- [Capacitor](https://capacitorjs.com/) - Cross-platform mobile app framework
- [Passport.js](http://www.passportjs.org/) - Authentication middleware
- [Axios](https://axios-http.com/) - HTTP client with interceptors
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Voice recognition and synthesis

### **Design Inspiration**

- Glassmorphism design trends and modern UI patterns
- Voice-first interface design principles
- Cross-platform consistency guidelines
- Mobile-first responsive design approaches
- Accessibility-focused user experience design
- Progressive Web App (PWA) best practices

## 📞 Support & Community

### **Getting Help**

1. **Documentation**: Check this comprehensive README and inline code comments
2. **Issues**: [GitHub Issues](https://github.com/reduanahmadswe/private-gpt-chat-app/issues)
3. **Discussions**: [GitHub Discussions](https://github.com/reduanahmadswe/private-gpt-chat-app/discussions)
4. **Voice Chat Support**: Check Web Speech API browser compatibility
5. **Mobile App Help**: Capacitor documentation and native platform guides

### **Reporting Issues**

When reporting issues, please include:

- Operating system and Node.js version
- Browser type and version (for voice chat issues)
- Mobile device type (for mobile app issues)
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots or screen recordings (for UI issues)
- Console logs or error messages
- Voice chat specific: microphone permissions and browser support

### **Feature Requests**

We'd love to hear your ideas! Please:

- Check existing issues first
- Provide detailed use cases
- Explain the expected behavior
- Consider the impact on existing users
- For voice features: specify browser/platform requirements
- For mobile features: indicate target platforms (iOS/Android)

---

<div align="center">

**Built with ❤️ by [Reduan Ahmad](https://github.com/reduanahmadswe)**

🌟 **Star this repo if you find it helpful!** 🌟

**📱 Experience the future of AI conversation with persistent authentication, advanced voice chat, and cross-platform mobile support!**

[🐛 Report Bug](https://github.com/reduanahmadswe/private-gpt-chat-app/issues) • [✨ Request Feature](https://github.com/reduanahmadswe/private-gpt-chat-app/issues) • [📖 Documentation](https://github.com/reduanahmadswe/private-gpt-chat-app/wiki) • [📱 Download APK](https://github.com/reduanahmadswe/private-gpt-chat-app/releases)

**🌐 Live Demo**: [https://ai-bondhu-tau.vercel.app/](https://aibondhu.vercel.app)

</div>
