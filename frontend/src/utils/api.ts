import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance with interceptors
const api = axios.create()

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
        if (error.response?.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem('token')
            window.location.href = '/auth/signin'
            toast.error('Session expired. Please sign in again.')
        }
        return Promise.reject(error)
    }
)

export default api
