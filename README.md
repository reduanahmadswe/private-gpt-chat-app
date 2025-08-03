# 🤖 AI Bondhu - Private GPT Chat Application

A comprehensive, full-stack AI chat application built with React, Node.js, and TypeScript. Features secure multi-provider authentication, intelligent AI conversations powered by OpenRouter API (Claude 3.5 Sonnet), text-to-speech capabilities, and a stunning deep-space themed UI with glassmorphism effects.

![Private GPT Chat](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3.0-blue)

## ✨ Features

### 🔐 **Multi-Provider Authentication System**

- **JWT-based Authentication**: Access and refresh tokens with automatic renewal
- **Social OAuth Integration**: Google and Facebook login with Passport.js
- **Local Authentication**: Email/password registration and login
- **Password Security**: bcryptjs hashing with salt rounds
- **Session Management**: Secure HTTP-only cookies with CSRF protection
- **Account Linking**: Link multiple auth providers to single account
- **Protected Routes**: Authentication middleware for API endpoints

### 💬 **Advanced AI-Powered Conversations**

- **OpenRouter API Integration**: Claude 3.5 Sonnet model for intelligent responses
- **Real-time Chat Interface**: Instant message display with typing indicators
- **Context-Aware Responses**: Maintains conversation context across messages
- **Message Persistence**: Complete chat history stored in MongoDB
- **Error Handling**: Robust retry logic and fallback mechanisms
- **Rate Limiting**: API abuse prevention with configurable limits

### 🎤 **Text-to-Speech Features**

- **English TTS Support**: High-quality voice synthesis for AI responses
- **Voice Selection**: Intelligent voice selection with premium voice preferences
- **Audio Controls**: Play/pause/stop functionality for each message
- **Speech Synthesis API**: Browser-native TTS with fallback options
- **Audio Status Indicators**: Visual feedback for playing/stopped states
- **Responsive Audio UI**: Mobile-optimized audio controls

### 🎨 **Modern Glassmorphism UI/UX**

- **Deep-Space Theme**: Stunning #030637 background with neon accents
- **Color Palette**: Cyan (#00f5ff), Purple (#9d4edd), Turquoise (#40e0d0)
- **Glassmorphism Effects**: Backdrop blur with rgba transparency
- **Responsive Dashboard**: Integrated sidebar with sliding settings panel
- **Custom Favicon System**: SVG favicons with AI chat branding
- **Enhanced Input Areas**: Auto-expanding textarea with clear functionality
- **Mobile-First Design**: Optimized for all screen sizes
- **Smooth Animations**: CSS transitions and hover effects throughout

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

- **CORS Protection**: Configurable origins with credentials support
- **Input Validation**: Zod schemas for type-safe API requests
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **SQL Injection Prevention**: MongoDB ODM with parameterized queries
- **XSS Protection**: Content sanitization and CSP headers
- **Authentication Middleware**: Route-level access control
- **Session Security**: Secure cookie settings with SameSite

## 🛠️ Tech Stack

### **Frontend Architecture**

- **React 18** - Modern React with hooks, functional components, and Suspense
- **TypeScript** - Full type safety with strict mode enabled
- **Vite** - Lightning-fast development with hot module replacement
- **Tailwind CSS** - Utility-first CSS with custom design system
- **React Router** - Client-side routing with protected route components
- **Axios** - HTTP client with request/response interceptors
- **React Hot Toast** - Beautiful toast notifications with custom styling
- **Lucide React** - Modern icon library with consistent styling
- **Context API** - State management for authentication and user data

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
- **Claude 3.5 Sonnet** - Advanced AI model by Anthropic for conversations
- **Google OAuth 2.0** - Social authentication with Google accounts
- **Facebook OAuth 2.0** - Social authentication with Facebook accounts
- **Web Speech API** - Browser-native text-to-speech functionality

### **Development & Deployment**

- **ESLint** - Code linting with TypeScript and React configurations
- **Prettier** - Code formatting with consistent style rules
- **Nodemon** - Development server with auto-reload functionality
- **VS Code Tasks** - Integrated development workflow automation
- **Vercel** - Frontend deployment with automatic previews
- **Railway/Heroku** - Backend deployment with environment management

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
│   │   ├── 📁 dashboard/
│   ├── DashboardLayout.tsx     # Main container
│   │   │   ├── 📁 sidebar/
│   │   │   │   ├── Sidebar.tsx     # Left sidebar
│   │   │   ├── 📁 chat/
│   │   │   │   ├── ChatArea.tsx        # Chat container
│   │   │   │   ├── ChatHeader.tsx      # Chat header
│   │   │   │   ├── ChatMessages.tsx    # Messages display
│   │   │   │   ├── ChatInput.tsx       # Input form
│   │   │   ├── 📁 settings/
│   │   │   │   ├── SettingsPanel.tsx   #Settings
│   │   ├── GoogleLoginButton.tsx # Google OAuth integration
│   │   ├── FacebookLoginButton.tsx # Facebook OAuth integration
│   │   ├── LoadingSpinner.tsx   # Reusable loading component
│   │   ├── ProtectedRoute.tsx   # Authentication wrapper
│   │   ├── PublicRoute.tsx      # Public route wrapper
│   │   └── SessionExpiryTest.tsx # Development testing component
│   ├── 📁 hooks/
│   │   ├── useChat.ts              # Chat functionality
│   │   ├── useSpeechSynthesis.ts   # TTS functionality  
│   ├── 📁 contexts/             # React Context providers
│   │   └── AuthContext.tsx      # Authentication state management
│   ├── 📁 pages/                # Page components
│   │   ├── LandingPage.tsx      # Public homepage
│   │   ├── Dashboard.tsx        # Main chat interface with TTS
│   │   ├── ChatView.tsx         # Individual chat view
│   │   ├── Settings.tsx         # User settings panel
│   │   └── 📁 auth/             # Authentication pages
│   │       ├── SignIn.tsx       # Login form with OAuth
│   │       └── SignUp.tsx       # Registration form with OAuth
│   ├── 📁 types/                # TypeScript type definitions
│   │   └── auth.ts              # Authentication interfaces
│   └── 📁 utils/                # Utility functions
│       └── api.ts               # Axios configuration with interceptors
```

### **Backend Structure**

```
backend/
├── 📁 src/
│   ├── 📄 app.ts                # Express app configuration
│   ├── 📄 server.ts             # Server startup and database connection
│   ├── 📁 auth/                 # Authentication module
│   │   ├── auth.controller.ts   # OAuth and JWT controllers
│   │   ├── auth.service.ts      # Authentication business logic
│   │   ├── auth.routes.ts       # Auth route definitions
│   │   ├── auth.interface.ts    # Authentication interfaces
│   │   └── auth.validation.ts   # Zod validation schemas
│   ├── 📁 chat/                 # Chat management module
│   │   ├── chat.controller.ts   # Chat CRUD operations
│   │   ├── chat.service.ts      # AI integration and chat logic
│   │   ├── chat.model.ts        # MongoDB chat schema
│   │   ├── chat.routes.ts       # Chat route definitions
│   │   ├── chat.interface.ts    # Chat type definitions
│   │   └── chat.validation.ts   # Chat validation schemas
│   ├── 📁 user/                 # User management module
│   │   ├── user.controller.ts   # User profile operations
│   │   ├── user.service.ts      # User business logic
│   │   ├── user.model.ts        # MongoDB user schema
│   │   ├── user.routes.ts       # User route definitions
│   │   ├── user.interface.ts    # User interfaces
│   │   └── user.validation.ts   # User validation schemas
│   ├── 📁 config/               # Configuration modules
│   │   ├── env.ts               # Environment variable validation
│   │   ├── passport.ts          # Passport OAuth strategies
│   │   └── database.ts          # MongoDB connection setup
│   ├── 📁 shared/               # Shared utilities
│   │   ├── database.ts          # Database connection utilities
│   │   └── 📁 middleware/       # Express middleware
│   │       ├── auth.ts          # JWT authentication middleware
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

4. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5001`
   - Health Check: `http://localhost:5001/api/health`

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
```

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint            | Description       | Auth Required |
| ------ | ------------------- | ----------------- | ------------- |
| `POST` | `/api/auth/signup`  | Register new user | ❌            |
| `POST` | `/api/auth/signin`  | User login        | ❌            |
| `POST` | `/api/auth/refresh` | Refresh JWT token | ❌            |
| `POST` | `/api/auth/logout`  | User logout       | ❌            |

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

### 🔒 **Authentication Flow**

1. **Registration**: Email validation, password hashing, JWT token generation
2. **Login**: Credential verification, token pair creation (access + refresh)
3. **Session Management**: Automatic token refresh, secure logout
4. **Route Protection**: Middleware-based authentication for protected endpoints

### 💬 **Chat System**

1. **AI Integration**: OpenRouter API with Claude 3.5 Sonnet model
2. **Message Persistence**: MongoDB storage with user association
3. **Real-time Updates**: Instant message display and status updates
4. **Chat Management**: CRUD operations for chat conversations

### 🎨 **UI/UX Features**

1. **Deep-Space Theme**: Consistent #030637 background with neon accent colors
2. **Glassmorphism Design**: Modern frosted glass effects with backdrop blur
3. **Modular Components**: Separated landing page into reusable components
4. **Integrated Dashboard**: Settings panel slides seamlessly within the main interface
5. **Enhanced Form Controls**: Input fields with hover, focus, and shadow states
6. **Responsive Layout**: Mobile-first design with optimized breakpoints
7. **Interactive Elements**: Smooth transitions and micro-animations
8. **Accessibility**: Proper ARIA labels and keyboard navigation support

### 🛡️ **Security Measures**

1. **Input Validation**: Zod schema validation for all API endpoints
2. **Rate Limiting**: 100 requests per 15 minutes per IP
3. **CORS Protection**: Configurable origin restrictions
4. **Password Security**: bcryptjs hashing with salt rounds
5. **JWT Security**: Secure token generation with configurable expiration

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

### **Alternative Deployment Options**

- **Backend**: Railway, Render, Heroku, DigitalOcean
- **Frontend**: Netlify, Vercel, GitHub Pages, AWS S3
- **Database**: MongoDB Atlas, AWS DocumentDB

## 🔧 Configuration Options

### **OpenRouter API Models**

The app currently uses Claude 3.5 Sonnet, but you can easily switch to other models:

```typescript
// In backend/src/chat/chat.service.ts
model: 'anthropic/claude-3.5-sonnet',        // Current
// model: 'openai/gpt-4',                    // GPT-4
// model: 'openai/gpt-3.5-turbo',           // GPT-3.5
// model: 'meta-llama/llama-2-70b-chat',    // Llama 2
```

### **Customizing Rate Limits**

```typescript
// In backend/src/app.ts
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Time window
  max: 100, // Max requests per window
  message: "Rate limit exceeded",
});
```

### **JWT Token Expiration**

```typescript
// In backend/src/auth/auth.service.ts
expiresIn: '1h',     // Access token (1 hour)
expiresIn: '7d',     // Refresh token (7 days)
```

## 🧪 Testing

### **Manual Testing Checklist**

1. **Authentication**

   - [ ] User registration with email validation
   - [ ] User login with credential verification
   - [ ] Token refresh functionality
   - [ ] Protected route access

2. **Chat Functionality**

   - [ ] Create new chat conversation
   - [ ] Send messages and receive AI responses
   - [ ] Edit chat titles
   - [ ] Delete chat conversations
   - [ ] Share/unshare chats

3. **User Management**

   - [ ] View user profile
   - [ ] Update profile information
   - [ ] Change password
   - [ ] Delete account

4. **UI/UX Features**
   - [ ] Responsive design across devices
   - [ ] Settings panel integration
   - [ ] Form validation and feedback
   - [ ] Deep-space theme consistency

## 🛠️ Troubleshooting

### **Common Issues**

1. **MongoDB Connection Error**

   ```
   Solution: Check MONGO_URI in .env and ensure MongoDB is running
   ```

2. **OpenRouter API Error**

   ```
   Solution: Verify OPENROUTER_API_KEY and check your account credits
   ```

3. **CORS Error**

   ```
   Solution: Update CLIENT_URL in backend .env to match frontend URL
   ```

4. **Token Expiration**

   ```
   Solution: The app automatically handles token refresh, clear localStorage if issues persist
   ```

5. **Build Errors**
   ```
   Solution: Delete node_modules and package-lock.json, then npm install
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
- **Testing**: Manually test all changes before submitting
- **Documentation**: Update README.md for new features

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### **Technologies & Libraries**

- [OpenRouter](https://openrouter.ai/) - AI API gateway with multiple model access
- [Anthropic](https://www.anthropic.com/) - Claude 3.5 Sonnet AI model
- [React](https://reactjs.org/) - Frontend framework
- [Node.js](https://nodejs.org/) - Backend runtime
- [MongoDB](https://www.mongodb.com/) - Database solution
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vite](https://vitejs.dev/) - Build tool and development server
- [TypeScript](https://www.typescriptlang.org/) - Type-safe development

### **Design Inspiration**

- Glassmorphism design trends
- Modern AI chat interfaces
- Progressive web app principles

## 📞 Support & Community

### **Getting Help**

1. **Documentation**: Check this README and inline code comments
2. **Issues**: [GitHub Issues](https://github.com/reduanahmadswe/private-gpt-chat-app/issues)
3. **Discussions**: [GitHub Discussions](https://github.com/reduanahmadswe/private-gpt-chat-app/discussions)

### **Reporting Issues**

When reporting issues, please include:

- Operating system and Node.js version
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (for UI issues)
- Console logs or error messages

### **Feature Requests**

We'd love to hear your ideas! Please:

- Check existing issues first
- Provide detailed use cases
- Explain the expected behavior
- Consider the impact on existing users

---

<div align="center">

**Built with ❤️ by [Reduan Ahmad](https://github.com/reduanahmadswe)**

⭐ **Star this repo if you find it helpful!** ⭐

[🐛 Report Bug](https://github.com/reduanahmadswe/private-gpt-chat-app/issues) • [✨ Request Feature](https://github.com/reduanahmadswe/private-gpt-chat-app/issues) • [📖 Documentation](https://github.com/reduanahmadswe/private-gpt-chat-app/wiki)

</div>
