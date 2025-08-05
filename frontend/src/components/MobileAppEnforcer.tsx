import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { useEffect } from "react";

/**
 * MobileAppEnforcer - Ensures the app runs in full mobile app mode
 * Hides address bars, browser UI, and enforces native app experience
 */
export const MobileAppEnforcer = () => {
  useEffect(() => {
    const initializeMobileApp = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Set dark status bar style and hide if possible
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: "#030637" });

          // Try to hide status bar for full immersion
          try {
            await StatusBar.hide();
          } catch {
            console.log("Status bar hide not supported on this device");
          }

          console.log("📱 Mobile app mode enforced - no browser interface");
        } catch (error) {
          console.log("⚠️ StatusBar not available:", error);
        }

        // Additional mobile app styling
        document.documentElement.style.setProperty(
          "--status-bar-height",
          "0px"
        );
        document.body.style.paddingTop = "0";

        // Hide any potential browser UI elements
        const meta = document.createElement("meta");
        meta.name = "mobile-web-app-capable";
        meta.content = "yes";
        document.head.appendChild(meta);

        const appleMeta = document.createElement("meta");
        appleMeta.name = "apple-mobile-web-app-capable";
        appleMeta.content = "yes";
        document.head.appendChild(appleMeta);

        const appleStatusMeta = document.createElement("meta");
        appleStatusMeta.name = "apple-mobile-web-app-status-bar-style";
        appleStatusMeta.content = "black-translucent";
        document.head.appendChild(appleStatusMeta);

        // Force fullscreen viewport
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
          viewportMeta.setAttribute(
            "content",
            "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
          );
        }

        // Override any window.open to prevent external browsers
        window.open = () => {
          console.log("🚫 window.open blocked - maintaining app experience");
          return null;
        };

        // Add CSS to ensure full coverage
        const style = document.createElement("style");
        style.textContent = `
          html, body {
            overflow-x: hidden;
            overscroll-behavior: none;
            -webkit-overflow-scrolling: touch;
            height: 100%;
            margin: 0;
            padding: 0;
          }
          
          body {
            padding-top: env(safe-area-inset-top) !important;
            padding-bottom: env(safe-area-inset-bottom) !important;
            padding-left: env(safe-area-inset-left) !important;
            padding-right: env(safe-area-inset-right) !important;
          }

          /* Hide any potential browser elements */
          .browser-chrome,
          .browser-toolbar,
          .address-bar {
            display: none !important;
          }

          /* Ensure app takes full screen */
          #root {
            min-height: 100vh;
            min-height: 100dvh;
          }
        `;
        document.head.appendChild(style);
      } else {
        console.log("🌐 Running in web browser mode");
      }
    };

    initializeMobileApp();
  }, []);

  return null; // This component doesn't render anything
};

export default MobileAppEnforcer;
