// Capacitor native bridge — initializes native plugins when running inside Capacitor
// These calls are no-ops when running in a regular browser

export async function initNativeBridge() {
  const isNative = typeof (window as any).Capacitor !== "undefined";
  if (!isNative) return;

  try {
    // StatusBar — dark content on teal background
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#0e7490" });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch (e) {
    console.warn("StatusBar plugin not available:", e);
  }

  try {
    // Keyboard — auto-scroll inputs into view
    const { Keyboard } = await import("@capacitor/keyboard");
    Keyboard.addListener("keyboardWillShow", () => {
      document.body.classList.add("keyboard-open");
    });
    Keyboard.addListener("keyboardWillHide", () => {
      document.body.classList.remove("keyboard-open");
    });
  } catch (e) {
    console.warn("Keyboard plugin not available:", e);
  }

  try {
    // SplashScreen — auto-hide after content loads
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide({ fadeOutDuration: 300 });
  } catch (e) {
    console.warn("SplashScreen plugin not available:", e);
  }

  try {
    // App — handle back button and URL opens
    const { App } = await import("@capacitor/app");
    App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      }
    });
  } catch (e) {
    console.warn("App plugin not available:", e);
  }
}
