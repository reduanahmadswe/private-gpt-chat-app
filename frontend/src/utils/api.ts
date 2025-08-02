import axios from 'axios'
import toast from 'react-hot-toast'

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'

console.log('🔗 API Base URL:', API_BASE_URL)

// Create axios instance with interceptors
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
})

// Request interceptor to add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('❌ API Error:', error.response?.data || error.message)
        if (error.response?.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem('token')
            window.location.href = '/auth/signin'
            toast.error('Session expired. Please sign in again.')
        } else if (error.response?.data?.message) {
            // Show backend error message
            console.error('Backend error:', error.response.data.message)
        }
        return Promise.reject(error)
    }
)

export default api
