import { useEffect } from 'react';
import { authEventEmitter, sessionManager } from '../utils/api';

export const useSessionPersistence = () => {
    useEffect(() => {
        // Check for session validity when app starts or becomes visible
        const handleVisibilityChange = async () => {
            if (!document.hidden) {
                try {
                    // Check if session is still valid via cookies
                    const sessionValid = await sessionManager.verifySession();

                    if (!sessionValid) {
                        console.log('⚠️ Session no longer valid, attempting refresh...');
                        const refreshSuccess = await sessionManager.refreshAccessToken();

                        if (!refreshSuccess) {
                            console.log('❌ Session refresh failed on visibility change');
                            authEventEmitter.emit('sessionExpired');
                        } else {
                            console.log('✅ Session refreshed successfully on visibility change');
                        }
                    }
                } catch (error) {
                    console.error('❌ Failed to verify session on visibility change:', error);
                    // Don't immediately logout - let the next API call handle it
                }
            }
        };

        // Cross-tab communication for login/logout synchronization
        const handleStorageChange = async (e: StorageEvent) => {
            if (e.key === 'auth_event') {
                console.log('🔄 Cross-tab auth event detected:', e.newValue);

                if (e.newValue === 'login') {
                    // Another tab logged in - check if we should update our state
                    try {
                        const sessionValid = await sessionManager.verifySession();
                        if (sessionValid) {
                            await sessionManager.getCurrentUser();
                            authEventEmitter.emit('crossTabLogin');
                            console.log('✅ Cross-tab login detected - updating auth state');
                        }
                    } catch (error) {
                        console.error('❌ Error handling cross-tab login:', error);
                    }
                } else if (e.newValue === 'logout') {
                    // Another tab logged out - update our state
                    authEventEmitter.emit('crossTabLogout');
                    console.log('🚪 Cross-tab logout detected - updating auth state');
                }

                // Clear the event flag
                localStorage.removeItem('auth_event');
            }
        };

        // Set up automatic session health check (every 10 minutes)
        // Less frequent since we're using HttpOnly cookies which are more secure
        const healthCheckInterval = setInterval(async () => {
            try {
                const sessionValid = await sessionManager.verifySession();
                if (!sessionValid) {
                    console.log('🔄 Periodic session health check failed, attempting refresh...');
                    const refreshSuccess = await sessionManager.refreshAccessToken();

                    if (refreshSuccess) {
                        console.log('✅ Session refreshed automatically during health check');
                    } else {
                        console.log('❌ Automatic session refresh failed during health check');
                        // Don't emit logout here, let the next API call handle it
                    }
                }
            } catch (error) {
                console.error('❌ Session health check error:', error);
                // Don't emit logout here, let the next API call handle it
            }
        }, 10 * 60 * 1000); // 10 minutes

        // Listen for page visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Listen for page focus (when user returns to tab)
        window.addEventListener('focus', handleVisibilityChange);

        // Listen for cross-tab storage events
        window.addEventListener('storage', handleStorageChange);

        // Initial check when hook is mounted
        handleVisibilityChange();

        return () => {
            clearInterval(healthCheckInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleVisibilityChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);
};
