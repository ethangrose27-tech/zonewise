import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.zonewise.app",
  appName: "ZoneWise",
  webDir: "dist/public",
  // Server config — used during development only
  // Remove or comment out for production builds
  // server: {
  //   url: "http://192.168.1.XXX:5000",
  //   cleartext: true,
  // },
  ios: {
    scheme: "ZoneWise",
    contentInset: "always",
    preferredContentMode: "mobile",
    backgroundColor: "#f3f6f8",
    allowsLinkPreview: false,
    scrollEnabled: true,
  },
  plugins: {
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0e7490",
      overlaysWebView: false,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0e7490",
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
    Geolocation: {
      // Will request permission at runtime
    },
  },
};

export default config;
