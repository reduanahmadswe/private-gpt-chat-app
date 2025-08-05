import { Capacitor } from "@capacitor/core";
import toast from "react-hot-toast";

/**
 * Global navigation utility to prevent browser popups in mobile app
 * All external navigation should go through this utility
 */

let globalLoadingOverlay: HTMLElement | null = null;

const createLoadingOverlay = (title: string, color: string = "#00f5ff") => {
    // Remove any existing overlay first
    removeLoadingOverlay();

    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = "global-navigation-loading";
    loadingOverlay.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(3, 6, 55, 0.95);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      color: white;
      font-family: system-ui;
    ">
      <div style="
        width: 50px;
        height: 50px;
        border: 4px solid ${color};
        border-top: 4px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
      "></div>
      <h2 style="margin: 0 0 10px; font-size: 20px;">${title}</h2>
      <p style="margin: 0; opacity: 0.8;">Please wait...</p>
      <style>
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    </div>
  `;

    document.body.appendChild(loadingOverlay);
    globalLoadingOverlay = loadingOverlay;

    // Auto-remove after 15 seconds (safety cleanup)
    setTimeout(() => {
        removeLoadingOverlay();
    }, 15000);

    return loadingOverlay;
};

const removeLoadingOverlay = () => {
    // Remove any global loading overlay
    if (globalLoadingOverlay && document.body.contains(globalLoadingOverlay)) {
        document.body.removeChild(globalLoadingOverlay);
        globalLoadingOverlay = null;
    }

    // Also remove specific OAuth overlays for compatibility
    const overlays = [
        "global-navigation-loading",
        "oauth-loading",
        "facebook-oauth-loading",
        "google-oauth-loading"
    ];

    overlays.forEach(id => {
        const overlay = document.getElementById(id);
        if (overlay && document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
    });
};

/**
 * Navigate to external URL with smooth mobile app experience
 */
export const navigateExternal = async (url: string, title: string = "Loading...", color?: string) => {
    try {
        if (Capacitor.isNativePlatform()) {
            console.log(`🔗 Navigating to ${url} (NO BROWSER POPUP - SAME WINDOW)...`);

            // Show loading overlay instead of browser popup
            createLoadingOverlay(title, color);

            // CRITICAL: Force same-window navigation in mobile app
            // This prevents any browser popup by staying in the same webview
            setTimeout(() => {
                window.location.replace(url);
            }, 500);
        } else {
            // For web browser - regular navigation
            window.location.href = url;
        }
    } catch (error) {
        console.error("❌ Navigation error:", error);
        removeLoadingOverlay();
        toast.error("Navigation failed");
    }
};

/**
 * Navigate to internal route with cleanup
 */
export const navigateInternal = (path: string) => {
    removeLoadingOverlay();
    window.location.href = path;
};

/**
 * Force cleanup of all loading overlays
 */
export const cleanupNavigation = () => {
    removeLoadingOverlay();
};

/**
 * OAuth navigation specifically for authentication
 */
export const navigateOAuth = async (url: string, provider: string) => {
    const title = `Signing in with ${provider}`;
    const colors = {
        google: "#00f5ff",
        facebook: "#1877F2",
        github: "#333333",
        default: "#00f5ff"
    };

    const color = colors[provider.toLowerCase() as keyof typeof colors] || colors.default;
    await navigateExternal(url, title, color);
};

// Auto-cleanup when page loads or auth completes
if (typeof window !== 'undefined') {
    window.addEventListener('load', cleanupNavigation);
    window.addEventListener('popstate', cleanupNavigation);

    // Listen for auth completion via URL params
    const checkAuthCompletion = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth') === 'success') {
            cleanupNavigation();
        }
    };

    // Check on load and route changes
    checkAuthCompletion();
    setInterval(checkAuthCompletion, 1000);
}
