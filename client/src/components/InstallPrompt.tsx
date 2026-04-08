import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Share, Plus } from "lucide-react";

// Detect if running inside Capacitor (native iOS/Android app)
function isCapacitor(): boolean {
  return typeof (window as any).Capacitor !== "undefined" && (window as any).Capacitor?.isNativePlatform?.();
}

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Never show install prompt inside the native Capacitor app
    if (isCapacitor()) return;

    // Check if already in standalone mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Detect iOS Safari
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Check if dismissed this session (use in-memory flag since sessionStorage is blocked in sandboxed iframes)
    if ((window as any).__installDismissed) return;

    // Show prompt after delay if not standalone
    if (!standalone) {
      const timer = setTimeout(() => setShow(true), 4000);
      return () => clearTimeout(timer);
    }

    // Listen for beforeinstallprompt (Chrome/Android)
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setShow(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    (window as any).__installDismissed = true;
  };

  if (!show || isStandalone || isCapacitor()) return null;

  return (
    <div
      className="fixed inset-x-0 z-[2000] p-3"
      style={{ bottom: `calc(0.75rem + env(safe-area-inset-bottom, 0px))` }}
      data-testid="install-prompt"
    >
      <div className="max-w-sm mx-auto bg-card border border-border rounded-2xl shadow-xl p-4 flex items-start gap-3">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "hsl(var(--primary))" }}
        >
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M6 8h20v3H11l14 12v3H6v-3h15L7 11V8z" fill="white" />
            <circle cx="24" cy="9" r="3" fill="white" opacity="0.7" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Install ZoneWise</p>

          {isIOS ? (
            <div className="mt-1">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tap{" "}
                <Share className="w-3.5 h-3.5 inline mx-0.5 -mt-0.5" />
                {" "}then{" "}
                <span className="font-medium text-foreground">Add to Home Screen</span>
                {" "}
                <Plus className="w-3.5 h-3.5 inline mx-0.5 -mt-0.5" />
                {" "}to install as an app on your iPhone.
              </p>
            </div>
          ) : (
            <div className="mt-1">
              <p className="text-xs text-muted-foreground mb-2">
                Add to your home screen for quick access, offline support, and a native app experience.
              </p>
              {deferredPrompt && (
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="h-8 text-xs rounded-lg"
                  data-testid="button-install"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Install App
                </Button>
              )}
            </div>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors touch-target shrink-0"
          data-testid="button-dismiss-install"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
