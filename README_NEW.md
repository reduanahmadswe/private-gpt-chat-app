# 🤖 Private GPT Chat Application

A modern, full-stack AI chat application built with React, Node.js, and TypeScript. Features secure user authentication, intelligent AI conversations powered by OpenRouter API (Claude 3.5 Sonnet), and a stunning deep-space themed UI with glassmorphism effects.

![Private GPT Chat](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3.0-blue)

## ✨ Features

### 🔐 **Secure Authentication System**

- JWT-based authentication with access and refresh tokens
- Password hashing with bcryptjs
- Session management with automatic token refresh
- Protected routes with authentication middleware

### 💬 **AI-Powered Conversations**

- Integration with OpenRouter API using Claude 3.5 Sonnet model
- Real-time chat interface with message history
- Context-aware AI responses with configurable parameters
- Error handling and retry logic for API calls

### 🎨 **Modern UI/UX Design**

- **Deep-Space Theme**: Stunning #030637 background with neon cyan (#00f5ff) and purple (#9d4edd) accents
- **Glassmorphism Effects**: Frosted glass components with backdrop blur and transparency
- **Responsive Dashboard**: Integrated sidebar with sliding settings panel and profile management
- **Modular Landing Page**: Separated into Header, Hero, Features, CTA, Contact, and Footer components
- **Enhanced Input Fields**: Hover effects, focus states, and shadow animations
- **Mobile-First Design**: Optimized for all screen sizes with responsive breakpoints
- **Custom Tailwind Components**: Extended color palette and custom animations

### 🗂️ **Advanced Chat Management**

- **Integrated Chat Interface**: Inline input area with real-time message display
- **Persistent Conversations**: MongoDB storage with complete message history
- **Chat Operations**: Create, edit, rename, and delete chat conversations
- **Public Sharing**: Share chat conversations with public links
- **Real-time Updates**: Instant message status indicators and responses
- **Message Management**: Full CRUD operations for chat messages

### 👤 **Advanced User Management**

- **Integrated Settings Panel**: Profile and password management within the dashboard
- **Tabbed Interface**: Seamless switching between account and password settings
- **Real-time Validation**: Form validation with instant feedback
- **Profile Updates**: Name and email modification with proper validation
- **Secure Password Changes**: Current password verification with new password confirmation
- **Account Management**: Complete user profile control and data management

### 🛡️ **Security & Performance**

- Rate limiting to prevent API abuse (100 requests per 15 minutes)
- CORS protection with configurable origins
- Input validation using Zod schemas
- Comprehensive error handling and logging
- Request/response interceptors for token management

## 🛠️ Tech Stack

### **Frontend**

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast development and build tool
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **React Router** - Client-side routing with protected routes
- **Axios** - HTTP client with interceptors for authentication
- **React Hot Toast** - Beautiful toast notifications
- **Lucide React** - Modern icon library

### **Backend**

- **Node.js** with **Express.js** - RESTful API server
- **TypeScript** - Type-safe backend development
- **MongoDB** with **Mongoose ODM** - NoSQL database with schema validation
- **JWT** - JSON Web Tokens for authentication
- **Zod** - Runtime type validation and parsing
- **bcryptjs** - Password hashing and verification
- **express-rate-limit** - Rate limiting middleware
- **CORS** - Cross-origin resource sharing configuration

### **AI Integration**

- **OpenRouter API** - Access to multiple AI models
- **Claude 3.5 Sonnet** - Advanced AI model by Anthropic
- **Fetch API** - Modern HTTP requests for AI integration

### **Development Tools**

- **ESLint** - Code linting and formatting
- **Nodemon** - Development server with auto-reload
- **VS Code Tasks** - Integrated development workflow

### **Design System**

- **Color Palette**: Deep-space primary (#030637) with neon accents
  - Primary Background: `#030637` (Deep Space Blue)
  - Accent Colors: `#00f5ff` (Cyan), `#9d4edd` (Purple), `#40e0d0` (Turquoise)
  - Glass Effects: Backdrop blur with rgba transparency
- **Typography**: Clean, modern font stack with proper hierarchy
- **Component Architecture**: Modular, reusable components with consistent theming
- **Responsive Breakpoints**: Mobile-first approach with Tailwind CSS utilities

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **OpenRouter API Account** (get your key from [OpenRouter](https://openrouter.ai/keys))

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
```

### Frontend Configuration

Create a `.env` file in the `frontend` directory (optional):

```env
# For production deployment
VITE_API_BASE_URL=https://your-backend-domain.com
```

## 📁 Project Structure

```
private-gpt-chat-app/
├── 📁 backend/                    # Express.js backend server
│   ├── 📁 src/
│   │   ├── 📁 auth/               # Authentication module
│   │   │   ├── auth.controller.ts # Auth request handlers
│   │   │   ├── auth.interface.ts  # Auth type definitions
│   │   │   ├── auth.routes.ts     # Auth API routes
│   │   │   ├── auth.service.ts    # Auth business logic
│   │   │   └── auth.validation.ts # Auth input validation
│   │   ├── 📁 user/               # User management module
│   │   │   ├── user.controller.ts # User request handlers
│   │   │   ├── user.interface.ts  # User type definitions
│   │   │   ├── user.model.ts      # MongoDB user schema
│   │   │   ├── user.routes.ts     # User API routes
│   │   │   ├── user.service.ts    # User business logic
│   │   │   └── user.validation.ts # User input validation
│   │   ├── 📁 chat/               # Chat functionality module
│   │   │   ├── chat.controller.ts # Chat request handlers
│   │   │   ├── chat.interface.ts  # Chat type definitions
│   │   │   ├── chat.model.ts      # MongoDB chat schema
│   │   │   ├── chat.routes.ts     # Chat API routes
│   │   │   ├── chat.service.ts    # AI integration & chat logic
│   │   │   └── chat.validation.ts # Chat input validation
│   │   ├── 📁 shared/             # Shared utilities and middleware
│   │   │   ├── 📁 middleware/
│   │   │   │   ├── auth.ts        # JWT authentication middleware
│   │   │   │   ├── errorHandler.ts# Error handling middleware
│   │   │   │   └── validation.ts  # Zod validation middleware
│   │   │   └── database.ts        # MongoDB connection setup
│   │   └── app.ts                 # Express app configuration
│   ├── 📄 .env.example           # Environment template
│   ├── 📄 .gitignore             # Git ignore rules
│   ├── 📄 nodemon.json           # Nodemon configuration
│   ├── 📄 package.json           # Dependencies and scripts
│   ├── 📄 tsconfig.json          # TypeScript configuration
│   └── 📄 vercel.json            # Vercel deployment config
├── 📁 frontend/                   # React frontend application
│   ├── 📁 src/
│   │   ├── 📁 components/         # Reusable React components
│   │   │   ├── 📁 landing/        # Landing page components
│   │   │   │   ├── Header.tsx     # Navigation header component
│   │   │   │   ├── Hero.tsx       # Hero section with main CTA
│   │   │   │   ├── Features.tsx   # Features showcase section
│   │   │   │   ├── CallToAction.tsx # Secondary CTA section
│   │   │   │   ├── Contact.tsx    # Contact information section
│   │   │   │   └── Footer.tsx     # Footer with links and info
│   │   │   ├── LoadingSpinner.tsx # Loading indicator component
│   │   │   └── ProtectedRoute.tsx # Route protection component
│   │   ├── 📁 contexts/           # React context providers
│   │   │   └── AuthContext.tsx    # Authentication state management
│   │   ├── 📁 pages/              # Page components
│   │   │   ├── 📁 auth/           # Authentication pages
│   │   │   │   ├── SignIn.tsx     # Login page with deep-space theme
│   │   │   │   └── SignUp.tsx     # Registration page with enhanced styling
│   │   │   ├── ChatView.tsx       # Individual chat page
│   │   │   ├── Dashboard.tsx      # Main dashboard with integrated settings
│   │   │   ├── LandingPage.tsx    # Modular marketing landing page
│   │   │   └── Settings.tsx       # Standalone user settings page
│   │   ├── 📁 utils/              # Utility functions
│   │   │   └── api.ts             # Axios configuration with interceptors
│   │   ├── App.tsx                # Main app component with routing
│   │   ├── index.css              # Global styles with Tailwind
│   │   └── main.tsx               # React app entry point
│   ├── 📄 .env.example           # Environment template
│   ├── 📄 .gitignore             # Git ignore rules
│   ├── 📄 index.html             # HTML template
│   ├── 📄 package.json           # Dependencies and scripts
│   ├── 📄 postcss.config.js      # PostCSS configuration
│   ├── 📄 tailwind.config.js     # Tailwind CSS configuration
│   ├── 📄 tsconfig.json          # TypeScript configuration
│   ├── 📄 vercel.json            # Vercel deployment config
│   └── 📄 vite.config.ts         # Vite build configuration
├── 📄 .gitignore                 # Root git ignore
└── 📄 README.md                  # Project documentation
```

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
