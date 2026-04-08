import { useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ShieldQuestion,
  Loader2,
  ExternalLink,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface LicenseResult {
  status: string;
  licenseNumber: string;
  name?: string;
  licenseType?: string;
  licenseStatus?: string;
  expires?: string;
  message?: string;
  verifyUrl?: string;
  timestamp?: string;
}

const STATUS_CONFIG: Record<string, {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
  description: string;
}> = {
  active: {
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-800",
    label: "Active",
    description: "This license is current and in good standing with FL DBPR.",
  },
  inactive: {
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    label: "Inactive",
    description: "This license is currently inactive. The contractor may not perform licensed work.",
  },
  delinquent: {
    icon: AlertTriangle,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    borderColor: "border-orange-200 dark:border-orange-800",
    label: "Delinquent",
    description: "This license has delinquent status — likely unpaid fees or expired renewal.",
  },
  revoked: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
    label: "Revoked",
    description: "This license has been revoked. Do NOT hire this contractor.",
  },
  suspended: {
    icon: ShieldX,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
    label: "Suspended",
    description: "This license is suspended. The contractor cannot legally perform work.",
  },
  null_void: {
    icon: XCircle,
    color: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
    label: "Null & Void",
    description: "This license is null and void. Do NOT hire this contractor.",
  },
  not_found: {
    icon: ShieldQuestion,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-900",
    borderColor: "border-gray-200 dark:border-gray-700",
    label: "Not Found",
    description: "No license found. Verify the number or check for county-level licenses.",
  },
  found: {
    icon: Info,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
    label: "Found",
    description: "License found in DBPR database. Click to view full details.",
  },
  unavailable: {
    icon: ShieldAlert,
    color: "text-gray-500 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-900",
    borderColor: "border-gray-200 dark:border-gray-700",
    label: "Check Manually",
    description: "Real-time verification unavailable. Use the official DBPR portal.",
  },
  unknown: {
    icon: ShieldQuestion,
    color: "text-gray-500 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-900",
    borderColor: "border-gray-200 dark:border-gray-700",
    label: "Unknown",
    description: "Status could not be determined. Verify on the official DBPR portal.",
  },
};

export default function LicenseVerifier() {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LicenseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = useCallback(async () => {
    const num = licenseNumber.trim().toUpperCase();
    if (!num) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await apiRequest("GET", `/api/verify-license?license=${encodeURIComponent(num)}`);
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Verification failed. Try the DBPR portal directly.");
    } finally {
      setLoading(false);
    }
  }, [licenseNumber]);

  const statusConfig = result ? (STATUS_CONFIG[result.status] || STATUS_CONFIG.unknown) : null;
  const StatusIcon = statusConfig?.icon || ShieldQuestion;

  return (
    <div className="space-y-4" data-testid="license-verifier">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">Verify Contractor License</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Enter a FL license number to check its status with DBPR in real-time.
          </p>
        </div>
      </div>

      {/* Quick prefix buttons */}
      <div>
        <p className="text-[11px] text-muted-foreground mb-1.5">Common prefixes:</p>
        <div className="flex flex-wrap gap-1.5">
          {["CGC", "CCC", "CFC", "CAC", "EC", "CBC", "CPC"].map((prefix) => (
            <button
              key={prefix}
              onClick={() => {
                setLicenseNumber(prefix);
                setResult(null);
                setError(null);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors font-mono font-medium touch-target"
              style={{ minHeight: 36 }}
              data-testid={`prefix-${prefix}`}
            >
              {prefix}
            </button>
          ))}
        </div>
      </div>

      {/* Input row */}
      <div className="flex gap-2">
        <Input
          data-testid="input-license-number"
          placeholder="e.g., CGC1234567"
          value={licenseNumber}
          onChange={(e) => {
            setLicenseNumber(e.target.value.toUpperCase());
            setResult(null);
            setError(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
          className="flex-1 font-mono text-base uppercase tracking-widest h-12 rounded-xl"
          maxLength={15}
        />
        <Button
          onClick={handleVerify}
          disabled={loading || !licenseNumber.trim()}
          className="h-12 px-5 rounded-xl font-semibold"
          data-testid="button-verify-license"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Search className="w-4 h-4 mr-1.5" />
              Verify
            </>
          )}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p>{error}</p>
            <a
              href="https://www.myfloridalicense.com/wl11.asp?mode=0&SID="
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-1.5 text-primary hover:underline text-xs"
            >
              Verify on DBPR <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Result badge */}
      {result && statusConfig && (
        <div
          className={`rounded-2xl border ${statusConfig.borderColor} ${statusConfig.bgColor} overflow-hidden result-badge`}
          data-testid="license-result"
        >
          {/* Status header */}
          <div className="p-4 flex items-start gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${statusConfig.bgColor}`}
              style={{ border: `1.5px solid`, borderColor: "inherit" }}
            >
              <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-base font-bold text-foreground">{result.licenseNumber}</span>
                <Badge
                  className={`text-xs px-2.5 py-0.5 font-semibold ${
                    result.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700"
                      : result.status === "revoked" || result.status === "suspended" || result.status === "null_void"
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700"
                      : result.status === "delinquent" || result.status === "inactive"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  }`}
                  variant="outline"
                >
                  {statusConfig.label}
                </Badge>
              </div>

              {result.name && result.name !== "See DBPR portal for details" && (
                <p className="text-sm font-medium text-foreground mt-1">{result.name}</p>
              )}
              {result.licenseType && (
                <p className="text-xs text-muted-foreground">{result.licenseType}</p>
              )}
            </div>
          </div>

          {/* Status description */}
          <div className="px-4 pb-3">
            <p className="text-xs text-muted-foreground">{statusConfig.description}</p>
            {result.message && (
              <p className="text-xs text-muted-foreground mt-1">{result.message}</p>
            )}
          </div>

          {/* Action links */}
          <div className="border-t border-inherit px-4 py-3 flex items-center justify-between">
            <a
              href={result.verifyUrl || "https://www.myfloridalicense.com/wl11.asp?mode=0&SID="}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
              data-testid="link-verify-dbpr"
            >
              View on FL DBPR <ExternalLink className="w-3 h-3" />
            </a>
            {result.timestamp && (
              <span className="text-[10px] text-muted-foreground">
                Checked {new Date(result.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
