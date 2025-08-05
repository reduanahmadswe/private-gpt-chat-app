import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aibondhu.chat',
  appName: 'AI Bondhu',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    overrideUserAgent: 'AI-Bondhu-Mobile-App/1.0',
    // Force app mode (no browser interface)
    webContentsDebuggingEnabled: false,
    loggingBehavior: 'none'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#030637',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#00f5ff',
      splashFullScreen: true,
      splashImmersive: true
    },
    Browser: {
      // CRITICAL: Prevent browser popups completely
      windowName: '_self',
      toolbarColor: 'transparent',
      presentationStyle: 'fullscreen',
      androidCustomTabsColors: {
        toolbarColor: 'transparent',
        secondaryToolbarColor: 'transparent',
        statusBarColor: '#030637'
      },
      // Force same-window navigation (no popup)
      windowFeatures: 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#030637'
    }
  }
};

export default config;
