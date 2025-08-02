import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import rateLimit from 'express-rate-limit'
import connectDB from './shared/database'
import { authenticate } from './shared/middleware/auth'
import { errorHandler, notFound } from './shared/middleware/errorHandler'

// Route imports
import authRoutes from './auth/auth.routes'
import chatRoutes from './chat/chat.routes'
import userRoutes from './user/user.routes'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})

// Middleware
app.use(limiter)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/user', authenticate, userRoutes)
app.use('/api/chat', authenticate, chatRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start server
const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📝 Environment: ${process.env.NODE_ENV}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app
