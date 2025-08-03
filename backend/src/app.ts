import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import session from 'express-session'
import { envVars } from './config/env'
import passport from './config/passport'
import { authenticate } from './shared/middleware/auth'
import { errorHandler, notFound } from './shared/middleware/errorHandler'

// Route imports
import authRoutes from './auth/auth.routes'
import chatRoutes from './chat/chat.routes'
import userRoutes from './user/user.routes'
import { TestController } from './chat/test.controller'

const app = express()

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 10000 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
// })

// // Middleware
// app.use(limiter)

// CORS Configuration
const allowedOrigins = [
  envVars.FRONTEND_URL,
  envVars.CLIENT_URL,
  'https://ai-bondhu-tau.vercel.app',
  'https://aibondhuai.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
}));
app.options('*', cors());

// Session configuration for passport
app.use(session({
  secret: envVars.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: envVars.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Private AI Bondhu API is running',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: envVars.NODE_ENV,
    version: '1.0.0',
    cors: {
      frontend_url: envVars.FRONTEND_URL,
      client_url: envVars.CLIENT_URL,
      allowed_origins: [
        envVars.FRONTEND_URL,
        envVars.CLIENT_URL,
        'https://ai-bondhu-tau.vercel.app',
        'https://aibondhuai.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173'
      ]
    }
  })
})

// Test endpoint for debugging
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly',
    headers: req.headers,
    origin: req.get('origin'),
    method: req.method
  })
})

// CORS test endpoint
app.all('/api/cors-test', (req, res) => {
  res.json({
    success: true,
    message: 'CORS test successful',
    method: req.method,
    origin: req.get('origin'),
    headers: req.headers,
    allowedOrigins: [envVars.FRONTEND_URL, envVars.CLIENT_URL]
  })
})

// OpenRouter API test endpoint
const testController = new TestController()
app.get('/api/test-openrouter', testController.testOpenRouter.bind(testController))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', authenticate, userRoutes)
app.use('/api/chat', authenticate, chatRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// 404 handler for any remaining routes
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  })
})

export default app
