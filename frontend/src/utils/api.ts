import axios from 'axios'
import { navigateInternal } from './navigation'

// Get API base URL from environment variables and ensure no trailing slash
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001').replace(/\/$/, '')

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

// Session management utilities for HttpOnly cookie-based auth
export const sessionManager = {
    isRefreshing: false,
    refreshPromise: null as Promise<boolean> | null,

    // For HttpOnly cookies, we can't directly access tokens from JS
    // We'll rely on the backend to include them in requests automatically
    async verifySession(): Promise<boolean> {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
                withCredentials: true // Essential for HttpOnly cookies
            });
            return response.data.success;
        } catch (error) {
            return false;
        }
    },

    async getCurrentUser(): Promise<any> {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
                withCredentials: true
            });
            return response.data.user;
        } catch (error) {
            throw error;
        }
    },

    // For fallback localStorage support (when cookies aren't available)
    getFallbackToken(): string | null {
        return localStorage.getItem('token') || sessionStorage.getItem('token')
    },
    getFallbackRefreshToken(): string | null {
        return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken')
    },

    setFallbackTokens(token: string, refreshToken: string, rememberMe = false): void {
        const storage = rememberMe ? localStorage : sessionStorage
        storage.setItem('token', token)
        storage.setItem('refreshToken', refreshToken)

        // Set expiry times
        const tokenExpiry = new Date()
        tokenExpiry.setDate(tokenExpiry.getDate() + 7)
        storage.setItem('tokenExpiry', tokenExpiry.toISOString())

        const refreshExpiry = new Date()
        refreshExpiry.setDate(refreshExpiry.getDate() + 30)
        storage.setItem('refreshTokenExpiry', refreshExpiry.toISOString())
    },

    clearFallbackTokens(): void {
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('tokenExpiry')
        localStorage.removeItem('refreshTokenExpiry')
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('refreshToken')
        sessionStorage.removeItem('tokenExpiry')
        sessionStorage.removeItem('refreshTokenExpiry')
    },

    async refreshAccessToken(): Promise<boolean> {
        if (this.isRefreshing && this.refreshPromise) {
            return this.refreshPromise;
        }

        this.isRefreshing = true
        this.refreshPromise = this._performRefresh()

        try {
            const success = await this.refreshPromise
            this.isRefreshing = false
            this.refreshPromise = null
            return success
        } catch (error) {
            this.isRefreshing = false
            this.refreshPromise = null
            throw error
        }
    },

    async _performRefresh(): Promise<boolean> {
        try {
            // If cookies are not available (e.g. certain mobile/web environments),
            // fall back to sending the stored refresh token in the request body.
            const fallbackRefresh = this.getFallbackRefreshToken()
            const body = fallbackRefresh ? { refreshToken: fallbackRefresh } : {}

            const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, body, {
                withCredentials: true // This will send HttpOnly cookies when available
            })

            // If server returned a new access token and we're using fallback tokens,
            // update the fallback access token so subsequent requests can use it.
            if (response.data?.token && fallbackRefresh) {
                // Keep the same refresh token in storage but update access token
                this.setFallbackTokens(response.data.token, fallbackRefresh, true)
            }

            return response.data.success
        } catch (error) {
            console.error('🔄 Token refresh failed:', error)
            authEventEmitter.emit('logout')
            throw error
        }
    },

    async logout(): Promise<void> {
        try {
            await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
                withCredentials: true
            })
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            // Clear any fallback tokens
            this.clearFallbackTokens()
            authEventEmitter.emit('logout')
        }
    }
}// Guard to prevent multiple session expiry handlers
let isHandlingSessionExpiry = false

// Create axios instance with interceptors
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Essential for HttpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    }
})

// Request interceptor for fallback token support only
api.interceptors.request.use(
    (config) => {
        // For fallback support when cookies aren't available
        const fallbackToken = sessionManager.getFallbackToken()

        if (fallbackToken && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${fallbackToken}`
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
            // If this is a token refresh request that failed, don't retry
            if (originalRequest.url?.includes('/auth/refresh')) {
                sessionManager.clearFallbackTokens()
                authEventEmitter.emit('sessionExpired')
                return Promise.reject(error)
            }

            // Try to refresh session using HttpOnly cookies
            if (!isHandlingSessionExpiry) {
                originalRequest._retry = true
                isHandlingSessionExpiry = true

                try {
                    console.log('🔄 Access token expired, attempting refresh...')
                    const refreshSuccess = await sessionManager.refreshAccessToken()

                    if (refreshSuccess) {
                        console.log('✅ Session refreshed successfully, retrying original request')
                        isHandlingSessionExpiry = false

                        // Retry the original request
                        return api(originalRequest)
                    } else {
                        throw new Error('Session refresh failed')
                    }
                } catch (refreshError) {
                    console.error('❌ Session refresh failed:', refreshError)
                    sessionManager.clearFallbackTokens()
                    authEventEmitter.emit('sessionExpired')
                    isHandlingSessionExpiry = false
                    return Promise.reject(refreshError)
                }
            }

            // Handle session expiry
            if (!isHandlingSessionExpiry) {
                isHandlingSessionExpiry = true
                console.log('🚫 401 Unauthorized - handling session expiry')

                // Clear any fallback tokens
                sessionManager.clearFallbackTokens()

                // Emit session expired event to notify AuthContext
                authEventEmitter.emit('sessionExpired')

                // Redirect to signin after a brief delay if not already on auth pages
                setTimeout(() => {
                    if (!window.location.pathname.includes('/auth/')) {
                        navigateInternal('/auth/signin')
                    }
                    // Reset the flag after redirect
                    isHandlingSessionExpiry = false
                }, 1000)
            }
        }

        return Promise.reject(error)
    }
)

export { api }
export default api
