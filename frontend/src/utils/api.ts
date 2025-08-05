import axios from 'axios'
import { navigateInternal } from './navigation'

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'

console.log('🔗 API Base URL:', API_BASE_URL)

// Simple event emitter for auth events
class AuthEventEmitter {
    private listeners: { [event: string]: Array<() => void> } = {}

    on(event: string, callback: () => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = []
        }
        this.listeners[event].push(callback)
    }

    off(event: string, callback: () => void) {
        if (!this.listeners[event]) return
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback)
    }

    emit(event: string) {
        if (!this.listeners[event]) return
        this.listeners[event].forEach(callback => callback())
    }
}

export const authEventEmitter = new AuthEventEmitter()

// Guard to prevent multiple session expiry handlers
let isHandlingSessionExpiry = false

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

// Response interceptor to handle token expiration and auto-refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Improved error logging
        const errorMessage = error.response?.data?.message ||
            error.response?.statusText ||
            error.message ||
            'Unknown API error'

        const errorStatus = error.response?.status || 'No status'

        console.error(`❌ API Error [${errorStatus}]:`, errorMessage)

        if (error.response?.status === 401 && !originalRequest._retry) {
            // Only handle as session expiry if there was actually a token (meaning user was logged in)
            const hadToken = localStorage.getItem('token') || error.config.headers?.Authorization
            const refreshToken = localStorage.getItem('refreshToken')

            // If this is a token refresh request that failed, don't retry
            if (originalRequest.url?.includes('/auth/refresh')) {
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                authEventEmitter.emit('sessionExpired')
                return Promise.reject(error)
            }

            // Try to refresh token if we have one
            if (hadToken && refreshToken && !isHandlingSessionExpiry) {
                originalRequest._retry = true
                isHandlingSessionExpiry = true

                try {
                    console.log('🔄 Access token expired, attempting refresh...')
                    const refreshResponse = await api.post('/api/auth/refresh', {
                        refreshToken
                    })

                    const newToken = refreshResponse.data.token
                    localStorage.setItem('token', newToken)

                    // Update the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${newToken}`

                    console.log('✅ Token refreshed successfully, retrying original request')
                    isHandlingSessionExpiry = false

                    // Retry the original request
                    return api(originalRequest)
                } catch (refreshError) {
                    console.error('❌ Token refresh failed:', refreshError)
                    localStorage.removeItem('token')
                    localStorage.removeItem('refreshToken')
                    authEventEmitter.emit('sessionExpired')
                    isHandlingSessionExpiry = false
                    return Promise.reject(refreshError)
                }
            }

            // If no refresh token or hadToken is false, handle as normal session expiry
            if (hadToken) {
                // Set flag to prevent multiple executions
                isHandlingSessionExpiry = true
                console.log('🚫 401 Unauthorized - handling session expiry')

                // Clear local storage immediately
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                sessionStorage.clear()

                // Emit session expired event to notify AuthContext
                authEventEmitter.emit('sessionExpired')

                // Redirect to signin after a brief delay if not already on auth pages
                setTimeout(() => {
                    if (!window.location.pathname.includes('/auth/')) {
                        navigateInternal('/auth/signin')
                    }
                    // Reset the flag after redirect
                    setTimeout(() => {
                        isHandlingSessionExpiry = false
                    }, 1000)
                }, 1500)
            } else {
                // This is just a normal 401 (user not logged in), not a session expiry
                console.log('🔓 401 Unauthorized - user not authenticated (normal)')
            }

        } else if (error.response?.data?.message) {
            // Show backend error message
            console.error('Backend error:', error.response.data.message)
        }
        return Promise.reject(error)
    }
)

export { api }
export default api
